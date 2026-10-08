import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import './AttendanceList.css';

const HomeAdminListAttendance = () => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    try {
      const response = await fetch('http://localhost:3000/attendance');

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setAttendanceList(data);
    } catch (error) {
      console.error(error);
      alert('Failed to get attendance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const fetchUserAttendance = async () => {
              const response = await fetch(`${API_URL}/attendance/get-specific-user`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
              });
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setAttendanceList(data);

      fetchAttendance();
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }, []);

  return (
    <div className="attendance-list-page">
      <Navbar />

      <div className="attendance-list-container">
        <h1>Attendance List</h1>

        {loading ? (
          <p>Loading attendance...</p>
        ) : attendanceList.length === 0 ? (
          <p>No attendance data found.</p>
        ) : (
          <div className="table-container">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>User ID</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                </tr>
              </thead>

              <tbody>
                {attendanceList.map((attendance) => (
                  <tr key={attendance.id}>
                    <td>
                      {new Date(
                        attendance.attendanceDate
                      ).toLocaleDateString('id-ID')}
                    </td>

                    <td>
                      {attendance.userId}
                    </td>

                    <td>
                      {attendance.startAttendTms
                        ? new Date(
                            attendance.startAttendTms
                          ).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '--:--'}
                    </td>

                    <td>
                      {attendance.endAttendTms
                        ? new Date(
                            attendance.endAttendTms
                          ).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '--:--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeAdminListAttendance;