import { Link } from 'react-router-dom';
import {
  DesktopOutlined,
  FileOutlined,
  DashboardOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons';

// this is the

const MyMenu = [
  getItem(
    'Dashboard',
    '1',
    <Link to="">
      <DashboardOutlined />
    </Link>,
  ),
  getItem('Faculties', 'sub1', <UserOutlined />, [
    getItem('List', '2', <Link to="teachers"><UserOutlined /></Link>),
    getItem('Registration', '3', <Link to="teachers/registration"><UsergroupAddOutlined style={{ fontSize: '120%' }} /></Link>),
  ]),
  getItem(
    'Attendance',
    '4',
    <Link to="teachers/attendance">
      <FileOutlined />
    </Link>,
  ),
]

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

export default MyMenu;
