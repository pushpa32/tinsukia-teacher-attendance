import React from 'react';
// import logo from '../../assests/logo-gratia.png';
// import avatar from '../../assests/avataar.png';
// import arrowDown from '../../assests/arrow-down.png';
import { Menu } from 'antd';
import NavMenu from '../staticObjects/NavMenu';
import './index.css'


export default function TopBar({ collap }) {
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row-reverse', padding: "10px" }}>
        <Menu
          theme="dark"
          defaultSelectedKeys={['0']}
          mode="inline"
          items={NavMenu}
          className="nav-menu"
        />

      </div>
    </>
  );
}

