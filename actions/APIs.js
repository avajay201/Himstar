export const BASE_URL = 'http://192.168.75.200:8000';
export const API_BASE_URL = 'http://192.168.75.200:8000/api';
export const MusicAPI = 'https://deezerdevs-deezer.p.rapidapi.com/search';
export const MusciAPIKey = '68303a6587msh680563c03abefcdp146c4fjsn5420df37bfb4';

export const ENDPOINTS = {
    registration: API_BASE_URL + '/register/',
    googleRegistration: API_BASE_URL + '/google-register/',
    login: API_BASE_URL + '/login/',
    verifyOtp: API_BASE_URL + '/verify-otp/',
    contactUs: API_BASE_URL + '/contact/',
    mergeVideo: API_BASE_URL + '/merge-video/',
    removeMergedVideo: API_BASE_URL + '/remove-merged-video/',
    categories: API_BASE_URL + '/categories/',
    banners: API_BASE_URL + '/banners/',
    competitions: API_BASE_URL + '/competitions/',
    postCreate: API_BASE_URL + '/participant-update/',
    listParticipantsVideos: API_BASE_URL + '/list-posts/',
    postLikes: API_BASE_URL + '/list-likes/',
    likePost: API_BASE_URL + '/like-post/',
    postComments: API_BASE_URL + '/list-comments/',
    postComment: API_BASE_URL + '/comment-post/',
    makePayment: API_BASE_URL + '/make-payment/',
    userVideos: API_BASE_URL + '/user-videos/',
    myCompetitions: API_BASE_URL + '/my-competitions/',
    profile: API_BASE_URL + '/profile/',
};
