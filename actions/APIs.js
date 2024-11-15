export const BASE_URL = 'http://192.168.75.200:8000';
export const MusicAPI = 'https://deezerdevs-deezer.p.rapidapi.com/search';
export const MusciAPIKey = '68303a6587msh680563c03abefcdp146c4fjsn5420df37bfb4';

export const ENDPOINTS = {
    registration: BASE_URL + '/api/register/',
    googleRegistration: BASE_URL + '/api/google-register/',
    login: BASE_URL + '/api/login/',
    verifyOtp: BASE_URL + '/api/verify-otp/',
    contactUs: BASE_URL + '/api/contact/',
    mergeVideo: BASE_URL + '/api/merge-video/',
    removeMergedVideo: BASE_URL + '/api/remove-merged-video/',
    categories: BASE_URL + '/api/categories/',
    banners: BASE_URL + '/api/api/banners/',
    liveCompetitions: BASE_URL + '/api/api/competitions/',
    postCreate: BASE_URL + '/api/posts/',
    postedVideos: BASE_URL + '/api/list-posts/',
    postLikes: BASE_URL + '/api/list-likes/',
    likePost: BASE_URL + '/api/like-post/',
    postComments: BASE_URL + '/api/list-comments/',
    postComment: BASE_URL + '/api/comment-post/',
    makePayment: BASE_URL + '/api/make-payment/',
};
