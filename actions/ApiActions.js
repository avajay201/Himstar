import axios from "axios";
import { ENDPOINTS } from "./APIs";

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
