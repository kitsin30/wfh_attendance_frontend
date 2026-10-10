import './Navbar.css';
import { HOME_ADMIN_ATTENDANCE_LIST_URL, HOME_ADMIN_URL, HOME_EMP_HISTORY_URL, HOME_EMP_URL, TITLE_NAVBAR, USER_LEVEL_EMP } from '../../config/Parameter';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const userLevel = Number(localStorage.getItem('userLevel'));

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userLevel");
  }

  return (
    <div className='navbar'>
      <div className='title-home'>
        <h3>{TITLE_NAVBAR}</h3>
      </div>

      {userLevel && userLevel === USER_LEVEL_EMP ? (
          <div className='navbar-opt'>
            <Link to={HOME_EMP_URL}>Home</Link>
            <Link to={HOME_EMP_HISTORY_URL}>History</Link>
          </div>
        ) : (
          <div className='navbar-opt'>
            <Link to={HOME_ADMIN_URL}>User List</Link>
            <Link to={HOME_ADMIN_ATTENDANCE_LIST_URL}>Attendance List</Link>
          </div>
        )
      }
      
      <div className='logout'>
        <Link to="/" onClick={logout} className="link"><h3>Logout</h3></Link>
      </div>
    </div>
  )
}

export default Navbar;