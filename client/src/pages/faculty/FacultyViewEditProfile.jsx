import React, { useState, useMemo, useEffect } from 'react';
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
import {
    Avatar,
} from "@mui/material";
import avatar from './../../assests/avataar.png'
import { DeviceUUID } from 'device-uuid';
import jwt_decode from 'jwt-decode';
import './user.css'
import moment from 'moment';
import dayjs from 'dayjs';
import swal from 'sweetalert'

const { TextArea } = Input;
const { Option } = Select;

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


const FacultyViewEditProfile = () => {

    const [api, contextHolder] = notification.useNotification();
    const openNotification = (placement, title, bodyMessage) => {
        api.info({
            message: `${title}`,
            description: <Context.Consumer>{({ name }) => `${bodyMessage}`}</Context.Consumer>,
            placement,
            duration: 4,
            // style: { zIndex: "1000" }
        });
    };
    const contextValue = useMemo(
        () => ({
            name: 'Ant Design',
        }),
        [],
    );

    const uuid = new DeviceUUID().parse();
    const _data = JSON.parse(localStorage.getItem('data'))
    const decoded_data = jwt_decode(_data);

    const [componentDisabled, setComponentDisabled] = useState(false);


    const onFinish = async (values) => {
        setShowError(false)
        const updateDOB = moment(values.dob).format("YYYY-MM-DD")
        const URL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/user/update/details"
            : " /api/user/update/details";

        await fetch(URL, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                "Accept": 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "user_id": decoded_data.user.id,
                "gender": values.gender,
                "dob": updateDOB,
                "maritial_status": values.maritialStatus,
                "caste": values.caste,
                "highest_qualification": values.highestQualification,
                "specialization": values.specialization,
                "department": values.department,
                "subject": values.subject,
                "address": values.address,
                "district": values.district,
                "pin_code": values.pin,
                "state": values.state,
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

    const [showError, setShowError] = useState(false)
    const onFinishFailed = (errorInfo) => {
        setShowError(true)
        console.log('Failed:', errorInfo);
    };

    const [data, setData] = useState("")
    let [subData, setSubData] = useState([])
    const getData = async () => {
        const URL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/user/get/detail"
            : " /api/user/get/detail";

        await fetch(URL, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                "Accept": 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "user_id": decoded_data.user.id,
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
                        setSubData(data.data.subject === null ? [] : JSON.parse(data.data.subject))
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

    // file upload function
    const fileUpload = async () => {
        const formData = new FormData();
        // const fileField = document.querySelector('input[id="profileImageUpload"]');
        formData.append("file", fileList[0]);

        // fileList.forEach((file) => {
        //     formData.append('file', file);
        // });
        setUploading(true);

        formData.append("id", decoded_data.user.id);
        formData.append("tokens", _data);

        const UPLOAD_URL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/upload/profile"
            : "/api/upload/profile";


        await fetch(UPLOAD_URL, {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((result) => {
                if (!result.error) {
                    swal("Uploaded");
                    setFileList([])
                    getData()
                    setUploading(false);
                } else {
                    setUploading(false);
                    setFileList([])
                    swal(result.message);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };


    const [fileList, setFileList] = useState([])
    const [uploading, setUploading] = useState(false);
    const props = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList([...fileList, file]);
            return false;
        },
        fileList,
    };


    return (
        <Context.Provider value={contextValue} >
            {contextHolder}

            <div className='profile-edit-box'>
                <center>
                    <Avatar
                        className="profile-image"
                        sx={{ height: "120px", width: "120px", marginBottom: "5px" }}
                        alt="profile_image"
                        src={
                            data.profile_img
                                ? "http://" + data.profile_img
                                : avatar
                        }
                    />
                    <Upload {...props} showUploadList={false}>
                        <Button disabled={fileList.length === 1} icon={<UploadOutlined />} style={{ fontWeight: "600", fontSize: "13px" }}>Update Profile Pic</Button>
                    </Upload>
                    <br />
                    <Button
                        type="primary"
                        onClick={fileUpload}
                        disabled={fileList.length === 0}
                        loading={uploading}
                        style={{
                            marginTop: "05px",
                            fontWeight: "600",
                            fontSize: "13px"
                        }}
                    >
                        {uploading ? 'Uploading' : 'Upload'}
                    </Button>


                </center>

                <Checkbox
                    checked={componentDisabled}
                    className='mb-3 p-2 edit-checkbox'
                    style={{ fontSize: "15px", backgroundColor: 'rgb(231, 52, 52)', marginTop: "10px" }}
                    onChange={(e) => setComponentDisabled(e.target.checked)}
                >
                    Edit Profile
                </Checkbox>

                <div className='header-profile-edit mb-4' >Basic Details:</div>

                {/* FORM */}
                <Form name="profile"
                    labelCol={{
                        span: uuid.platform === "Android" || uuid.platform === "iPhone" ? 12 : 6
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
                        },
                        {
                            name: ["phone"],
                            value: data.phone,
                        },
                        {
                            name: ["dob"],
                            value: data.dob ? dayjs(moment(data.dob).format("YYYY-MM-DD"), "YYYY-MM-DD") : null,
                        },
                        {
                            name: ["gender"],
                            value: data.gender,
                        },
                        {
                            name: ["maritialStatus"],
                            value: data.maritial_status,
                        },
                        {
                            name: ["caste"],
                            value: data.caste,
                        },
                        {
                            name: ["caste"],
                            value: data.caste,
                        },
                        {
                            name: ["highestQualification"],
                            value: data.highest_qualification,
                        },
                        {
                            name: ["specialization"],
                            value: data.specialization,
                        },
                        {
                            name: ["department"],
                            value: data.department,
                        },
                        {
                            name: ["subject"],
                            value: subData,
                        },
                        {
                            name: ["address"],
                            value: data.address,
                        },
                        {
                            name: ["district"],
                            value: data.district,
                        },
                        {
                            name: ["pin"],
                            value: data.pin_code,
                        },
                        {
                            name: ["state"],
                            value: data.state,
                        },
                    ]}
                >

                    <Form.Item label="Name" name="name">
                        <Input disabled={true} />
                    </Form.Item>

                    <Form.Item label="E-mail" name="email" >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item label="Phone" name="phone">
                        <Input addonBefore="+91" style={{ width: '100%' }} disabled />
                    </Form.Item>

                    <Form.Item label="Date of Birth" name="dob"
                        rules={[
                            {
                                required: true,
                                message: 'Please fill Date of Birth field!',
                            },
                        ]}>
                        <DatePicker disabled={!componentDisabled} />
                    </Form.Item>

                    <Form.Item label="Gender" name="gender"
                        rules={[
                            {
                                required: true,
                                message: 'PLease fill gender field!',
                            },
                        ]}>
                        <Radio.Group disabled={!componentDisabled} >
                            <Radio value="Male"> Male </Radio>
                            <Radio value="Female"> Female </Radio>
                            <Radio value="Others"> Others </Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="Maritial Status" name="maritialStatus"
                        rules={[
                            {
                                required: true,
                                message: 'PLease fill maritial status field!',
                            },
                        ]}>
                        <Radio.Group disabled={!componentDisabled}>
                            <Radio value="Single"> Single </Radio>
                            <Radio value="Married"> Married </Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="Caste" name="caste"
                        rules={[
                            {
                                required: true,
                                message: 'Please fill the caste field!',
                            },
                        ]} >
                        <Select placeholder="Select Caste" allowClear disabled={!componentDisabled}>
                            <Option value="General">General</Option>
                            <Option value="OBC">OBC</Option>
                            <Option value="SC">SC</Option>
                            <Option value="ST">ST</Option>
                        </Select>
                    </Form.Item>


                    <Form.Item
                        name="highestQualification"
                        label="Highest Qualification"

                    >
                        <Input disabled={!componentDisabled} />
                    </Form.Item>

                    <Form.Item
                        name="specialization"
                        label="Specialization"
                        rules={[
                            {
                                required: true,
                                message: 'Please fill specialization field!',
                            },
                        ]}
                    >
                        <Input disabled={!componentDisabled} />
                    </Form.Item>


                    <Form.Item
                        name="department"
                        label="department"
                        rules={[
                            {
                                required: true,
                                message: 'Please fill department field!',
                            },
                        ]}
                    >
                        <Input disabled={!componentDisabled} />
                    </Form.Item>


                    <Form.Item
                        name="subject"
                        label="Subject[multiple]"
                        rules={[{ required: true, message: 'Please select atleast one subject!', type: 'array' }]}
                    >
                        <Select mode="multiple" disabled={!componentDisabled} placeholder="Select your Subjects">
                            <Option value="Maths" key="1">Maths</Option>
                            <Option value="Science" key="2">Science</Option>
                            <Option value="English" key="3">English</Option>
                        </Select>
                    </Form.Item>

                    {/* ADDRESS */}
                    <div className='header-profile-edit mb-4' >Address Details:</div>
                    <Form.Item label="Address" name="address"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the address!',
                            },
                        ]}>
                        <TextArea rows={4} disabled={!componentDisabled} />
                    </Form.Item>

                    <Form.Item label="District" name="district"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the district!',
                            },
                        ]}>
                        <Input disabled={!componentDisabled} />
                    </Form.Item>

                    <Form.Item label="Pin Code" name="pin"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the pin!',
                            },
                            {
                                max: 6,
                                message: "Pin Code Cannot exceed 6 digits!",
                            },
                        ]}>
                        <Input type='number' disabled={!componentDisabled} />
                    </Form.Item>

                    <Form.Item label="State" name="state"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the state!',
                            },
                        ]}>
                        <Input disabled={!componentDisabled} />
                    </Form.Item>

                    {showError &&
                        <div style={{ color: "red", textAlign: 'center' }}>Error occured while filling up the above fields!</div>
                    }

                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" disabled={!componentDisabled}>
                            SAVE
                        </Button>
                    </Form.Item>

                </Form>
            </div>


        </Context.Provider>
    )
}

export default FacultyViewEditProfile