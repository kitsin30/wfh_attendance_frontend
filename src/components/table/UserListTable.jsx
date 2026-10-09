import { useState } from 'react';
import { FaSearch, FaRedo, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

import { USER_LEVEL_OWNER, USER_LEVEL_ADMIN, USER_LEVEL_EMP } from '../../config/Parameter';

import './UserListTable.css';
import Loading from '../loading/Loading';

const UserListTable = ({
  userData = [],
  loading = false,
  onCreateUser,
  onEditUser,
  onDeleteUser,
}) => {
  const initialNewUser = {
    userId: '',
    userLevel: '',
    resetPassFlg: 'Y',
  };

  const [searchUserId, setSearchUserId] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  const [selectedUser, setSelectedUser] = useState(null);
  const [resetPassFlg, setResetPassFlg] = useState('N');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState(initialNewUser);

  const getUserLevelName = (userLevel) => {
    switch (Number(userLevel)) {
      case USER_LEVEL_OWNER:
        return 'Owner';
      case USER_LEVEL_ADMIN:
        return 'Admin';
      case USER_LEVEL_EMP:
        return 'Employee';
      default:
        return 'Unknown';
    }
  };

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
    setResetPassFlg(user.resetPassFlg ?? 'N');
  };

  const handleSave = () => {
    if (!selectedUser) return;

    onEditUser(selectedUser.userId, resetPassFlg);
    setSelectedUser(null);
  };

  const handleOpenCreate = () => {
    setNewUser(initialNewUser);
    setShowCreateModal(true);
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;

    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateSave = (e) => {
    e.preventDefault();

    if (!newUser.userId.trim() || !newUser.userLevel) {
      alert('Please enter User ID and select User Level');
      return;
    }

    const userToCreate = {
      userId: newUser.userId.trim(),
      userLevel: Number(newUser.userLevel),
      resetPassFlg: 'Y',
    };

    onCreateUser(userToCreate);

    setShowCreateModal(false);
    setNewUser(initialNewUser);
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

          <button
            type="button"
            className="user-reset-btn"
            onClick={handleReset}
          >
            <FaRedo />Reset
          </button>

          <button
            type="button"
            className="user-create-btn"
            onClick={handleOpenCreate}
          >
            <FaPlus />Create New User
          </button>
        </form>

        {loading ? (
          <Loading />
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
                      <td>{getUserLevelName(user.userLevel)}</td>
                      <td>{user.resetPassFlg ?? 'N'}</td>

                      <td>
                        <div className="user-action-buttons">
                          <button
                            type="button"
                            className="user-edit-btn"
                            onClick={() => handleEdit(user)}
                          >
                            <FaEdit />Edit
                          </button>

                          <button
                            type="button"
                            className="user-delete-btn"
                            onClick={() => handleDelete(user.userId)}
                          >
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

      {showCreateModal && (
        <div className="user-modal-overlay">
          <div
            className="user-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-user-title"
          >
            <h2 id="create-user-title">Create New User</h2>

            <form onSubmit={handleCreateSave}>
              <div className="user-modal-field">
                <label htmlFor="newUserId">User ID</label>

                <input
                  id="newUserId"
                  name="userId"
                  type="text"
                  placeholder="Enter User ID"
                  value={newUser.userId}
                  onChange={handleNewUserChange}
                  required
                />
              </div>

              <div className="user-modal-field">
                <label htmlFor="newUserLevel">User Level</label>

                <select
                  id="newUserLevel"
                  name="userLevel"
                  value={newUser.userLevel}
                  onChange={handleNewUserChange}
                  required
                >
                  <option value="">Select User Level</option>
                  <option value={USER_LEVEL_OWNER}>Owner</option>
                  <option value={USER_LEVEL_ADMIN}>Admin</option>
                  <option value={USER_LEVEL_EMP}>Employee</option>
                </select>
              </div>

              <div className="user-modal-actions">
                <button
                  type="button"
                  className="user-cancel-btn"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="user-save-btn">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="user-modal-overlay">
          <div
            className="user-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-user-title"
          >
            <h2 id="edit-user-title">Edit User</h2>

            <p>
              User ID: <strong>{selectedUser.userId}</strong>
            </p>

            <div className="user-modal-field">
              <label htmlFor="resetPassFlg">
                Reset Password Flag
              </label>

              <select
                id="resetPassFlg"
                value={resetPassFlg}
                onChange={(e) => setResetPassFlg(e.target.value)}
              >
                <option value="N">N - No</option>
                <option value="Y">Y - Yes</option>
              </select>
            </div>

            <div className="user-modal-actions">
              <button
                type="button"
                className="user-cancel-btn"
                onClick={() => setSelectedUser(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="user-save-btn"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default UserListTable;