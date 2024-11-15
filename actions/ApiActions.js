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

export const removeMergedVideo = async (data) => {
    try {
        const response = await axios.post(ENDPOINTS.removeMergedVideo, data);
        return [response.status, response.data];
    } catch (error) {
        console.log('Error:', error?.response?.data);
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const getCategories = async () => {
    try {
        const response = await axios.get(ENDPOINTS.categories);
        return [response.status, response.data];
    } catch (error) {
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const getBanners = async (id) => {
    try {
        const response = await axios.get(ENDPOINTS.banners + (id ? id : ''));
        return [response.status, response.data];
    } catch (error) {
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const getLiveCompetitions = async (id) => {
    try {
        const response = await axios.get(ENDPOINTS.liveCompetitions + (id ? id : ''));
        return [response.status, response.data];
    } catch (error) {
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const postCreate = async (data) => {
    try {
        const response = await axios.post(ENDPOINTS.postCreate, data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        return [response.status, response.data];
    } catch (error) {
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const postedVideos = async (id) => {
    try {
        const response = await axios.get(ENDPOINTS.postedVideos + id);
        return [response.status, response.data];
    } catch (error) {
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const postLikes = async (post_id) => {
    try {
        const response = await axios.get(ENDPOINTS.postLikes + post_id);
        return [response.status, response.data];
    } catch (error) {
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const likePost = async (data) => {
    try {
        const response = await axios.post(ENDPOINTS.likePost, data);
        return [response.status, response.data];
    } catch (error) {
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const postComments = async (post_id) => {
    try {
        const response = await axios.get(ENDPOINTS.postComments + post_id);
        return [response.status, response.data];
    } catch (error) {
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const postComment = async (data) => {
    try {
        const response = await axios.post(ENDPOINTS.postComment, data);
        return [response.status, response.data];
    } catch (error) {
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const makePayment = async (data) => {
    try {
        const response = await axios.post(ENDPOINTS.makePayment, data);
        return [response.status, response.data];
    } catch (error) {
        console.log('error?.response?.data>>>', error?.response?.data);
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};
