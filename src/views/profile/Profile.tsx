import {useEffect, useState} from "react";
import {User} from "../../utils/interface";
import {Avatar, Input, message, Upload} from "antd";
import styles from "./Profile.module.scss";
import {getInfo, modifyProfile, uploadFile} from "../../api/userAxios";
import {idGetter} from "../../utils/idStorage";
import {RcFile} from "antd/es/upload";
import modifyIcon from "../../assets/modify.png";
import ImgCrop from "antd-img-crop";

export const Profile = () => {
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

    // upload and modify avatar
    const modifyAvatar = async (file: RcFile) => {
        const {flag, msg, data} = (await uploadFile(file)).data;
        if (!flag) {
            message.error(msg);
        }
        message.success(msg);
        // 修改头像
        setAvatar(data.path);
        modifyProfile("avatar", data.path);
        return false;
    }

    return <div className={styles["profile"]}>
        <div className={styles["avatar"]}>
            {/*上传前裁剪*/}
            <ImgCrop shape={"round"}>
                <Upload beforeUpload={modifyAvatar} className={styles["upload"]}>
                    <Avatar src={avatar} alt={"头像"} size={200} />
                </Upload>
            </ImgCrop>
            <img src={modifyIcon} alt={"icon"} />
        </div>
        <Input value={name}
               onChange={e => setName(e.currentTarget.value)}
               onBlur={e => modifyNameOrWord(e.currentTarget.value, "name")}
        />
        <Input.TextArea value={word}
                        onChange={e => setWord(e.currentTarget.value)}
                        onBlur={e => modifyNameOrWord(e.currentTarget.value, "word")}
        />
    </div>
}