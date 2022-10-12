import styles from "./Emoji.module.scss";
import uploadIcon from "../../assets/upload.png";
import {Upload} from "antd";
import {RcFile} from "antd/es/upload";
import {getEmojis, uploadEmoji} from "../../api/newsAxios";
import ImgCrop from "antd-img-crop";
import {useEffect, useState} from "react";

export const Emojis = () => {
    const [emojis, setEmojis] = useState<string[]>();

    // 上传表情包
    const upload = async (file: RcFile) => {
        await uploadEmoji(file)
        return false;
    }

    // 请求表情包
    useEffect(() => {
        getEmojis().then(res => {
            setEmojis(res.data.data.list);
        })
    }, [])

    return <ul className={styles["container"]}>
        <li>
            <ImgCrop>
                <Upload beforeUpload={upload} className={styles["upload"]}>
                    <img src={uploadIcon} alt={"icon"} />
                </Upload>
            </ImgCrop>
        </li>
        {emojis?.map((path, index) => <li
            key={index}
        >
            <img src={path} alt={"emoji"} />
        </li>)}
    </ul>

}