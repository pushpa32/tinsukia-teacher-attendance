import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import jwt_decode from 'jwt-decode';
import Error404 from './pages/Error404';
import AdminDashboard from './pages/admin/AdminDashboard';
import Login from './pages/adminLogin/Login';
import Dashboard from './pages/admin/Dashboard';
import FacultyList from './pages/admin/pages/FacultyList';
import FacultyAttendance from './pages/admin/pages/FacultyAttendance';
import Registration from './pages/admin/pages/Registration';
import FacultyLogin from './pages/faculty/FacultyLogin';
import FacultyProfile from './pages/faculty/initial/FacultyProfile';
import UpdatePersonalDetails from './pages/admin/pages/UpdatePersonalDetails';

function App() {
  const logCheck = localStorage.getItem("data");
  let decoded_data = ""
  if (logCheck != null) {
    decoded_data = jwt_decode(logCheck)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FacultyLogin />} />
        <Route path="/admin" element={<Login />} />

        {logCheck ?
          (decoded_data.user.isUser === 0 ?
            <Route path="/dashboard/*" element={<Dashboard />} >
              <Route path="" element={<AdminDashboard />} />
              <Route path="teachers" element={<FacultyList />} />
              <Route path="teachers/registration" element={<Registration />} />
              <Route path="teachers/attendance" element={<FacultyAttendance />} />
              <Route path="update/details" element={<UpdatePersonalDetails />} />
            </Route>
            :
            <Route path="/user/*" element={<FacultyProfile />} />
          )
          : (
            <Route path="/" element={<App />} />
          )}

        {/* route for random/ wrong URLs */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
