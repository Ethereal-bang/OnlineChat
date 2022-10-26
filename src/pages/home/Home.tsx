import {Avatar, Button, Input, message, Popconfirm} from "antd";
import React, {BaseSyntheticEvent, useEffect, useRef, useState} from "react";
import {Contact, MenuOption, News, Position, User} from "../../utils/interface";
import {getInfo} from "../../api/userAxios";
import {idGetter} from "../../utils/idStorage";
import styles from "./Home.module.scss";
import {
    applyFriend, blockContact, closeRank, deleteContact,
    getApplicationList,
    handleApplication,
    requestContactList,
    searchUser
} from "../../api/contactAxios";
import {contactStateMap} from "../../utils/map";
import {Profile} from "../../views/profile/Profile";
import {getDialogue, sendNewsApi} from "../../api/newsAxios";
import emojiImg from "../../assets/emoji.png";
import searchImg from "../../assets/search.png";
import {decodeEmoji, encodeEmoji} from "../../utils/emojiHandle";
import Websocket from "../../api/websocket";
import {ContextMenu, Editor, Emojis} from "../../component";
import {decodeHtml} from "../../utils/decodeHtml";

const PersonBar = (props: Pick<User, "name" | "avatar" | "word">) => {

    return <section className={styles["person_bar"]}>
        <Avatar src={props.avatar} shape={"circle"} size={80}/>
        <section>
            <h2>{props.name}</h2>
            <p>{props.word}</p>
        </section>
    </section>
}

export const Home = () => {
    const [avatar, setAvatar] = useState<string>("");
    const [name, setName] = useState<string>("Loading");
    const [word, setWord] = useState<string>("");
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [showListState, setShowList] = useState<boolean>(true);    // 决定左边列表显示内容(true消息/f联系人)
    const [showNewsState, setShowNewsState] = useState<boolean>(true);  // 右边板块显示消息内容还是个人信息修改
    const [contactProfile, setContactProfile] = useState<User>({
        id: 0,
        name: "Loading",
        avatar: "",
        word: "",
        password: "",
    });   // 聊天时对方信息
    const [dialogue, setDialogue] = useState<News[]>([]);
    const [inputVal, setInputVal] = useState<string>(""); // 打字内容
    const [contextMenuPos, setContextMenuPos] = useState<Position>({x: 0, y: 0});
    const [contextMenuShow, setContextMenuShow] = useState<boolean>(false);
    const [contactToMenu, setContactToMenu] = useState<number>(0);
    const [emojisShow, setEmojisShow] = useState<boolean>(false);
    const [showScore, setShowScore] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);    // 聊天记录请求页数

    const dialogueRef = useRef(null);

    const contextOptions: MenuOption[] = [
        {
            key: 1,
            name: "删除联系人",
            onClick: (contact: number) => {
                deleteContact(contact).then(res => {
                    const {flag, msg} = res.data;
                    if (flag) {
                        getContacts();   // 重载联系人列表
                        return message.success(msg);
                    }
                })
            },
        }, {
            key: 2,
            name: "屏蔽联系人",
            onClick: (contact: number) => {
                blockContact(contact).then(res => {
                    const {flag, msg} = res.data;
                    if (flag) {
                        // ...更新UI
                        return message.success(msg);
                    }
                })
            },
        }
    ];

    const ws = Websocket.getInstance();
    const curId = idGetter();

    // 请求用户信息
    const getOwnInfo = () => {
        getInfo(idGetter()).then(res => {
            const user: User = res.data.data.user;
            setAvatar(user.avatar);
            setName(user.name);
            setWord(user.word);
        })
    }
    useEffect(() => {
        getOwnInfo();
    }, [])

    // 请求消息列表
    const getContacts = async () => {
        setContacts((await requestContactList()).data.data.list);
        setShowList(true);
        setShowScore(false);
    }
    useEffect(() => {
        getContacts();
    }, [])

    // 搜索
    const onSearch = (val: string) => {
        searchUser(val).then(res => {
            const data = res.data.data;
            // 查询ID
            if (data.user) {
                setContacts([data.user]);
            }
            // 查询昵称
            else if (data.list) {
                setContacts(data.list);
            }
            setShowList(false);
        })
    }

    // 发送好友申请
    const handleContact = async (
        contact: Contact,
        flag?: boolean
    ) => {
        switch (contact.state) {
            case 0: // 申请中
                return message.warn("请勿重复发送好友申请");
            case -1:    // 未添加
                applyFriend(contact.uid).then(res => {
                    if (res.data.flag) {
                        return message.success(res.data.msg)
                    }
                })
                break;
            case 4: // 待处理
                await handleApplication(contact.uid, flag ? 1 : 2);
                setContacts(contacts => {
                    const index = contacts.indexOf(contact);
                    const arr: Contact[] = [...contacts.slice(0, index), {
                        ...contacts[index],
                        state: flag ? 1 : 2,
                    }, ...contacts.slice(index + 1)]
                    return arr;
                })
                break;
            default:
        }
    }

    // 请求申请列表
    const getApplicationClicked = async () => {
        const list: Contact[] = (await getApplicationList()).data.data.list;
        setContacts(list);
        setShowList(false);
    }

    // 发送消息
    const sendMsg = async () => {
        const encodedStr = encodeEmoji(inputVal);
        const newsId: number = (await sendNewsApi(contactProfile.id, encodedStr)).data.data.id;
        setInputVal('');    // 清空聊天框
        const news: News = {
            id: newsId,
            sender: curId,
            receiver: contactProfile.id,
            content: inputVal,
            time: "刚刚",
        }
        setDialogue(dialogue => [news, ...dialogue]);
    }

    // 请求与某人的对话列表
    const showDialogue = async (contact: Contact) => {
        if (contact.state !== 1 && contact.state !== 3) return; // 除了已同意和已屏蔽
        const res = (await getDialogue(contact.uid)).data.data;
        setContactProfile(res.user);
        setDialogue(res.list);
        setShowNewsState(true);
    }

    // ws添加收到消息回调
    useEffect(() => {
        const callback = (word: string, data: any) => {
            getContacts();
            if (contactProfile.id === data.id) {    // 如果是来自正在对话方发送
                setDialogue(dialogue => {
                    return [data.news, ...dialogue];
                })
            }
            return message.success(word);
        };
        ws.subscribe("news", callback);
        // 组件卸载时取消订阅
        return () => {
            ws.off("news", callback);
        };
    }, [contactProfile, ws])

    // ws好友申请回调
    useEffect(() => {
        const callback = (word: string) => {
            getContacts();
            return message.info(word);
        }
        ws.subscribe("application", callback);
        return () => {
            ws.off("application", callback);
        }
    }, [ws])

    // 点击关闭右键菜单
    useEffect(() => {
        const hideMenu = () => setContextMenuShow(false);
        document.addEventListener("click", hideMenu);
        return () => {
            document.removeEventListener("click", hideMenu);
        };
    }, [])

    const showContextMenu = (e: React.MouseEvent<HTMLDivElement>, uid: number) => {
        e.preventDefault(); // 阻止默认的右键菜单
        // 显示自定义右键菜单
        setContextMenuPos({ // 相对浏览器可视区域左上角距离
            x: e.clientX,
            y: e.clientY,
        })
        setContextMenuShow(true);
        setContactToMenu(uid);
    }

    const onEmojiPick = async (path: string) => {
        const content = `<img src="${path}" alt="png" />`
        const newsId: number = (await sendNewsApi(contactProfile.id, content)).data.data.id;
        const news: News = {
            id: newsId,
            sender: curId,
            receiver: contactProfile.id,
            content,
            time: "刚刚",
        }
        setEmojisShow(false);
        setDialogue(dialogue => [news, ...dialogue]);
    }

    const rankClose = () => {
        setShowScore(true);
        setShowList(true);
        closeRank().then(res => {
            setContacts(res.data.data.list);
        })
    }

    // 对方已读ws回调
    useEffect(() => {
        const cb = (msg: string, data: any) => {
            const contact: number = data.id;
            setContacts(list => {
                const cur = list.filter(item => item.uid === contact)[0]
                cur.read = true;
                return [cur, ...list.filter(item => item.uid !== contact)];
            })
        }
        ws.subscribe("read", cb);
        return () => ws.off("read", cb);
    }, [ws])

    // 切换聊天联系人后 重置加载页数+滚动条位置
    useEffect(() => {
        setPage(1);
        // ...重置滚动位置
        if (dialogueRef) {
            // @ts-ignore
            dialogueRef.current.scrollTop = 0;
        }
    }, [contactProfile, dialogueRef])

    // 节流
    const throttle = (fn: Function, time: number, ...args: any) => {
        let flag = false;   // 标志是否已触发（节流
        return () => {
            if (flag) return;
            fn(...args);
            flag = true;
            setTimeout(() => flag = false, time);
        }
    }

    // 对话框滚动到顶部后加载下一页记录
    const lazyLoadNews = (e: BaseSyntheticEvent) => {
        const height = e.currentTarget.scrollHeight - e.currentTarget.clientHeight;
        if (height - e.currentTarget.scrollTop < 25) {
            (throttle(async () => {
                const list = (await getDialogue(contactProfile.id, page + 1)).data.data.list;
                setDialogue(d => {
                    return [...d, ...list];
                })
                setPage(p => p + 1);
            }, 2000,))()
        }
    }

    return <section className={styles["home"]}>
        {/*左边部分*/}
        <section className={styles["left"]}>
            <section>
                <div onClick={() => setShowNewsState(false)}
                     className={styles["person_info"]}
                >   {/*点击后切换为修改信息板块*/}
                    <PersonBar avatar={avatar} name={name} word={word}/>
                </div>
                <Input.Search onSearch={onSearch}/>
            </section>
            {/*联系人列表*/}
            <section className={styles["list"]}>
                {contacts.map(item => <div
                    key={item.id}
                    onClick={() => showDialogue(item)}
                    onContextMenu={e => showContextMenu(e, item.uid)}
                >
                    <Avatar size={50} src={item.avatar}/>
                    <div className={styles["list_mid"]}>
                        <h2>{item.name}</h2>
                        {showListState /*显示消息或个性签名*/
                            ? <div
                                dangerouslySetInnerHTML={{
                                    __html:
                                        item.news?.match(/<img/)
                                            ? "图片消息"
                                            : decodeEmoji(decodeHtml(item.news))
                                }}/>
                            : <p>{item.word}</p>}
                    </div>
                    <div>
                        {showListState  /*显示已读或申请状态*/
                            ? <span>
                                {showScore
                                    ? item.score
                                    : item.read ? "已读" : "未读"
                                }
                            </span>
                            : item.state === 4
                                ? <Popconfirm
                                    title={"同意或拒绝好友申请"}
                                    okText={"同意"}
                                    cancelText={"拒绝"}
                                    onConfirm={() => handleContact(item, true)}
                                    onCancel={() => handleContact(item, false)}
                                >
                                    <Button>同意/拒绝</Button>
                                </Popconfirm>
                                : <Button
                                    onClick={() => handleContact(item)}
                                >
                                    {/*@ts-ignore*/}
                                    {contactStateMap[item.state]}
                                </Button>
                        }
                    </div>
                </div>)}
                {/*多功能bar*/}
                <section>
                    <Button onClick={getApplicationClicked}>好友申请</Button>
                    <Button onClick={getContacts}>好友列表</Button>
                    <Button onClick={rankClose}>亲密度排行</Button>
                </section>
            </section>
        </section>
        {/*右边部分*/}
        <section className={styles["right"]}>
            {showNewsState
                ? <section> {/*消息列表*/}
                    <PersonBar
                        avatar={contactProfile.avatar}
                        name={contactProfile.name}
                        word={contactProfile.word}
                    />
                    <div className={styles["dialogue"]}
                         onScroll={lazyLoadNews}
                         ref={dialogueRef}
                    >
                        {dialogue.map(item => <div key={item.id}
                                                   className={styles["news_item"] + " " + styles[item.sender === curId ? "own_news" : ""]}
                        >
                            <div>
                                <div dangerouslySetInnerHTML={{__html: decodeEmoji(item.content)}}/>
                                <span>{item.time.slice(-9)}</span>
                            </div>
                        </div>)}
                    </div>
                    <div className={styles["functional"]}>
                        <Button onClick={() => setEmojisShow(bool => !bool)}>
                            <img src={emojiImg} alt={"emoji"}/>
                        </Button>
                        <Button>
                            <img src={searchImg} alt={"search"}/>
                        </Button>
                        <Button onClick={sendMsg}>发送</Button>
                    </div>
                    <div className={styles["input_msg"]}>
                        <Editor
                            val={inputVal}
                            onChange={val => setInputVal(val)}
                        />
                    </div>
                </section>
                : <section> {/*个人信息修改*/}
                    <Profile update={getOwnInfo}/>
                </section>
            }
            {/*表情包选取*/}
            <Emojis isShow={emojisShow} onClick={onEmojiPick}/>
        </section>
        {/*上下文菜单*/}
        <ContextMenu
            options={contextOptions}
            position={contextMenuPos}
            isShow={contextMenuShow}
            contact={contactToMenu}
        />
    </section>
}