import {myAxios} from "./myAxios";

export const login = (id: number, password: string) => {
    return myAxios("/user/login", {
        params: {
            id,
            password,
        }
    })
}