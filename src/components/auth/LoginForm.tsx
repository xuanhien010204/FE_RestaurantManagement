import { Form, Input, Button } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

const LoginForm = ({ onFinish }: { onFinish: (values: unknown) => Promise<void> | void }) => {
  return (
    <Form
      name="login"
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 400, margin: "0 auto" }}
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Please enter your email!" },
          { type: "email", message: "Invalid email format!" },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="Enter email" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please enter your password!" }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Enter password" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
