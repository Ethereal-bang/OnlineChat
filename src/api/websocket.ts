import {idGetter} from "../utils/idStorage";
import {WsNews} from "../utils/interface";

export default class Websocket {
    private ws: WebSocket;
    private eventCenter: EventCenter = new EventCenter();
    static instance: Websocket;    // 单例模式

    constructor() {
        this.ws = new WebSocket(`ws://localhost:8080/websocket/${idGetter()}`);
        this.ws.onmessage = (event) => {
            const data: WsNews = JSON.parse(event.data);    // 解析为JSON
            this.eventCenter.emit(data.type, data.message, data.data);  // 发往消息中心
        }
    }

    // 返回单例
    static getInstance() {
        if (!this.instance) {   // 第一次调用时
            this.instance = new Websocket();
        }
        return this.instance;
    }

    // 订阅事件
    subscribe(eventName: string, callback: Function) {
        this.eventCenter.on(eventName, callback);
    }

    // 删除回调
    off(eventName: string, callback: Function) {
        this.eventCenter.off(eventName, callback);
    }

}

// 消息管理中心(通过事件类型管理不同事件回调
class EventCenter {
    private events: any;    // {事件1: [回调1, ...], ..}

    constructor() {
        this.events = {};
    }

    // 添加事件回调
    on(eventName: string, callback: Function) {
        const eventCallbacks: Function[] = this.events[eventName];
        eventCallbacks    // 原先是否已加入其他回调
            ? eventCallbacks.push(callback)
            : this.events[eventName] = [callback];
    }

    // 触发事件回调
    emit(eventName: string, message: string, data: any) {
        const eventCallbacks: Function[] = this.events[eventName];
        if (!eventCallbacks) return;
        eventCallbacks.forEach(fn => {
            fn(message, data);
        })
    }

    // 删除回调
    off(eventName: string, callback: Function) {
        const eventCallbacks: Function[] = this.events[eventName];
        this.events[eventName] = eventCallbacks.filter(fn => fn !== callback);
    }

}
