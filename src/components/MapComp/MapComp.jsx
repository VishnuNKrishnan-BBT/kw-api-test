import React, { useState, useEffect, useRef } from 'react'
import Map, { Source, Layer, Marker } from 'react-map-gl'
import mapStyles from './MapComp.module.css'
import GoogleIcon from '../GoogleIcon/GoogleIcon'
import InputWithIcon from '../InputWithIcon/InputWithIcon'

function MapComp() {

    const mapRef = useRef(null)

    const [position, setPosition] = useState(null);
    const [error, setError] = useState(null);

    const [viewport, setViewport] = useState({
        latitude: position?.latitude || 25.0,
        longitude: position?.longitude || 55.0,
        zoom: 12,
        pitch: 75,
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
                    latitude: pos.coords.latitude || 25.0,
                    longitude: pos.coords.longitude || 55.0,
                    speed: `${(pos.coords.speed / 3.6)?.toFixed(3)} km/h` || 'NA', // Speed in meters per second
                    heading: pos.coords.heading?.toFixed(3) || 'NA', // Orientation in degrees, 0-360
                    accuracy: pos.coords.accuracy?.toFixed(3) || 'NA', // Accuracy in meters
                })

                setViewport({
                    latitude: pos.coords.latitude || 25.0,
                    longitude: pos.coords.longitude || 55.0,
                    zoom: viewport.zoom,
                    pitch: viewport.pitch,
                    bearing: viewport.bearing
                })
            },
            (err) => {
                setError(err.message);
            },
            options
        )

        return () => {
            navigator.geolocation.clearWatch(watchId);
        }
    }, [])

    return (
        <div className={`${mapStyles.wrapper}`}>
            <Map
                {...viewport}
                ref={mapRef}
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
                </Source>
                <Marker
                    latitude={position?.latitude || 25.0}
                    longitude={position?.latitude || 55.0}
                >
                    <div className={mapStyles.mapMarker}>
                        <img src={'https://upload.wikimedia.org/wikipedia/commons/9/93/Map_marker_font_awesome.svg'} alt="" />
                        {/* <GoogleIcon iconName={'assistant_navigation'} /> */}

                    </div>
                </Marker>
            </Map>

            <div className={`${mapStyles.dataHolder}`}>
                <div className={mapStyles.dataCard}>
                    <span className={`${mapStyles.coords}`}><GoogleIcon iconName={'swap_horiz'} style={{ marginRight: '3px', fontWeight: 200 }} />{position?.latitude}</span>
                </div>
                <div className={mapStyles.dataCard}>
                    <span className={`${mapStyles.coords}`}><GoogleIcon iconName={'swap_vert'} style={{ marginRight: '3px', fontWeight: 200 }} />{position?.longitude}</span>
                </div>
                <div className={mapStyles.dataCard}>
                    <span className={`${mapStyles.coords}`}><GoogleIcon iconName={'speed'} style={{ marginRight: '3px', fontWeight: 200 }} />{position?.speed}</span>
                </div>
                <div className={mapStyles.dataCard}>
                    <span className={`${mapStyles.coords}`}><GoogleIcon iconName={'explore'} style={{ marginRight: '3px', fontWeight: 200 }} />{position?.heading}</span>
                </div>
                <div className={mapStyles.dataCard}>
                    <span className={`${mapStyles.coords}`}><GoogleIcon iconName={'zoom_in_map'} style={{ marginRight: '3px', fontWeight: 200 }} />{position?.accuracy}</span>
                </div>
            </div>
        </div>
    )
}

export default MapComp
