import React, { useState, useMemo, useEffect } from 'react'
import {
    Form,
    Input,
    Button,
    Radio,
    Select,
    DatePicker,
    Checkbox,
    notification,
    Upload,
} from 'antd';
import {
    UploadOutlined
} from '@ant-design/icons';
import jwt_decode from 'jwt-decode';
import { DeviceUUID } from 'device-uuid';
import swal from 'sweetalert';

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

const UpdatePersonalDetails = () => {
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
    const _data = JSON.parse(localStorage.getItem('data'))
    const decoded_data = jwt_decode(_data);
    const [componentDisabled, setComponentDisabled] = useState(false);
    const [updatePasswordCheck, setUpdatePasswordCheck] = useState(false);
    const [showError, setShowError] = useState(false)
    const uuid = new DeviceUUID().parse();
    const [data, setData] = useState("")

    const onFinishFailed = (errorInfo) => {
        setShowError(true)
        console.log('Failed:', errorInfo);
    };

    const onFinish = async (values) => {
        setShowError(false)
        const URL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/user/update/admin/details"
            : " /api/user/update/admin/details";

        await fetch(URL, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                "Accept": 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id": decoded_data.user.id,
                "name": values.name,
                "email": values.email,
                "tokens": _data,
            })
        })
            .then(async response => {
                try {
                    if (response.status !== 200) {
                        console.log("Not 200")
                    } else {
                        const data = await response.json()
                        getData()
                        setComponentDisabled(!componentDisabled)
                        openNotification("topRight", "Successful!", "The profile is successfully updated!")
                    }
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });

    };

    const onPasswordFinish = async (values) => {

        if (values.password != values.reTypePassword) return swal("The new password does not match!")

        setShowError(false)
        const URL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/user/update/password"
            : " /api/user/update/password";

        await fetch(URL, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                "Accept": 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id": decoded_data.user.id,
                "old_password": values.oldPassword,
                "new_password": values.password,
                "tokens": _data,
            })
        })
            .then(async response => {
                try {
                    if (response.status !== 200) {
                        console.log("Not 200")
                    } else {
                        const data = await response.json()
                        if (data.error === true) {
                            swal(`${data.message}`)
                            return
                        } else {
                            getData()
                            setUpdatePasswordCheck(!updatePasswordCheck)
                            openNotification("topRight", "Successful!", data.message)
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

    const getData = async () => {
        const URL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/user/get/personal/info"
            : " /api/user/get/personal/info";

        await fetch(URL, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                "Accept": 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id": decoded_data.user.id,
                "tokens": _data,
            })
        })
            .then(async response => {
                try {
                    if (response.status !== 200) {
                        console.log("Not 200")
                    } else {
                        const data = await response.json()
                        setData(data.data);

                    }
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <Context.Provider value={contextValue} >
            {contextHolder}

            <Checkbox
                checked={componentDisabled}
                className='mb-3 p-2 edit-checkbox'
                style={{ fontSize: "15px", backgroundColor: 'rgb(231, 52, 52)', marginTop: "10px" }}
                onChange={(e) => setComponentDisabled(e.target.checked)} >
                Edit Profile
            </Checkbox>

            <div className='header-profile-edit mb-4' >Basic Details:</div>
            <Form name="profile"
                labelCol={{
                    span: uuid.platform === "Android" || uuid.platform === "iPhone" ? 10 : 6
                }}
                wrapperCol={{
                    span: uuid.platform === "Android" || uuid.platform === "iPhone" ? "100%" : 14,
                }}
                layout={uuid.platform === "Android" || uuid.platform === "iPhone" ? "vertical" : "horizontal"}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                fields={[
                    {
                        name: ["name"],
                        value: data.name,
                    },
                    {
                        name: ["email"],
                        value: data.email,
                    }
                ]}
            >
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please fill Name field!',
                        },
                    ]}
                >
                    <Input disabled={!componentDisabled} />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        {
                            required: true,
                            message: 'Please fill Email field!',
                        },
                    ]}
                >
                    <Input disabled={!componentDisabled} />
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" disabled={!componentDisabled}>
                        UPDATE
                    </Button>
                </Form.Item>
            </Form>



            {/* PASSWORD UPDATE */}
            <Checkbox
                checked={updatePasswordCheck}
                className='mb-3 p-2 edit-checkbox'
                style={{ fontSize: "15px", backgroundColor: 'rgb(231, 52, 52)', marginTop: "10px" }}
                onChange={(e) => setUpdatePasswordCheck(e.target.checked)} >
                Update your Password
            </Checkbox>
            {updatePasswordCheck && <Form name="profile"
                labelCol={{
                    span: uuid.platform === "Android" || uuid.platform === "iPhone" ? 10 : 6
                }}
                wrapperCol={{
                    span: uuid.platform === "Android" || uuid.platform === "iPhone" ? "100%" : 14,
                }}
                layout={uuid.platform === "Android" || uuid.platform === "iPhone" ? "vertical" : "horizontal"}
                onFinish={onPasswordFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >

                <Form.Item
                    name="oldPassword"
                    label="Old Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please fill Old Password field!',
                        },
                    ]}
                >
                    <Input type='password' />
                </Form.Item>

                <Form.Item
                    name="password"
                    label=" New Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please fill New Password field!',
                        },
                    ]}
                >
                    <Input type='password' />
                </Form.Item>

                <Form.Item
                    name="reTypePassword"
                    label="Re-type New Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please fill Re-type New Password field!',
                        },
                    ]}
                >
                    <Input type='password' />
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        UPDATE
                    </Button>
                </Form.Item>
            </Form>
            }

        </Context.Provider>
    )
}

export default UpdatePersonalDetails