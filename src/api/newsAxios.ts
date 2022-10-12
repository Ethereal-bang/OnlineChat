import {myAxios} from "./myAxios";
import {idGetter} from "../utils/idStorage";
import {RcFile} from "antd/es/upload";

export const sendNewsApi = (receiver: number, content: string, word: string) => {
    return myAxios.post("/news/send", {
        sender: idGetter(),
        receiver,
        content,
        word,
    })
}

// 与某人的全部对话
export const getDialogue = (contact: number) => {
    return myAxios("/news/getDialogue", {
        params: {
            id: idGetter(),
            contact,
        }
    })
}

// 上传表情包
export const uploadEmoji = (file: RcFile) => {
    const url = `images/uploadEmoji/${idGetter()}`
    const formData = new FormData();
    formData.append("file", file);
    return myAxios.post(url, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })
}

// 获取用户表情包
export const getEmojis = () => {
    return myAxios(`/images/emoji/${idGetter()}`);
}
