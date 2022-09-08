import { Button, Checkbox, DatePicker, Form, Input, Select } from 'antd';
import axios from 'axios';
import Link from 'next/link';
import React, { useState } from 'react';
import ReactLoading from 'react-loading';

const Register: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const regexPassWord = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleRegister = async (values: any) => {
    try {
      setIsLoading(true)
      await axios.post('api/auth/signup', { ...values });
      // localStorage.setItem('firstLogin', true);
      setIsLoading(false)
      alert('success');
    } catch (err) {
      alert('faile');
    }
  };

  return (
    <>
      {isLoading ? (
        <ReactLoading
          type={'spin'}
          color={'red'}
          height={'10%'}
          width={'10%'}
        />
      ) : (
        <Form
          autoComplete="off"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
          onFinish={(values) => {
            handleRegister(values);
          }}
          onFinishFailed={(error) => {
            console.log({ error });
          }}
        >
          <Form.Item
            name="username"
            label="User Name"
            rules={[
              {
                required: true,
                message: 'Please enter user name',
              },
              { whitespace: true },
              { min: 6 },
            ]}
          >
            <Input placeholder="Type your name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: 'Please enter your email',
              },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
            hasFeedback
          >
            <Input placeholder="Type your email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
              },
              { min: 6 },
              {
                validator: (_, value) =>
                  value && regexPassWord.test(value)
                    ? Promise.resolve()
                    : Promise.reject('Password does not match criteria.'),
              },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Type your password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              {
                required: true,
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    'The two passwords that you entered does not match.'
                  );
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Confirm your password" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
            >
              Ok
            </Button>
            <Button type="primary">
              <Link href="/login">Login</Link>
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
};

export default Register;
