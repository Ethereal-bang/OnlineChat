import {Button, Form, Input, message, Space} from "antd";
import styles from "./Login.module.scss";
import {User} from "../../utils/interface";
import {login} from "../../api/userAxios";
import {useNavigate} from "react-router-dom";
import {idSetter} from "../../utils/idStorage";

export const Login = () => {
    const navigate = useNavigate();

    const submitForm = (val: User) => {
        login(val.id, val.password).then(res => {
            if (res.data.flag) {
                // 储存信息
                idSetter(val.id);
                // 跳转
                setTimeout(() => {
                    navigate("/", {
                        replace: true,
                    })
                }, 1000);
                return message.success(res.data.msg);
            } else {
                return message.error(res.data.msg);
            }
        }, err => {
            return message.error(err.data.msg);
        })
    }

    return (
        <div>
            <Form className={styles["form"]} onFinish={submitForm}>
                <Form.Item
                    label={"账号"}
                    name={"id"}
                    rules={[{ required: true, }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={"密码"}
                    name={"password"}
                    rules={[{ required: true, }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            登录
                        </Button>
                        <Button type="primary" htmlType="submit">
                            注册
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    )
}