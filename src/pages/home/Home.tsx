import {Avatar, Button, Input, message} from "antd";
import React, {useEffect, useState} from "react";
import {Contact, User} from "../../utils/interface";
import {getInfo} from "../../api/userAxios";
import {idGetter} from "../../utils/idStorage";
import styles from "./Home.module.scss";
import {applyFriend, getApplicationList, searchUser} from "../../api/contactAxios";
import {contactStateMap} from "../../utils/map";

const PersonBar = (props: Pick<User, "name" | "avatar" | "word">) => {

    return <section className={styles["person_bar"]}>
        <Avatar src={props.avatar} shape={"circle"} size={80} />
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

    // 请求用户信息
    useEffect(() => {
        getInfo(idGetter()).then(res => {
            const user: User = res.data.data.user;
            setAvatar(user.avatar);
            setName(user.name);
            setWord(user.word);
        })
    }, [])

    // 请求联系人列表
    useEffect(() => {}, [])

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
        })
    }

    // 发送好友申请
    const applyFriendClicked = (id: number, e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        applyFriend(id).then(res => {
            if (res.data.flag) {
                message.success(res.data.msg)
                // @ts-ignore
                e.target.innerText = "已申请"; // 更改按钮文字
            }
        })
    }

    // 请求申请列表
    const getApplicationClicked = async () => {
        const list: Contact[] = (await getApplicationList()).data.data.list;
        setContacts(list);
    }

    return <section className={styles["home"]}>
        {/*左边部分*/}
        <section className={styles["left"]}>
            <section>
                <PersonBar avatar={avatar} name={name} word={word} />
                <Input.Search onSearch={onSearch} />
            </section>
            {/*联系人列表*/}
            <section className={styles["list"]}>
                {contacts.map(item => <div key={item.id}>
                    <Avatar size={50} src={item.avatar} />
                    <div>
                        <h2>{item.name}</h2>
                        {/*(待补充)最近一条消息*/}
                        <p>{item.word}</p>
                    </div>
                    <div>
                        <Button
                            onClick={(e) => applyFriendClicked(item.id, e)}
                        >
                            {/*@ts-ignore*/}
                            {contactStateMap[item.state]}
                        </Button>
                    </div>
                </div>)}
                {/*多功能bar*/}
                <section>
                    <i />
                    <Button>词云</Button>
                    <Button onClick={getApplicationClicked}>好友申请</Button>
                </section>
            </section>
        </section>
        {/*右边部分*/}
        <section className={styles["right"]}>
            {/*(待改)对方信息*/}
            <PersonBar avatar={avatar} name={name} word={word} />
            {/*聊天记录*/}
            <div>
            </div>
            {/*多功能栏*/}
            <div className={styles["functional"]}>
            </div>
            {/*输入框*/}
            <Input.TextArea
                className={styles["input_msg"]}
                rows={3}
            />
        </section>
    </section>
}