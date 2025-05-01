import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:3000/login', { username, password });
      dispatch(loginSuccess(data.token));
      navigate('/dashboard');
    } catch (err) {
      setErr('Login gagal. Cek username/password!');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4">Admin Login</h2>
      {err && <div className="alert alert-danger">{err}</div>}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input className="form-control" value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
}
