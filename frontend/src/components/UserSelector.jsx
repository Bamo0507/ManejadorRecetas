import { useState, useEffect } from 'react';
import api from '@services/api';

export default function UserSelector({ currentUserId, onChangeUser }) {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    api
      .get('/usuarios')
      .then((resp) => {
        setUsuarios(resp.data);
      })
      .catch((err) => {
        console.error('Error cargando usuarios:', err);
      });
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="user-select" className="text-gray-700 text-base font-semibold">
        Usuario:
      </label>

      <select
        id="user-select"
        value={currentUserId}
        onChange={(e) => onChangeUser(e.target.value)}
        className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
      >
        {usuarios.map((u) => (
          <option key={u.id} value={u.id}>
            {u.id} – {u.username}
          </option>
        ))}
      </select>
    </div>
  );
}