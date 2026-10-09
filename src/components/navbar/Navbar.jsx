import './Navbar.css';
import { HOME_ADMIN, HOME_ADMIN_ATTENDANCE_LIST, HOME_EMP, HOME_EMP_HISTORY, USER_LEVEL_EMP } from '../../config/Parameter';

const Navbar = () => {
  const userLevel = localStorage.getItem("userLevel");

  const isEmployeeLevel = userLevel === USER_LEVEL_EMP;

  const homePage = isEmployeeLevel ? {HOME_EMP} : {HOME_ADMIN};

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
            <link to={HOME_EMP_HISTORY}>History</link>
          </div>
        ) : (
          <div className='navbar-opt'>
            <link to={HOME_ADMIN}>User List</link>
            <link to={HOME_ADMIN_ATTENDANCE_LIST}>Attendance List</link>
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