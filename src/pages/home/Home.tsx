import {Avatar, Input} from "antd";
import {useEffect, useState} from "react";
import {Contact, User} from "../../utils/interface";
import {getInfo} from "../../api/userAxios";
import {idGetter} from "../../utils/idStorage";
import styles from "./Home.module.scss";

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
        console.log(val)
        // getInfo(val)
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