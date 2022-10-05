import {myAxios} from "./myAxios";
import {idGetter} from "../utils/idStorage";

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
