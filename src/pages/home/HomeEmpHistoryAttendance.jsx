import { useEffect, useState } from "react";
import { API_URL } from "../../config/Parameter";
import Navbar from "../../components/navbar/Navbar";
import AttendanceListTable from "../../components/table/AttendanceListTable";


const HomeEmpHistoryAttendance = () => {
  const [attendanceList, setAttendanceList] = useState([]);

  const [loading, setLoading] = useState(true);

  const userIdLocal = localStorage.getItem("userId");

  const empData = {
    userId: userIdLocal,
    dateOrderBy: 'ASC'
  }

  useEffect(() => {
    const fetchUserAttendance = async () => {
      try {
        const response = await fetch(`${API_URL}/attendance/get-user-all-attend`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(empData),
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
  }, [empData]);

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
}

export default HomeEmpHistoryAttendance;