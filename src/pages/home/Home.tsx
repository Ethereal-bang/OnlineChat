import {useEffect, useState} from "react";
import {User} from "../../utils/interface";
import {Avatar, Button, Input, message, Upload} from "antd";
import styles from "./Home.module.scss";
import {getInfo, modifyProfile, uploadFile} from "../../api/userAxios";
import {idGetter} from "../../utils/idStorage";
import {RcFile} from "antd/es/upload";
import modifyIcon from "../../assets/modify.png";

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

    // upload
    const upload = (file: RcFile) => {
        uploadFile(file).then(res => {
            const data = res.data;
            if (data.flag) {
                message.success(data.msg);
                setAvatar(data.data.path);
            } else {
                message.error(data.msg);
            }
        })
        return false;
    }

    return <div className={styles["profile"]}>
        <div className={styles["avatar"]}>
            <Upload beforeUpload={upload} className={styles["upload"]}>
                <Avatar src={avatar} alt={"头像"} size={200} />
            </Upload>
            <img src={modifyIcon} alt={"icon"} />
        </div>
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