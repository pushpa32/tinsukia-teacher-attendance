import React, { useState, useRef, useEffect } from "react";
import { Button, Input, Space, Table, DatePicker } from 'antd';
import dayjs from 'dayjs';
import jwt_decode from 'jwt-decode';
import moment from 'moment';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';


const AttendanceHistory = () => {
    const [empData, setEmpData] = useState([])
    const [loading, setLoading] = useState(false);


    const _data = JSON.parse(localStorage.getItem('data'))
    const decoded_data = jwt_decode(_data);

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
                    placeholder={`type(YYYY-MM-DD)`}
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
            title: 'Date',
            dataIndex: "date",
            key: 'date',
            ...getColumnSearchProps('date'),
            render: (val) => {
                const dd = val.date ? val.date : val
                return (
                    <p>{dd}</p>
                )
            }

        },
        {
            title: 'Sign In Time',
            dataIndex: "date",
            key: 'date',
            render: (val) => {
                const dd = val.in_time ? val.in_time : "Not Marked"
                return (
                    <p>{dd}</p>
                )
            }
        },
        {
            title: 'Sign Out Time',
            dataIndex: "date",
            key: 'date',
            render: (val) => {
                const dd = val.out_time ? val.out_time : "Not Marked"
                return (
                    <p>{dd}</p>
                )
            }
        },
        {
            title: 'Distance In',
            dataIndex: "date",
            key: 'date',
            render: (val) => {
                const dd = val.distance_in ? val.distance_in + " mtrs" : "Not Marked"
                return (
                    <p>{dd}</p>
                )
            }
        },
        {
            title: 'Distance Out',
            dataIndex: "date",
            key: 'date',
            render: (val) => {
                const dd = val.distance_out ? val.distance_out + " mtrs" : "Not Marked"
                return (
                    <p>{dd}</p>
                )
            }
        },

    ];

    const columnsByDay = [
        {
            title: 'Date',
            dataIndex: "date",
            key: 'date',
            render: (val) => {
                const dd = val.date ? val.date : val
                return (
                    <p>{dd}</p>
                )
            }
        },
        {
            title: 'Sign In Time',
            dataIndex: "in_time",
            key: 'in_time',
            render: (val) => {
                const dd = val ? val : "Not Marked"
                return (
                    <p>{dd}</p>
                )
            }
        },
        {
            title: 'Sign Out Time',
            dataIndex: "out_time",
            key: 'out_time',
            render: (val) => {
                const dd = val ? val : "Not Marked"
                return (
                    <p>{dd}</p>
                )
            }
        },
        {
            title: 'Distance In',
            dataIndex: "distance_in",
            key: 'distance_in',
            render: (val) => {
                const dd = val ? val + " mtrs" : "Not Marked"
                return (
                    <p>{dd}</p>
                )
            }
        },
        {
            title: 'Distance Out',
            dataIndex: "distance_out",
            key: 'distance_out',
            render: (val) => {
                const dd = val ? val + " mtrs" : "Not Marked"
                return (
                    <p>{dd}</p>
                )
            }
        },
    ];


    useEffect(() => {
        onCalendarClicked(new Date())
        dailyAttendance(new Date())
    }, [])

    const onCalendarClicked = async (d) => {
        setLoading(true)
        const dd = moment(d).format("YYYY-MM-DD")

        const URL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/attendance/history/byMonth"
            : "/api/attendance/history/byMonth";

        await fetch(URL, {
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "user_id": decoded_data.user.id,
                "date": dd,
                "tokens": _data
            })
        })
            .then(async response => {
                try {
                    if (response.status !== 200) {
                        console.log("err")
                    } else {
                        const data = await response.json()
                        setEmpData(data);


                        setLoading(false)
                    }
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });
    }

    const [dailyData, setDailyData] = useState([])
    const dailyAttendance = async (d) => {
        setLoading(true)
        const dd = moment(d).format("YYYY-MM-DD")

        const URL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/attendance/history/byday"
            : "/api/attendance/history/byday";

        await fetch(URL, {
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "user_id": decoded_data.user.id,
                "date": dd,
                "tokens": _data
            })
        })
            .then(async response => {
                try {
                    if (response.status !== 200) {
                        console.log("err")
                    } else {
                        const data = await response.json()
                        setDailyData(data.data);
                        setLoading(false)
                    }
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });
    }
    return (
        <>

            <div style={{ marginTop: "20px", display: "flex", flexDirection: "row", alignItems: "center" }}>
                <div style={{ marginRight: "10px", fontSize: "16px", fontWeight: "600" }}>Today's Attendance</div>
                <DatePicker defaultValue={dayjs(moment(new Date()).format("YYYY-MM-DD"), "YYYY/MM/DD")}
                    disabledDate={d => !d || d.isAfter(new Date())} onChange={(date, dateString) => dailyAttendance(dateString)} />
            </div>
            <div>
                {dailyData ? <Table
                    columns={columnsByDay}
                    dataSource={dailyData}
                    // rowKey={(record) => record.id}
                    bordered
                    loading={loading}
                    scroll={{ x: 400 }}
                    pagination={false}
                /> :
                    <div style={{ marginTop: "20px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                        <p>No data</p>
                    </div>
                }
            </div>

            <div style={{ marginTop: "20px", display: "flex", flexDirection: "row", alignItems: "center" }}>
                <div style={{ marginRight: "10px", fontSize: "16px", fontWeight: "600" }}>View the Attendance Month-Wise</div>
                <DatePicker picker="month" defaultValue={dayjs(moment(new Date()).format("YYYY-MM-DD"), "YYYY/MM/DD")}
                    disabledDate={d => !d || d.isAfter(new Date())} onChange={(date, dateString) => onCalendarClicked(dateString)} />
            </div>
            <div>
                <Table
                    columns={columns}
                    dataSource={empData}
                    // rowKey={(record) => record.id}
                    bordered
                    loading={loading}
                    scroll={{ x: 400 }}
                />
            </div>
        </>
    )
}

export default AttendanceHistory