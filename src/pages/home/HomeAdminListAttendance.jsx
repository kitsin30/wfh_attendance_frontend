import { useEffect, useState } from 'react';
import { FaSearch, FaRedo } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import './HomeAdminListAttendance.css';
import { API_URL } from '../../config/Parameter';
import Loading from '../../components/loading/Loading';

const HomeAdminListAttendance = () => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [searchUserId, setSearchUserId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [appliedFilters, setAppliedFilters] = useState({
    userId: '',
    startDate: '',
    endDate: '',
  });

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

  const handleSearch = (e) => {
    e.preventDefault();

    setAppliedFilters({
      userId: searchUserId.trim().toLowerCase(),
      startDate,
      endDate,
    });
  };

  const handleReset = () => {
    setSearchUserId('');
    setStartDate('');
    setEndDate('');

    setAppliedFilters({
      userId: '',
      startDate: '',
      endDate: '',
    });
  };

  const getAttendanceDate = (value) => {
    if (!value) return '';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const filteredAttendance = attendanceList.filter((attendance) => {
    const userId = String(attendance.userId ?? '').toLowerCase();

    const attendanceDate = getAttendanceDate(attendance.attendanceDate);

    const matchesUserId = !appliedFilters.userId || userId.includes(appliedFilters.userId);

    const matchesStartDate = !appliedFilters.startDate
      || (attendanceDate !== '' && attendanceDate >= appliedFilters.startDate);

    const matchesEndDate = !appliedFilters.endDate
      || (attendanceDate !== '' && attendanceDate <= appliedFilters.endDate);

    return (matchesUserId && matchesStartDate && matchesEndDate);
  });

  return (
    <div className="attendance-list-page">
      <Navbar />

      <main className="attendance-list-container">
        <div className="attendance-list-header">
          <div>
            <h1>Attendance List</h1>
            <p>Manage and review employee attendance records.</p>
          </div>

          <div className="attendance-total">
            <span>Total Records</span>
            <strong>{filteredAttendance.length}</strong>
          </div>
        </div>

        <section className="attendance-card">
          <form className="attendance-toolbar" onSubmit={handleSearch}>
            <div className="filter-field">
              <label htmlFor="searchUserId">User ID</label>

              <input
                id="searchUserId"
                type="text"
                placeholder="Enter user ID..."
                value={searchUserId}
                onChange={(e) => setSearchUserId(e.target.value)}
              />
            </div>

            <div className="filter-field">
              <label htmlFor="startDate">Start Date</label>

              <input
                id="startDate"
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="filter-field">
              <label htmlFor="endDate">End Date</label>

              <input
                id="endDate"
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <button type="submit" className="attendance-search-btn"><FaSearch /> Search</button>

            <button type="button" className="attendance-reset-btn" onClick={handleReset}><FaRedo /> Reset</button>
          </form>

          {loading ? Loading : filteredAttendance.length === 0 ? (
            <div className="attendance-message">
              <FaSearch className="empty-search-icon" />

              <h3>No attendance found</h3>

              <p>
                {appliedFilters.userId ||
                appliedFilters.startDate ||
                appliedFilters.endDate
                  ? 'Try changing your search filters.'
                  : 'There are no attendance records available.'}
              </p>
            </div>
          ) : (
            <div className="table-container">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Date</th>
                    <th>User ID</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAttendance.map((attendance, index) => (
                    <tr key={attendance.id ?? index}>
                      <td className="row-number">
                        {index + 1}
                      </td>

                      <td className="attendance-date">
                        {attendance.attendanceDate
                          ? new Date(
                              attendance.attendanceDate
                            ).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '-'}
                      </td>

                      <td>
                        <span className="user-id-badge">
                          {attendance.userId ??
                            attendance.user?.userId ??
                            '-'}
                        </span>
                      </td>

                      <td>
                        <span className="attendance-time check-in">
                          {attendance.startAttendTms
                            ? new Date(
                                attendance.startAttendTms
                              ).toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                              })
                            : '--:--'}
                        </span>
                      </td>

                      <td>
                        <span className="attendance-time check-out">
                          {attendance.endAttendTms
                            ? new Date(
                                attendance.endAttendTms
                              ).toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                              })
                            : '--:--'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredAttendance.length > 0 && (
            <div className="attendance-table-footer">
              Showing {filteredAttendance.length} of{' '}
              {attendanceList.length} attendance records
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default HomeAdminListAttendance;