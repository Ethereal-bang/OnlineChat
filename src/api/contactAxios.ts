import {myAxios} from "./myAxios";
import {idGetter} from "../utils/idStorage";

// 查询
export const searchUser = (keyword: string) => {
    return myAxios(`contact/search/${keyword}`, {
        params: {
            id: idGetter(),
        }
    })
}

// 发送好友申请
export const applyFriend = (id: number) => {
    return myAxios("contact/add", {
        params: {
            id: idGetter(),
            contact: id,
        }
    })
}

// 请求申请列表
export const getApplicationList = () => {
    return myAxios(`/contact/getAddList/${idGetter()}`);
}

// 同意/拒绝好友申请
export const handleApplication = (contact: number, state: 1 | 2) => {
    return myAxios("/contact/handleApplication", {
        params: {
            id: idGetter(),
            contact,
            state,
        },
    });
}