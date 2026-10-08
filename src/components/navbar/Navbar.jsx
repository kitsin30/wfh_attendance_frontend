import './Navbar.css';
import { USER_LEVEL_EMP } from '../../config/Parameter';
const Navbar = () => {
  const userLevel = localStorage.getItem("userLevel");

  const homePage = userLevel === USER_LEVEL_EMP ? "/home/emp" : "/home/admin"

  const logout = () => {
    localStorage.removeItem("userId");
  }

  return (
    <div className='navbar'>
      <div className='title-home'>
        <h3>wfh-attendance</h3>
        <link to={homePage}><h3>Home</h3></link>
      </div>
      
      <div className='logout'>
        <link to="/" onClick={logout} className="link"><h3>Logout</h3></link>
      </div>
    </div>
  )
}

export default Navbar;