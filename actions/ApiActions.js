import axios from "axios";
import { ENDPOINTS, MusicAPI, MusciAPIKey } from "./APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToastAndroid } from "react-native";


const logoutUser = async(navigation)=>{
    await AsyncStorage.removeItem('AuthToken');
    await AsyncStorage.removeItem('AuthUser');
    await AsyncStorage.removeItem('AuthId');
    await AsyncStorage.removeItem('RegAuthId');
    await AsyncStorage.removeItem('AuthEmail');
    ToastAndroid.show('Session expired, please login!', ToastAndroid.SHORT);
    navigation.navigate('Login');
};

const getAuthToken = async () => {
    try {
        const token = await AsyncStorage.getItem("AuthToken");
        console.log('Token:', token);
        return token || null;
    } catch (error) {
        console.error("Error fetching AuthToken:", error);
        return null;
    }
};

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

export const contactUs = async (navigation, data) => {
    try {
        const token = await getAuthToken();
        const response = await axios.post(ENDPOINTS.contactUs, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        console.log('Registration API error:', error?.response?.data);
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
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

export const mergeVideo = async (navigation, data) => {
    try {
        const token = await getAuthToken();
        const response = await axios.post(ENDPOINTS.mergeVideo, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return [response.status, response.data];
    } catch (error) {
        console.log('Error:', error?.response?.data);
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const removeMergedVideo = async (navigation, data) => {
    try {
        const token = await getAuthToken();
        const response = await axios.post(ENDPOINTS.removeMergedVideo, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        console.log('Error:', error?.response?.data);
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const getCategories = async (navigation) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(ENDPOINTS.categories, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const getBanners = async (navigation, id) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(ENDPOINTS.banners + (id ? id : ''), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const getCompetitions = async (navigation, category_id) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(`${ENDPOINTS.competitions}?category_id=${category_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const myCompetitions = async (navigation) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(ENDPOINTS.myCompetitions, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const postCreate = async (navigation, data) => {
    try {
        const token = await getAuthToken();
        const response = await axios.patch(ENDPOINTS.postCreate, data, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          });
        return [response.status, response.data];
    } catch (error) {
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const listParticipantsVideos = async (navigation) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(ENDPOINTS.listParticipantsVideos, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const userVideos = async (navigation) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(ENDPOINTS.userVideos, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const postLikes = async (navigation, post_id) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(ENDPOINTS.postLikes + post_id, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const likePost = async (navigation, data) => {
    try {
        const token = await getAuthToken();
        const response = await axios.post(ENDPOINTS.likePost, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const postComments = async (navigation, post_id) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(ENDPOINTS.postComments + post_id, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const postComment = async (navigation, data) => {
    try {
        const token = await getAuthToken();
        const response = await axios.post(ENDPOINTS.postComment, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const makePayment = async (navigation, data) => {
    try {
        const token = await getAuthToken();
        const response = await axios.post(ENDPOINTS.makePayment, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        console.log('error?.response?.data>>>', error?.response?.data);
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const profile = async (navigation) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(ENDPOINTS.profile, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const updateProfile = async (navigation, data) => {
    try {
        const token = await getAuthToken();
        const response = await axios.patch(ENDPOINTS.profile, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};
