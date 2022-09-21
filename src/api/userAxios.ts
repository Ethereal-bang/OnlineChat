import {myAxios} from "./myAxios";

// 登录
export const login = (id: number, password: string) => {
    return myAxios("/user/login", {
        params: {
            id,
            password,
        }
    })
}

// 获取用户信息
export const getInfo = (id: number) => {
    const url = `/user/getInfo/${id}`
    return myAxios(url);
}

// 修改用户信息
export const modifyProfile = (key: "name" | "word" | "avatar", val: string) => {
    const url = `/user/modify/${key}?val=${val}`;
    return myAxios(url);
}