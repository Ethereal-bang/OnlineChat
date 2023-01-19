import {idGetter} from "../utils/idStorage";
import {WsNews} from "../utils/interface";

export default class Websocket {
    private ws: WebSocket | undefined;
    private eventCenter: EventCenter = new EventCenter();
    static instance: Websocket;    // 单例模式
    /*
    * 心跳重连
    * */
    private isReconnecting: boolean = false; // 是否正在重连
    private pingTimer: NodeJS.Timeout | undefined;
    private pongTimer: NodeJS.Timeout | undefined;
    private reconnectTimer: NodeJS.Timeout | undefined;

    constructor() {
        this.create();
    }

    // 连接
    create() {
        this.ws = new WebSocket(`ws://onlinechatapi.giantcat.top:25639/websocket/${idGetter()}`);
        this.ws.onmessage = (event) => {
            const data: WsNews = JSON.parse(event.data);    // 解析为JSON
            if (data.message === "pong") {// 收到消息重置心跳
                this.sendPing();
            }
            this.eventCenter.emit(data.type, data.message, data.data);  // 发往消息中心
        }
        this.ws.onclose = () => {   // 连接关闭触发重连
            this.reconnect();
        }
        this.ws.onerror = () => {
            this.reconnect();
        }
        this.sendPing();
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

    sendMsg(message: string) {
        if (!this.ws) return;
        // 等待readyState为1才发
        if (this.ws.readyState === 1) {
            this.ws.send(message);
        } else {
            setTimeout(() => {
                this.sendMsg(message);
            }, 1000)
        }
    }

    sendPing() {
        // 重置定时器
        clearTimeout(this.pingTimer);
        clearTimeout(this.pongTimer);
        this.pingTimer = setTimeout(() => {
            this.sendMsg("ping");  // 发送心跳
            this.pongTimer = setTimeout(() => {
                this.close();
            }, 3000);   // 如果3s后还没相应，重连
        }, 10 * 1000)   // 相当于每s检测一次
    }

    close() {
        this.ws?.close();
    }

    reconnect() {
        if (this.isReconnecting) return;
        this.isReconnecting = true;
        // 设置延迟 避免请求过多
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = setTimeout(() => {
            this.create();
            this.isReconnecting = false;
        }, 3000)
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
