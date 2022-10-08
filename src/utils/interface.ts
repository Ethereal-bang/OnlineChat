export interface User {
    id: number,
    password: string,
    name: string,
    avatar: string,
    word: string,
}

export interface Contact extends Exclude<User, "password">{
    uid: number,
    score: number,  // 亲密度
    state: -1 | 0 | 1 | 2 | 3 | 4,   // 未添加 申请中 已同意 已拒绝 已屏蔽 待处理(对方发送的申请
    news: string,   // 最后一天消息
    read: boolean,  // 对方是否已读
}

export interface News {
    id: number,
    sender: number,
    receiver: number,
    content: string,    // 富文本
    word: string,
    time: string,
}