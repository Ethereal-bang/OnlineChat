import {Button, Form, Input, Space} from "antd";
import styles from "./Login.module.scss";

export const Login = () => {
    return (
        <div>
            <Form className={styles["form"]}>
                <Form.Item
                    label={"账号"}
                    name={"id"}
                    rules={[{ type: "number", required: true, }]}
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