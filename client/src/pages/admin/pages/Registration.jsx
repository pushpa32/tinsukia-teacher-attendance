import React, { useState, useMemo, useEffect } from 'react';
import {
    Form,
    Input,
    Button,
    notification
} from 'antd';
import { Grid } from "@mui/material";
import './index.css'


const Context = React.createContext({
    name: 'Default',
});


const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

const Registration = () => {

    const [api, contextHolder] = notification.useNotification();
    const openNotification = (placement, title, bodyMessage) => {
        api.info({
            message: `${title}`,
            description: <Context.Consumer>{({ name }) => `${bodyMessage}`}</Context.Consumer>,
            placement,
            duration: 4,
        });
    };
    const contextValue = useMemo(
        () => ({
            name: 'Ant Design',
        }),
        [],
    );


    const [form] = Form.useForm();
    // submit form
    const onFinish = async (values) => {
        // console.log('Success:', values.email);

        const _data = await JSON.parse(localStorage.getItem('data'))
        const URL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/user/register"
            : " /api/user/register";

        await fetch(URL, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                "Accept": 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "name": values.name,
                "email": values.email,
                "phone": values.phone,
                "tokens": _data,
            })
        })
            .then(async response => {
                try {
                    if (response.status !== 200) {
                        console.log("Not 200")
                    } else {
                        const data = await response.json()
                        if (data.error === true)
                            openNotification("topRight", "Error!", data.message)
                        else {
                            form.resetFields();
                            openNotification("topRight", "Successful!", "The new user is successfully added!")
                        }

                    }
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });


    };


    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const [data, setData] = useState([])
    const getData = async () => {

        const _data = await JSON.parse(localStorage.getItem('data'))
        const URL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/user/new/user/list"
            : " /api/user/new/user/list";

        await fetch(URL, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                "Accept": 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "tokens": _data,
            })
        })
            .then(async response => {
                try {
                    if (response.status !== 200) {
                        console.log("Not 200")
                    } else {
                        const data = await response.json()
                        setData(data.data)
                    }
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });
    };

    useEffect(() => {
        getData()
    }, [])


    return (
        <Context.Provider value={contextValue} >
            {contextHolder}
            <Grid item container spacing={4} style={{ display: "flex", justifyContent: "space-around", backgroundColor: "rgb(243, 243, 243)", paddingBottom: 20, paddingRight: 10 }}>
                <Grid item xs={12} sm={12} md={12} >
                    <div style={{ padding: "20px", fontWeight: "bold" }}> Register a new Faculty!</div>
                </Grid>
            </Grid>


            <Grid container spacing={4} style={{ display: "flex", justifyContent: "space-around", backgroundColor: "rgb(243, 243, 243)", paddingBottom: 20, paddingRight: 10 }}>
                <Grid item style={{ padding: "10px", border: "solid 1px transparent", borderRadius: "5px" }} xs={12} sm={6} md={6} className="registration-form">
                    <Form
                        form={form}
                        labelCol={{
                            span: 6,
                        }}
                        wrapperCol={{
                            span: 14,
                        }}
                        layout="horizontal"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >

                        <Form.Item label="Name" name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please type name!',
                                },
                            ]}>
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="E-mail"
                            rules={[
                                {
                                    type: 'email',
                                    message: 'The input is not valid E-mail!',
                                },
                                {
                                    required: true,
                                    message: 'Please input your E-mail!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            label="Phone"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please provide Phone Number!',
                                },
                                {
                                    max: 10,
                                    message: "Phone Number Cannot exceed 10 digits!",
                                },
                            ]}
                        >
                            <Input addonBefore="+91" type='number' style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit">
                                Register
                            </Button>
                        </Form.Item>

                    </Form>
                </Grid>

                <Grid item style={{ padding: "10px", border: "solid 1px transparent", borderRadius: "5px" }} xs={12} sm={1} md={1} className=""></Grid>

                <Grid item style={{ padding: "10px", border: "solid 1px red", borderRadius: "5px" }} xs={12} sm={4} md={4} className="">
                    <div style={{ fontWeight: "bold" }}>Recently Registered Faculty!</div>
                    <div style={{ padding: "10px" }}>
                        {data && data.map((val, index) => (
                            <li
                                style={{ fontWeight: "500" }}
                                key={index}>
                                {val.name}
                            </li>))
                        }
                    </div>
                    <><Button onClick={() => window.location.href = '/dashboard/teachers'} style={{ fontSize: "14px", fontWeight: "600" }} type="primary">. . . . . View All the List</Button></>
                </Grid>

            </Grid>
        </Context.Provider>
    )
}

export default Registration