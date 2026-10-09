import './Navbar.css';
import { USER_LEVEL_EMP } from '../../config/Parameter';

const Navbar = () => {
  const userLevel = localStorage.getItem("userLevel");

  const isEmployeeLevel = userLevel === USER_LEVEL_EMP;

  const homePage = isEmployeeLevel ? "/home/emp" : "/home/admin";

  const logout = () => {
    localStorage.removeItem("userId");
  }

  return (
    <div className='navbar'>
      <div className='title-home'>
        <h3>wfh-attendance</h3>
        <link to={homePage}><h3>Home</h3></link>
      </div>

      {isEmployeeLevel ? (
          <div className='navbar-opt'>
            <link to="/home/emp/history">History</link>
          </div>
        ) : (
          <div className='navbar-opt'>
            <link to="/home/admin/">User List</link>
            <link to="/home/admin/AttendanceList">Attendance List</link>
          </div>
        )
      }
      
      <div className='logout'>
        <link to="/" onClick={logout} className="link"><h3>Logout</h3></link>
      </div>
    </div>
  )
}

export default Navbar;