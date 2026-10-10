import { useState } from 'react';
import { FaSearch, FaRedo, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

import { USER_LEVEL_ADMIN, USER_LEVEL_EMP, USER_LEVEL_OWNER } from '../../config/Parameter';

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
    password: '',
    userLevel: '',
    resetPassFlg: 'Y',
  };

  const [searchUserId, setSearchUserId] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  const [selectedUser, setSelectedUser] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState(initialNewUser);

  const [editPass, setEditPass] = useState('');

  const currentUserId = localStorage.getItem("userId");
  
  const getUserLevelName = (userLevel) => {
    switch (Number(userLevel)) {
      case USER_LEVEL_OWNER:
        return 'owner';
      case USER_LEVEL_ADMIN:
        return 'Admin';
      case USER_LEVEL_EMP:
        return 'Employee';
      default:
        return 'Unknown';
    }
  };

  const filteredUsers = userData.filter((user) =>
    currentUserId.toLowerCase() !== user.userId.toLowerCase() && String(user.userId ?? '')
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
  };

  const handleSaveEdit = () => {
    if (!selectedUser) return;

    onEditUser(selectedUser.userId, currentUserId, editPass);
    setSelectedUser(null);
    setEditPass('');
  };

  const handleCancelEdit = () => {
    setSelectedUser(null);
    setEditPass('');
  }

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

    onCreateUser(newUser.userId.trim(), newUser.password, Number(newUser.userLevel), currentUserId);

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
                            disabled={user.userLevel === USER_LEVEL_OWNER}
                          >
                            <FaEdit />Edit
                          </button>

                          <button
                            type="button"
                            className="user-delete-btn"
                            onClick={() => handleDelete(user.userId)}
                            disabled={user.userLevel === USER_LEVEL_OWNER}
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
                <label htmlFor="newPassWord">Password</label>

                <input
                  id="newPassWord"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={newUser.password}
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
            <h2 id="edit-user-title">Are you want to reset Pass User</h2>

            <p>User ID: <strong>{selectedUser.userId}</strong></p>

            <div className="user-modal-field">
              <label htmlFor="editPass">new password</label>

              <input
                id="editPass"
                name="editPass"
                type="password"
                placeholder="Enter your new password"
                value={editPass}
                onChange={(e) => setEditPass(e.target.value)}
                required
              />
            </div>

            <div className="user-modal-actions">
              <button
                type="button"
                className="user-cancel-btn"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>

              <button
                type="button"
                className="user-save-btn"
                onClick={handleSaveEdit}
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