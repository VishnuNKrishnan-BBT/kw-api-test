import axios from "axios"

export const uploadWaypoint = async (waypointObj, headers) => {
    try {
        // Make a POST request to your API endpoint
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/addWaypoint`, waypointObj, { headers });

        // Handle the response as needed
        return response.data
    } catch (error) {
        // Handle errors
        return error
    }
}