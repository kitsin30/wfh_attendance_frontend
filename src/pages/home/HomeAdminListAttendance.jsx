import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import './HomeAdminListAttendance.css';
import { API_URL } from '../../config/Parameter';
import AttendanceListTable from '../../components/table/AttendanceListTable';

const HomeAdminListAttendance = () => {
  const [attendanceList, setAttendanceList] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAttendance = async () => {
      try {
        const response = await fetch(`${API_URL}/attendance`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch attendance');
        }

        setAttendanceList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching attendance:', error);
        alert(error.message || 'Failed to fetch attendance');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAttendance();
  }, []);

  return (
    <div className="attendance-list-page">
      <Navbar />

      <AttendanceListTable
          attendanceData = {attendanceList}
          loading = {loading}
          title = "Attendance List"
          description = "view current employee list" />
    </div>
  );
};

export default HomeAdminListAttendance;