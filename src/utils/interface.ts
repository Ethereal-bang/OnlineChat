export interface User {
    id: number,
    password: string,
    name: string,
    avatar: string,
    word: string,
}

export interface Contact extends Exclude<User, "id" | "password">{
    id: number, // 仅是数据库标识 无实意
    own: number,
    contact: number,
    score: number,  // 亲密度
    state: 0 | 1 | 2 | 3 | 4 | 5,   // 申请中 已同意 已拒绝 已屏蔽 被屏蔽
}