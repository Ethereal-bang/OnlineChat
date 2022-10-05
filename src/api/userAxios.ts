import {myAxios} from "./myAxios";
import {RcFile} from "antd/es/upload";
import {idGetter} from "../utils/idStorage";

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
    const url = `/user/modify/${key}?val=${val}&id=${idGetter()}`;
    return myAxios(url);
}

// 上传图片
export const uploadFile = (file: RcFile) => {
    const formData = new FormData();
    formData.append("file", file);
    return myAxios.post("user/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
}
