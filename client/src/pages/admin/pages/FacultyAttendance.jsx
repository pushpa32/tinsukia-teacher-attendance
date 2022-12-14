import React, { useState, useRef, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, DatePicker } from 'antd';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import dayjs from 'dayjs';
import { useSearchParams } from "react-router-dom";
import ViewProfile from './ViewProfile';
import swal from 'sweetalert';
import {
    DownloadOutlined
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

const FacultyAttendance = () => {

    const [empData, setEmpData] = useState([])
    const [monthData, setMonthData] = useState([])
    const [rangeData, setRangeData] = useState([])
    const [loading, setLoading] = useState(false);
    const [monthLoading, setMonthLoading] = useState(false);
    const [rangeLoading, setRangeLoading] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const viewprofile = searchParams.get("user_id") || false

    const getAttendanceList = async (d) => {
        //get the data
        const dd = moment(d).format("YYYY-MM-DD")

        setLoading(true)
        const _data = await JSON.parse(localStorage.getItem('data'))
        const URL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/attendance/get/bydate"
            : " /api/attendance/get/bydate";

        await fetch(URL, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                "Accept": 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "date": dd,
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

    const getAttendanceListByMonth = async (d) => {
        //get the data
        const dd = moment(d).format("YYYY-MM-DD")

        setMonthLoading(true)
        const _data = await JSON.parse(localStorage.getItem('data'))
        const URL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/attendance/get/bymonth"
            : " /api/attendance/get/bymonth";

        await fetch(URL, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                "Accept": 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "date": dd,
                "tokens": _data,
            })
        })
            .then(async response => {
                try {
                    if (response.status !== 200) {
                        setMonthLoading(false)
                        console.log("Not 200")
                    } else {
                        const data = await response.json()
                        setMonthData(data);
                        setMonthLoading(false)
                    }
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });
    };

    // EXPORT
    const [dateWiseDownloadDate, setDateWiseDownloadDate] = useState(new Date())
    const downloadDateWise = async (d) => {
        //get the data
        const dd = moment(d).format("YYYY-MM-DD")

        setLoading(true)
        const _data = await JSON.parse(localStorage.getItem('data'))
        const URL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/export/attendance"
            : " /api/export/attendance";

        await fetch(URL, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                "Accept": 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "date": dd,
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
                        window.open("https://" + data.data, "_blank");
                        swal(data.message.toUpperCase());
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

    const [monthWiseDownloadDate, setMonthWiseDownloadDate] = useState(new Date())
    const downloadMonthWise = async (d) => {
        //get the data
        const dd = moment(d).format("YYYY-MM-DD")

        setMonthLoading(true)
        const _data = await JSON.parse(localStorage.getItem('data'))
        const URL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/export/attendance/month"
            : " /api/export/attendance/month";

        await fetch(URL, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                "Accept": 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "date": dd,
                "tokens": _data,
            })
        })
            .then(async response => {
                try {
                    if (response.status !== 200) {
                        setMonthLoading(false)
                        console.log("Not 200")
                    } else {
                        const data = await response.json()
                        window.open("https://" + data.data, "_blank");
                        swal(data.message.toUpperCase());
                        setMonthLoading(false)
                    }
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });
    };

    const downloadRangeWise = async () => {
        //get the data
        if (!startDate) return swal("Please provide Start Date for range")
        if (!endDate) return swal("Please provide end Date for range")

        //get the data
        const sDate = moment(startDate).format("YYYY-MM-DD")
        const eDate = moment(endDate).format("YYYY-MM-DD")

        setRangeLoading(true)
        const _data = await JSON.parse(localStorage.getItem('data'))
        const URL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/export/attendance/range"
            : " /api/export/attendance/range";

        await fetch(URL, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                "Accept": 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "start_date": sDate,
                "end_date": eDate,
                "tokens": _data,
            })
        })
            .then(async response => {
                try {
                    if (response.status !== 200) {
                        setRangeLoading(false)
                        console.log("Not 200")
                    } else {
                        const data = await response.json()
                        window.open("https://" + data.data, "_blank");
                        swal(data.message.toUpperCase());
                        setRangeLoading(false)
                    }
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });
    };

    let [startDate, setStartDate] = useState("")
    let [endDate, setEndDate] = useState("")
    const getAttendanceListByRange = async (d) => {

        if (!startDate) return swal("Please provide Start Date for range")
        if (!endDate) return swal("Please provide end Date for range")

        //get the data
        const sDate = moment(startDate).format("YYYY-MM-DD")
        const eDate = moment(endDate).format("YYYY-MM-DD")

        setRangeLoading(true)
        const _data = await JSON.parse(localStorage.getItem('data'))
        const URL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/attendance/get/byrange"
            : " /api/attendance/get/byrange";

        await fetch(URL, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                "Accept": 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "start_date": sDate,
                "end_date": eDate,
                "tokens": _data,
            })
        })
            .then(async response => {
                try {
                    if (response.status !== 200) {
                        setRangeLoading(false)
                        console.log("Not 200")
                    } else {
                        const data = await response.json()
                        setRangeData(data);
                        setRangeLoading(false)
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
        getAttendanceList(new Date())
        getAttendanceListByMonth(new Date())
    }, [])


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
            // width: '20%',
            ...getColumnSearchProps('name'),
            // render: (val)=> <a onClick={()=>console.log(val)} style={{borderWidth: "0px", color: "blue"}}>{val}</a>
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
            title: 'In Time',
            dataIndex: 'in_time',
            key: 'in_time',
            // width: '20%',
        },
        {
            title: 'Out Time',
            dataIndex: 'out_time',
            key: 'out_time',

        },
        {
            title: 'Distance In',
            dataIndex: 'distance_in',
            key: 'distance_in',
            render: (text) => {
                return (
                    <>{text} mtrs</>
                );
            }
        },
        {
            title: 'Distance Out',
            dataIndex: 'distance_out',
            key: 'distance_out',
            render: (text) => {
                return (
                    <>{text} mtrs</>
                );
            }
        },
    ];

    let statusData = monthData.length != 0 ? monthData[0].performance : []
    const columnsMonth = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => {
                return (
                    <>{text}</>
                )
            }
        },
        {
            title: "Performance",
            dataIndex: "performance",
            children: statusData.map((assessment) => {
                const { dates, id } = assessment;
                return {
                    title: dates,
                    dataIndex: "performance",
                    key: id,
                    render: (values) =>
                        values.map((value, index) => {
                            let val;
                            if (index === id) val = values[index].att;
                            return val;
                        })
                };
            })
        }

        // {
        //     title: "Performance",
        //     dataIndex: "performance",
        //     children:
        //         statusData.map(e => {
        //             console.log(e.att);
        //             return {
        //                 title: e.dates,
        //                 dataIndex: e.att,
        //                 key: e.att,
        //                 render: value => <span>{e.att}</span>
        //             }
        //         })
        // }
    ];

    let statusRangeData = rangeData.length != 0 ? rangeData[0].performance : []
    const columnsRange = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => {
                return (
                    <>{text}</>
                )
            }
        },
        {
            title: "Performance",
            dataIndex: "performance",
            children: statusRangeData.map((assessment) => {
                const { dates, id } = assessment;
                return {
                    title: dates,
                    dataIndex: "performance",
                    key: id,
                    render: (values) =>
                        values.map((value, index) => {
                            let val;
                            if (index === id) val = values[index].att;
                            return val;
                        })
                };
            })
        }
    ];

    const onChange = (value, dateString) => {
        setStartDate(dateString[0])
        setEndDate(dateString[1])
    }

    return !viewprofile ? (
        <div>
            <div style={{ marginTop: "0px", display: "flex", flexDirection: "row", alignItems: "center" }}>
                <div style={{ marginRight: "10px", fontSize: "16px", fontWeight: "600" }}>View the Attendance Date-Wise</div>
                <DatePicker disabledDate={d => !d || d.isAfter(new Date())}
                    defaultValue={dayjs(moment(new Date()).format("YYYY-MM-DD"), "YYYY/MM/DD")} onChange={(date, dateString) => {
                        setDateWiseDownloadDate(dateString)
                        getAttendanceList(dateString)
                    }} />
                <Button icon={<DownloadOutlined style={{ fontSize: "15px" }} />} type='primary' onClick={() => downloadDateWise(dateWiseDownloadDate)} style={{ fontSize: "13px", marginLeft: "10px", fontWeight: "600" }}>EXPORT</Button>
            </div>
            <Table
                columns={columns}
                dataSource={empData}
                rowKey={(record) => record.id}
                bordered
                loading={loading}
                scroll={{
                    x: true,
                    y: 400,
                }}
                style={{ marginTop: "10px" }}
            />

            <div style={{ marginTop: "20px", display: "flex", flexDirection: "row", alignItems: "center" }}>

                <div style={{ marginRight: "10px", fontSize: "16px", fontWeight: "600" }}>View the Attendance by Month</div>
                <DatePicker defaultValue={dayjs(moment(new Date()).format("YYYY-MM-DD"), "YYYY/MM/DD")} disabledDate={d => !d || d.isAfter(new Date())} picker="month" onChange={(date, dateString) => {
                    setMonthWiseDownloadDate(dateString)
                    getAttendanceListByMonth(dateString)
                }} />
                <Button type='primary' icon={<DownloadOutlined style={{ fontSize: "15px" }} />} onClick={() => downloadMonthWise(monthWiseDownloadDate)} style={{ fontSize: "13px", marginLeft: "10px", fontWeight: "600" }}>EXPORT</Button>
            </div>
            <Table
                columns={columnsMonth}
                dataSource={monthData}
                rowKey={(record) => record.id}
                bordered
                loading={monthLoading}
                // scroll={{ x: true }}
                scroll={{
                    x: true,
                    y: 400,
                }}
                style={{ marginTop: "10px" }}
            />


            <div style={{ marginTop: "20px", display: "flex", flexDirection: "row", alignItems: "center" }}>
                <div style={{ marginRight: "10px", fontSize: "16px", fontWeight: "600" }}>View the Attendance by Date Range</div>
                <RangePicker onChange={onChange} />
                <Button type="primary" onClick={getAttendanceListByRange} style={{ marginLeft: "10px" }}>Search</Button>
                <Button type='primary' icon={<DownloadOutlined style={{ fontSize: "15px" }} />} onClick={() => downloadRangeWise()} style={{ fontSize: "13px", marginLeft: "10px", fontWeight: "600" }}>EXPORT</Button>

            </div>

            <Table
                columns={columnsRange}
                dataSource={rangeData}
                rowKey={(record) => record.id}
                bordered
                loading={rangeLoading}
                scroll={{
                    x: true,
                    y: 400,
                }}
                style={{ marginTop: "10px" }}
            />
        </div>
    )
        :
        <ViewProfile user_id={viewprofile} />
}

export default FacultyAttendance