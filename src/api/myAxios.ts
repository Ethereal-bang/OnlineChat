import axios from "axios";

export const myAxios = axios.create({
    baseURL: "http://localhost:8080",
    method: "get",
})

myAxios.interceptors.request.use(
    config => {
        console.log(config);
        return config;
    }, err => {
        return Promise.reject(err);
    }
)

myAxios.interceptors.response.use(response => {
    console.log(response.data)
    return response;
})

