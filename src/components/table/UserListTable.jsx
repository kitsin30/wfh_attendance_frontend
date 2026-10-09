import { useState } from 'react';
import { FaSearch, FaRedo, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

import './UserListTable.css';
import Loading from '../loading/Loading';

const UserListTable = ({
  userData = [],
  loading = false,
  onCreateUser,
  onEditUser,
  onDeleteUser,
}) => {
  const [searchUserId, setSearchUserId] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [resetPassFlg, setResetPassFlg] = useState('N');

  const filteredUsers = userData.filter((user) =>
    String(user.userId ?? '')
      .toLowerCase()
      .includes(appliedSearch.toLowerCase())
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedSearch(searchUserId.trim());
  };

  const handleReset = () => {
    setSearchUserId('');
    setAppliedSearch('');
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setResetPassFlg(Number(user.resetPassFlg ?? 'N'));
  };

  const handleSave = () => {
    if (!selectedUser) return;

    onEditUser(selectedUser.userId, resetPassFlg);
    setSelectedUser(null);
  };

  const handleDelete = (userId) => {
    if (window.confirm(`Are you sure you want to delete user ${userId}?`)) {
      onDeleteUser(userId);
    }
  };

  return (
    <main className="user-list-container">
      <div className="user-list-header">
        <div>
          <h1>User List</h1>
          <p>Manage user accounts</p>
        </div>

        <div className="user-total">
          <span>Total Users</span>
          <strong>{filteredUsers.length}</strong>
        </div>
      </div>

      <section className="user-list-card">
        <form className="user-list-toolbar" onSubmit={handleSearch}>
          <div className="user-filter-field">
            <label htmlFor="searchUserId">User ID</label>

            <input
              id="searchUserId"
              type="text"
              placeholder="Enter user ID..."
              value={searchUserId}
              onChange={(e) => setSearchUserId(e.target.value)}
            />
          </div>

          <button type="submit" className="user-search-btn">
            <FaSearch />Search
          </button>

          <button type="button" className="user-reset-btn" onClick={handleReset}>
            <FaRedo />Reset
          </button>

          <button type="button" className="user-create-btn" onClick={onCreateUser}>
            <FaPlus />Create New User
          </button>
        </form>

        {loading ? (<Loading />
        ) : (
          <div className="user-table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>User ID</th>
                  <th>User Level</th>
                  <th>Reset Password Flag</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="user-empty">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr key={user.id ?? user.userId}>
                      <td>{index + 1}</td>
                      <td>{user.userId}</td>
                      <td>{user.userLevel}</td>
                      <td>{Number(user.resetPassFlg ?? 0)}</td>
                      <td>
                        <div className="user-action-buttons">
                          <button type="button" className="user-edit-btn" onClick={() => handleEdit(user)}>
                            <FaEdit />Edit
                          </button>

                          <button type="button" className="user-delete-btn" onClick={() => handleDelete(user.userId)}>
                            <FaTrash />Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedUser && (
        <div className="user-modal-overlay">
          <div className="user-modal" role="dialog" aria-modal="true" aria-labelledby="edit-user-title">
            <h2 id="edit-user-title">Edit User</h2>
            <p>User ID: <strong>{selectedUser.userId}</strong></p>

            <label htmlFor="resetPassFlg">Reset Password Flag</label>

            <select id="resetPassFlg" value={resetPassFlg} onChange={(e) => setResetPassFlg(Number(e.target.value))}>
              <option value={'N'}>N - No</option>
              <option value={'Y'}>Y - Yes</option>
            </select>

            <div className="user-modal-actions">
              <button
                type="button"
                className="user-cancel-btn"
                onClick={() => setSelectedUser(null)}
              >
                Cancel
              </button>

              <button type="button" className="user-save-btn" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default UserListTable;