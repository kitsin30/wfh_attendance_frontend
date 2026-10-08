import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResetPass.css';
import { API_URL, LOGIN_SUCCESS, USER_LEVEL_EMP } from '../../config/Parameter';
import Input from '../../components/input/input';
import Button from '../../components/button/button';

const ResetPass = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    if(newPassword !== confirmNewPassword) {
      alert("New Password and Confirm New Password doesn't match");
      setNewPassword('');
      setConfirmNewPassword;
      return;
    }

    const resetData = {
      userId: username,
      password: password,
      newPassword: newPassword
    };

    try {
      const response = await fetch(`${API_URL}/users/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resetData),
      });

      const data = await response.json();

      if(!response.ok){
        console.log("false");
        alert(data.message + ', back to login page');
        navigate("/login");
        return;
      }

      localStorage.setItem('userId', JSON.stringify(data.userEntity.userId));

      if (data.status === LOGIN_SUCCESS) {
        if(data.userEntity.userLevel === USER_LEVEL_EMP) {
          navigate("/home");
          return;
        }

        navigate("/home-admin");
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="reset-page">
      <div className="wrapper">
        <h1>Reset Pass</h1>

        <form onSubmit={handleReset}>
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

          <Input
            label="NewPassword"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
          />

          <Input
            label="ConfirmNewPassword"
            name="confirmNewPassword"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="Confirmation new password"
          />

          <Button type="submit">Reset Password</Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPass;