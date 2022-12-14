import { Link } from 'react-router-dom';
import {
    DesktopOutlined,
    FileOutlined,
    DashboardOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import swal from 'sweetalert';

const handleLogout = () => {
    swal("Are you sure?", {
        buttons: ["Oh no!", true],
    }).then((value) => {
        if (value === true) {
            localStorage.removeItem("data");
            window.location.href = "/admin";
        }
    });
};

const NavMenu = [
    getItem('John Peter', 'sub1', <UserOutlined />, [
        getItem('Profile', '1', <Link to="/dashboard/update/details"><UserOutlined /></Link>),
        getItem('Logout', '2', <Link to="#" onClick={handleLogout}><UserOutlined /></Link>),
    ]),
];

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}
export default NavMenu