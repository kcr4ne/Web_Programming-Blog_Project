import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../services/userService';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>사용자 목록을 불러오는 중...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>오류: {error}</div>;
  }

  return (
    <div>
      <h1>관리자 대시보드</h1>
      <p>이 페이지는 관리자만 볼 수 있습니다.</p>

      <h2 style={{ marginTop: '2rem' }}>전체 사용자 목록</h2>
      {users.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <th style={{ padding: '8px', textAlign: 'left' }}>Username</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Role</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{user.username || 'N/A'}</td>
                <td style={{ padding: '8px' }}>{user.email}</td>
                <td style={{ padding: '8px' }}>{user.role || 'user'}</td>
                <td style={{ padding: '8px' }}>
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>사용자가 없습니다.</p>
      )}
    </div>
  );
};

export default AdminDashboard;