// src/pages/UsersPage.js
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addUser, removeUser } from '../store/usersSlice';
import Card from '../components/Card';

const UsersPage = () => {
  const users = useSelector((state) => state.users.list);
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: '', role: '' });

  const handleAdd = () => {
    const id = Date.now();
    if (form.name && form.role) {
      dispatch(addUser({ id, ...form }));
      setForm({ name: '', role: '' });
    }
  };

  return (
    <Card title="Gestion des utilisateurs">
      <div>
        <input
          type="text"
          placeholder="Nom"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Rôle"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        />
        <button onClick={handleAdd}>Ajouter</button>
      </div>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.name} - {u.role}
            <button onClick={() => dispatch(removeUser(u.id))}>Supprimer</button>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default UsersPage;
