import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResetPass.css';
import { API_URL, LOGIN_URL } from '../../config/Parameter';
import Input from '../../components/input/input';
import LoginButton from '../../components/button/LoginButton';

const ResetPass = () => {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const userId = localStorage.getItem('userId').replace(/"/g, '');;

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
      userId: userId,
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
        navigate(LOGIN_URL);
        localStorage.removeItem('userId')
        return;
      }

      alert(data.message + ', back to login page');
      navigate(LOGIN_URL);
      localStorage.removeItem('userId');
      return;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="reset-page">
      <div className="wrapper-reset">
        <h1>Reset Pass</h1>

        <form onSubmit={handleReset}>
          <Input
            label="userId"
            name="userId"
            type="text"
            value={userId}
            readOnly
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

          <LoginButton
            type="submit"
            childrenComponent="Reset Password"
            disabled={false}
          />
        </form>
      </div>
    </div>
  );
};

export default ResetPass;