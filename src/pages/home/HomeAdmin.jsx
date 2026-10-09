import { useEffect, useState } from 'react';
import './HomeAdminListAttendance.css';
import { API_URL } from '../../config/Parameter';
import Navbar from '../../components/navbar/Navbar';
import UserListTable from '../../components/table/UserListTable';

const HomeAdmin = () => {
  const [userList, setUserList] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const response = await fetch(`${API_URL}/users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch attendance');
        }

        setUserList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching attendance:', error);
        alert(error.message || 'Failed to fetch attendance');
      } finally {
        setLoading(false);
      }
    };

    fetchUserList();
  }, []);

  const onCreateUser = async ({userId, password, updUid}) => {
    try {
      const userData = {
        userId: userId,
        password: password,
        updUid: updUid
      };

      const response = await fetch(`${API_URL}/users/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch attendance');
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      alert(error.message || 'Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  }

  const onEditUser = async ({userId, updUid}) => {
    try {
      const userData = {
        userId: userId,
        updUid: updUid
      };

      const response = await fetch(`${API_URL}/users/reset-flag`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch attendance');
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      alert(error.message || 'Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  }

  const onDeleteUser = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch attendance');
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      alert(error.message || 'Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="user-list-page">
      <Navbar />

      <UserListTable
        userData={userList}
        loading={loading}
        onCreateUser={onCreateUser}
        onEditUser={onEditUser}
        onDeleteUser={onDeleteUser}
      />
    </div>
  );
};

export default HomeAdmin;