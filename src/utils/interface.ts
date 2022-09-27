export interface User {
    id: number,
    password: string,
    name: string,
    avatar: string,
    word: string,
}

export interface Contact extends Exclude<User, "password">{
    score?: number,  // 亲密度
    state?: 0 | 1 | 2 | 3 | 4,   // 申请中 已同意 已拒绝 已屏蔽 被屏蔽
}