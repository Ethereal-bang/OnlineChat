import {idGetter} from "../../utils/idStorage";
import {Navigate} from "react-router-dom";
import {ReactNode} from "react";
import Websocket from "../../api/websocket";

interface Props {
    children: ReactNode,
}

export function Auth(props: Props) {
    // 已登录
    if (idGetter()) {
        console.log("connect")
        Websocket.getInstance();    // 连接ws
        return <>{props.children}</>
    }
    // 未登录
    else {
        return <Navigate to={"/login"} replace />
    }
}