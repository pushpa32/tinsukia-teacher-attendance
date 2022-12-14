import { Menu } from "antd";
import React, { useState } from "react";
import {
  HomeOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import './mymenu.css';

function MyMenu() {
  const [active, setActive] = useState("1");
  return (
    <>
      <Menu
        mode="vertical"
        defaultSelectedKeys={[active]}
        className="mymenu"
      >
        <Menu.Item key="1" icon={<HomeOutlined />} >
          <Link onClick={() => setActive("1")} to="" className="mymenulink">Dashboard</Link>
        </Menu.Item>


        <Menu.SubMenu key="2" title="Faculties" icon={<UserOutlined />}>
          <Menu.Item key="21" icon={<UserOutlined />}>
            <Link onClick={() => setActive("21")} to="teachers">List</Link>
          </Menu.Item>
          <Menu.Item key="22" icon={<UsergroupAddOutlined style={{ fontSize: '120%' }} />}>
            <Link onClick={() => setActive("22")} to="teachers/registration">Registration</Link>
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.Item key="1" icon={<FileOutlined />} >
          <Link onClick={() => setActive("3")} to="teachers/attendance" className="mymenulink">Attendance</Link>
        </Menu.Item>

      </Menu>
    </>
  );
}

export default MyMenu;
