import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'
import { API_URL, LOGIN_SUCCESS, RESET_PASSWORD_REQUIRED, USER_LEVEL_EMP } from '../../config/Parameter';
import Input from '../../components/input/input';
import Button from '../../components/button/LoginButton';

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

      if(data.status !== 200){
        console.log("false");
        alert(data.message);
        return;
      }

      localStorage.setItem('userId', JSON.stringify(data.userEntity.userId));
      localStorage.setItem('userLevel', JSON.stringify(data.userEntity.userLevel));
      
      if (data.status === RESET_PASSWORD_REQUIRED) {
        navigate("/reset-password");
        return;
      }

      if (data.status === LOGIN_SUCCESS) {
        if(data.userEntity.userLevel === USER_LEVEL_EMP) {
          navigate("/home/emp");
          return;
        }

        navigate("/home/admin");
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

          <div className="forgot-password">
            <link to="/forgot-password">Forgot Password?</link>
          </div>

          <Button type="submit">Login</Button>
        </form>
      </div>
    </div>
  );
};

export default Login;