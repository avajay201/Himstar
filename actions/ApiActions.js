import axios from "axios";
import { ENDPOINTS, MusicAPI, MusciAPIKey } from "./APIs";

export const userRegistration = async (data) => {
    try {
        const response = await axios.post(ENDPOINTS.registration, data);
        return [response.status, response.data];
    } catch (error) {
        console.log('Registration API error:', error?.response?.data);
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const userGoogleRegistration = async (data) => {
    try {
        const response = await axios.post(ENDPOINTS.googleRegistration, data);
        return [response.status, response.data];
    } catch (error) {
        console.log('Registration API error:', error?.response?.data);
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const userLogin = async (data) => {
    try {
        const response = await axios.post(ENDPOINTS.login, data);
        return [response.status, response.data];
    } catch (error) {
        console.log('Registration API error:', error?.response?.data);
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const verifyOtp = async (data) => {
    try {
        const response = await axios.post(ENDPOINTS.verifyOtp, data);
        return [response.status, response.data];
    } catch (error) {
        console.log('Registration API error:', error?.response?.data);
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const contactUs = async (data) => {
    try {
        const response = await axios.post(ENDPOINTS.contactUs, data);
        return [response.status, response.data];
    } catch (error) {
        console.log('Registration API error:', error?.response?.data);
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const searchMusic = async (query = 'diljit') => {
    const options = {
        method: 'GET',
        url: MusicAPI,
        params: { q: query },
        headers: {
            'x-rapidapi-key': MusciAPIKey,
            'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
        }
    };
    try {
        const response = await axios.request(options);
        return response.data.data;
    } catch (error) {
        return false;
    }
};

export const mergeVideo = async (data) => {
    try {
        console.log('0000000000000000')
        const response = await axios.post(ENDPOINTS.mergeVideo, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return [response.status, response.data];
    } catch (error) {
        console.log('Error:', error?.response?.data);
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};