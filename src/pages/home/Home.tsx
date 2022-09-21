import {useEffect, useState} from "react";
import {User} from "../../utils/interface";
import {Avatar, Button, Input, message} from "antd";
import styles from "./Home.module.scss";
import {getInfo, modifyProfile} from "../../api/userAxios";
import {idGetter} from "../../utils/idStorage";

export const Home = () => {
    const [editable, setEditable] = useState<boolean>(false);
    const [avatar, setAvatar] = useState<string>("");
    const [name, setName] = useState<string>("Loading");
    const [word, setWord] = useState<string>("");

    // 请求用户信息
    useEffect(() => {
        getInfo(idGetter()).then(res => {
            const user: User = res.data.data.user;
            setAvatar(user.avatar);
            setName(user.name);
            setWord(user.word);
        })
    }, [])

    // 修改 昵称/签名
    const modifyNameOrWord = async (val: string, key: "name" | "word") => {
        const res = (await modifyProfile(key, val)).data;
        res.flag
            ? message.success(res.msg)
            : message.error(res.msg);
    }

    return <div className={styles["profile"]}>
        <Avatar src={avatar} alt={"头像"}/>
        <Input value={name} disabled={!editable}
               onChange={e => setName(e.currentTarget.value)}
               onBlur={e => modifyNameOrWord(e.currentTarget.value, "name")}
        />
        <Input.TextArea value={word} disabled={!editable}
                        onChange={e => setWord(e.currentTarget.value)}
                        onBlur={e => modifyNameOrWord(e.currentTarget.value, "word")}
        />
        <Button onClick={() => setEditable((val) => !val)}>
            {editable ? "完成" : "Edit Profile"}
        </Button>
    </div>
}