import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'
import { API_URL, HOME_ADMIN_URL, HOME_EMP_URL, LOGIN_SUCCESS, LOGIN_URL, RESET_PASS_URL, RESET_PASSWORD_REQUIRED, USER_LEVEL_ADMIN, USER_LEVEL_EMP, USER_LEVEL_OWNER } from '../../config/Parameter';
import Input from '../../components/input/input';
import LoginButton from '../../components/button/LoginButton';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      userId: username,
      password: password,
      updUid: username
    };

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if(!response.ok){
        console.log("false");
        alert(data.message);
        return;
      }
      
      localStorage.setItem('userId', JSON.stringify(data.userEntity.userId));
      
      if (data.status === RESET_PASSWORD_REQUIRED) {
        navigate(RESET_PASS_URL);
        return;
      }

      localStorage.setItem('userLevel', JSON.stringify(data.userEntity.userLevel));

      if (data.status === LOGIN_SUCCESS) {
        const userLevel = data.userEntity.userLevel
        if (userLevel === USER_LEVEL_EMP) {
          navigate(HOME_EMP_URL);
          return;
        }
        if (userLevel === USER_LEVEL_OWNER || userLevel === USER_LEVEL_ADMIN) {
          navigate(HOME_ADMIN_URL);
          return;
        }
        navigate(LOGIN_URL);
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-page">
      <div className="wrapper">
        <h1>Login</h1>

        <form onSubmit={handleLogin}>
          <Input
            label="Username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />

          <div className='login-button-div'>
            <LoginButton 
              type="submit"
              childrenComponent="Login"
              disabled={false}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;