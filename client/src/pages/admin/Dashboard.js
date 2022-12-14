import React, { useState } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import logo from '../../assests/tinsukia.png'
import './dashboard.css';
import { Button, Layout, Menu, Drawer } from 'antd';
import TopBar from '../../dashboard/TopBar';
import MyBreadcumb from '../../dashboard/MyBreadcumb'
import MyMenu from '../../staticObjects/DashboardMenu';

const { Header, Content, Footer, Sider } = Layout;

export default function Dashboard() {
    const [collapsed, setCollapsed] = useState(false);
    const [currentLinkIndex, setCurrentLinkIndex] = useState('1');

    return (
        <div>
            <Layout
                style={{
                    minHeight: '100vh',
                }}
            >
                {/* <Drawer title="Basic Drawer" placement="left" onClose={onClose} open={open}>
                    <Menu
                        theme="dark"
                        defaultSelectedKeys={['1']}
                        mode="inline"
                        items={MyMenu}
                    />
                </Drawer> */}


                <Sider
                    breakpoint="lg"
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                >

                    <div className="avatar">
                        <img src={logo} alt="profile of the user" className="avatar" style={{ filter: 'contrast(1.2)' }} />
                        <div style={{ color: 'white', fontWeight: "bold", marginRight: "5px", textAlign: 'center' }}>Tinsukia Commerce College</div>
                    </div>

                    <hr style={{ backgroundColor: 'white', height: "2px" }} />

                    <Menu
                        theme="dark"
                        // defaultSelectedKeys={[currentLinkIndex]}
                        selectedKeys={[currentLinkIndex]}
                        mode="inline"
                        items={MyMenu}
                        onClick={(val) => setCurrentLinkIndex(val.key)}
                    />
                </Sider>

                <Layout className="site-layout">

                    <Header
                        className="site-layout-background"
                        style={{
                            padding: 0,
                        }}
                    >
                        <TopBar />
                    </Header>

                    <Content
                        style={{
                            margin: '0 16px',
                        }}
                    >

                        <MyBreadcumb />

                        <div
                            className="site-layout-background"
                            style={{
                                padding: 24,
                                minHeight: 360,
                            }}
                        >
                            {/* the actual content which will be passed by the router  */}
                            <Outlet />

                        </div>

                    </Content>

                    <Footer
                        style={{
                            textAlign: 'center',
                            background: '#0d6efd',
                            color: 'white',
                            padding: "13px"
                        }}
                    >
                        ©2022 Tinsukia Commerce College
                    </Footer>
                </Layout>
            </Layout>

        </div>
    );
}