import apiService from './apiService';

const resource = 'articulos/';

const options = {
    headers: { 'x-access-token': localStorage.getItem('token') },
};

export default {
    get(params) {
        return apiService.get(`${resource}${params}`, options);
    },

    put(params, data) {
        return apiService.put(`${resource}${params}`, data, options);
    },

    post(params, data) {
        return apiService.post(`${resource}${params}`, data, options);
    },

    delete(params) {
        return apiService.delete(`${resource}${params}`, options);
    }
}