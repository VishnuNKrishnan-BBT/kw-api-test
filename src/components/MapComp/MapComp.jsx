import React, { useState, useEffect, useRef } from 'react'
import Map, { Source, Layer, Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import mapStyles from './MapComp.module.css'
import GoogleIcon from '../GoogleIcon/GoogleIcon'
import CommsDisplay from '../CommsDisplay/CommsDisplay'
import { uploadWaypoint } from '../../helpers/uploadWaypoint'
import VehicleTop from '../assets/vehicleTop0.png'

function MapComp() {

    const mapRef = useRef(null)

    const [position, setPosition] = useState({});
    const [error, setError] = useState(null);

    const [sentContent, setSentContent] = useState('')
    const [receivedContent, setReceivedContent] = useState('')

    const [viewport, setViewport] = useState({
        latitude: position?.latitude || 25.0,
        longitude: position?.longitude || 55.0,
        zoom: 18,
        pitch: 0,
        bearing: 0
    })

    const dataOne = {
        type: "Feature",
        properties: {},
        geometry: {
            type: "LineString",
            coordinates: [position?.latitude, position?.longitude]
        }
    }

    var newPosition = {}
    var newLeg = true //Initial value. Will update to false after first upload

    const periodicUpload = async (position) => {
        const timestamp = Date.now()

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'your-secret-token'
        };

        console.log(position);

        const apiBody = {
            timestamp: timestamp,
            trackerId: 'API_TEST_MOB',
            newLeg: newLeg,
            ...position
        }

        setSentContent(apiBody)
        const response = await uploadWaypoint(apiBody, headers)
        setReceivedContent(response)
        navigator?.vibrate(400)

        if (response?.status == 200) {
            newLeg = false
        }
    }



    useEffect(() => {
        const options = {
            enableHighAccuracy: true,   // Request high-accuracy location data
            timeout: 5000,              // Maximum time (in milliseconds) to wait for location data
            maximumAge: 0               // Maximum age (in milliseconds) of cached location data
        };

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                // alert(JSON.stringify(pos))
                setPosition({
                    latitude: pos.coords.latitude || undefined,
                    longitude: pos.coords.longitude || undefined,
                    speed: `${(pos.coords.speed * 3.6)?.toFixed(0)} km/h` || undefined, // Speed in meters per second
                    heading: pos.coords.heading?.toFixed(3) || undefined, // Orientation in degrees, 0-360
                    accuracy: pos.coords.accuracy?.toFixed(3) || undefined, // Accuracy in meters
                })

                newPosition = {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    speed: pos.coords.speed || 0, // Speed in meters per second
                    heading: pos.coords.heading?.toFixed(3) || 0, // Orientation in degrees, 0-359
                    accuracy: pos.coords.accuracy?.toFixed(3) || null, // Accuracy in meters
                }

                // setViewport({
                //     latitude: pos.coords.latitude || 25.0,
                //     longitude: pos.coords.longitude || 55.0,
                //     zoom: viewport.zoom,
                //     pitch: viewport.pitch,
                //     bearing: viewport.bearing
                // })
                mapRef.current?.flyTo({ center: [pos.coords.longitude || 55.0, pos.coords.latitude || 25.0], duration: 2000 })
            },
            (err) => {
                setError(err.message);
            },
            options
        )

        const interval = setInterval(() => { periodicUpload(newPosition) }, 2000)

        return () => {
            clearInterval(interval)
            navigator.geolocation.clearWatch(watchId);
        }
    }, [])

    const [consoleExpanded, setConsoleExpanded] = useState(false)
    const toggleConsole = () => {
        setConsoleExpanded(!consoleExpanded)
    }

    return (
        <div className={`${mapStyles.wrapper}`}>
            <CommsDisplay
                sentContent={sentContent}
                receivedContent={receivedContent}
                expanded={consoleExpanded}
            />
            <div className={`${mapStyles.consoleToggleBtn}`} onClick={toggleConsole}>
                <GoogleIcon iconName={'data_object'} style={{ fontSize: '35px', fontWeight: 900 }} />
            </div>
            <Map
                attributionControl={false}
                {...viewport}
                ref={mapRef}
                height={"100%"}
                width={"100%"}
                projection={"globe"}
                mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
                mapStyle={"mapbox://styles/mapbox/streets-v12"}
                onMove={evt => setViewport(evt.viewState)}
            >
                <Source id="polylineLayer" type="geojson" data={dataOne}>
                    <Layer
                        id="lineLayer"
                        type="line"
                        source="my-data"
                        layout={{
                            "line-join": "round",
                            "line-cap": "round"
                        }}
                        paint={{
                            "line-color": "rgba(0,0,0,1)",
                            "line-width": 3
                        }}
                    />

                    {!!position?.latitude && !!position?.longitude &&
                        <Marker
                            anchor='center'
                            latitude={position?.latitude}
                            longitude={position?.longitude}
                            pitchAlignment='map'
                            rotationAlignment='map'
                        >
                            <div className={mapStyles.mapMarker} style={{ transform: `rotate(${position?.heading}deg)` }}>
                                <img src={VehicleTop} alt="" />
                            </div>
                        </Marker>}
                </Source>
            </Map>

            <div className={`${mapStyles.dataHolder}`}>
                <div className={mapStyles.dataCard}>
                    <span className={`${mapStyles.coords}`}><GoogleIcon iconName={'swap_horiz'} style={{ marginRight: '3px', fontWeight: 200 }} />{position?.latitude || 'NA'}</span>
                </div>
                <div className={mapStyles.dataCard}>
                    <span className={`${mapStyles.coords}`}><GoogleIcon iconName={'swap_vert'} style={{ marginRight: '3px', fontWeight: 200 }} />{position?.longitude || 'NA'}</span>
                </div>
                <div className={mapStyles.dataCard}>
                    <span className={`${mapStyles.coords}`}><GoogleIcon iconName={'speed'} style={{ marginRight: '3px', fontWeight: 200 }} />{position?.speed ? `${position?.speed * 3.6} km/h` : 'NA'}</span>
                </div>
                <div className={mapStyles.dataCard}>
                    <span className={`${mapStyles.coords}`}><GoogleIcon iconName={'explore'} style={{ marginRight: '3px', fontWeight: 200 }} />{position?.heading || 'NA'}</span>
                </div>
                <div className={mapStyles.dataCard}>
                    <span className={`${mapStyles.coords}`}><GoogleIcon iconName={'zoom_in_map'} style={{ marginRight: '3px', fontWeight: 200 }} />{position?.accuracy || 'NA'}</span>
                </div>
            </div>
        </div>
    )
}

export default MapComp
