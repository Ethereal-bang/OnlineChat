import emojiRegex from "emoji-regex";

export const encodeEmoji = (str: string) => {
    const regex = emojiRegex(); // 匹配emoji的正则
    return str.replace(regex, p => `emoji(${p.codePointAt(0)})`);
}

export const decodeEmoji = (str: string) => {
    const emojiDecodeRegex = /emoji\(\d+\)/g;
    return str.replace(emojiDecodeRegex, p => {
        // 去掉格式emoji()
        return String.fromCodePoint(Number(p.replace(/[^\d]/g, '')));
    })
}
