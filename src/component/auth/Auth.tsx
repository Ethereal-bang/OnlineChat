import {idGetter} from "../../utils/idStorage";
import {Navigate} from "react-router-dom";
import {ReactNode} from "react";
import websocket from "../../api/websocket";

interface Props {
    children: ReactNode,
}

export default function Auth(props: Props) {
    // 已登录
    if (idGetter()) {
        // 连接ws
        websocket();
        return <>{props.children}</>
    }
    // 未登录
    else {
        return <Navigate to={"/login"} replace />
    }
}