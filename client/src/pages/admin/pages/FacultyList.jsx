import React, { useState, useRef, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import { useSearchParams } from "react-router-dom";
import ViewProfile from './ViewProfile';
import { CSVLink } from "react-csv"
import swal from 'sweetalert';
import {
    DownloadOutlined
} from '@ant-design/icons';


const FacultyList = () => {
    const [empData, setEmpData] = useState([])
    const [loading, setLoading] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const viewprofile = searchParams.get("user_id") || false

    const getTeachersList = async () => {
        //get the data
        setLoading(true)
        const _data = await JSON.parse(localStorage.getItem('data'))
        const URL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/user/get/users"
            : " /api/user/get/users";

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
                        setLoading(false)
                        console.log("Not 200")
                    } else {
                        const data = await response.json()
                        setEmpData(data.data);
                        setLoading(false)
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
        getTeachersList()
    }, [])


    // table search
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
            render: (text, record, index) => {
                return (
                    <a
                        style={{ color: "blue" }}
                        id={record.id}
                        onClick={e => {
                            window.location =
                                "?user_id=" + record.id
                        }}
                        size="large"
                    >{text}</a>

                );
            }

        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '20%',
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            ...getColumnSearchProps('phone'),
            sorter: (a, b) => a.phone.length - b.phone.length,
            sortDirections: ['descend', 'ascend'],
        },
    ];

    return !viewprofile ? (
        <div>
            <div style={{ justifyContent: 'space-between', display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "10px" }}>

                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <div style={{ marginRight: "10px", fontSize: "16px", fontWeight: "600" }}>Total Faculties:</div>
                    <div style={{ marginRight: "10px", fontSize: "16px", fontWeight: "600" }}>{empData ? empData.length : "-"}</div>
                </div>

                <CSVLink
                    filename={"faculties.csv"}
                    data={empData}
                    className="btn btn-primary"
                    style={{ fontSize: "13px", fontWeight: "600" }}
                    onClick={() => {
                        swal("The file is downloading")
                    }}
                >
                    <DownloadOutlined style={{ marginRight: "10px", fontSize: "15px" }} /> EXPORT
                </CSVLink>
            </div>

            <Table
                columns={columns}
                dataSource={empData}
                rowKey={(record) => record._id}
                bordered
                loading={loading}

            />
        </div>
    )
        :
        <ViewProfile user_id={viewprofile} />
}

export default FacultyList