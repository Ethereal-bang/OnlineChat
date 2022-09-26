import {idGetter} from "../utils/idStorage";

export default function Websocket() {
    const ws = new WebSocket(`ws://localhost:8080/websocket/${idGetter()}`);
    ws.onopen = () => {
        ws.send("Hello")
    }
    ws.onmessage = (event) => {
        console.log(event.data)
    }
    return ws;
}