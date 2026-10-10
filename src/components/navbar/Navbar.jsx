import './Navbar.css';
import { HOME_ADMIN_ATTENDANCE_LIST_URL, HOME_ADMIN_URL, HOME_EMP_HISTORY_URL, HOME_EMP_URL, TITLE_NAVBAR, USER_LEVEL_EMP } from '../../config/Parameter';

const Navbar = () => {
  const userLevel = localStorage.getItem("userLevel");

  const isEmployeeLevel = userLevel === USER_LEVEL_EMP;

  const homePage = isEmployeeLevel ? {HOME_EMP_URL} : {HOME_ADMIN_URL};

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userLevel");
  }

  return (
    <div className='navbar'>
      <div className='title-home'>
        <h3>{TITLE_NAVBAR}</h3>
        <link to={homePage}><h3>Home</h3></link>
      </div>

      {userLevel && isEmployeeLevel ? (
          <div className='navbar-opt'>
            <link to={HOME_EMP_URL}>Home</link>
            <link to={HOME_EMP_HISTORY_URL}>History</link>
          </div>
        ) : (
          <div className='navbar-opt'>
            <link to={HOME_ADMIN_URL}>User List</link>
            <link to={HOME_ADMIN_ATTENDANCE_LIST_URL}>Attendance List</link>
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