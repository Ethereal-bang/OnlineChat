import axios from "axios";

export const myAxios = axios.create({
    baseURL: "http://onlinechatapi.giantcat.top",
    method: "get",
})

myAxios.interceptors.request.use(
    config => {
        return config;
    }, err => {
        return Promise.reject(err);
    }
)

myAxios.interceptors.response.use(response => {
    return response;
})

