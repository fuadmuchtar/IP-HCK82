import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { useState } from 'react';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const success = await Axios({
            method: 'POST',
            url: 'http://localhost:3000/login',
            data: form,
          });
          Swal.fire({
            icon: 'success',
            title: 'Login Berhasil',
            text: 'Selamat datang di aplikasi kami!',
          });
          localStorage.setItem('access_token', success.data.access_token);
          if (success) navigate('/');
    } catch (error) {
      console.log(error)
        Swal.fire({
            icon: 'error',
            title: 'Login Gagal',
            text: error.response?.data?.message || 'Terjadi kesalahan saat login',
        });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h3 className="text-center mb-4">Login</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Email</label>
              <input
                type="text"
                name="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
          <p className='text-center mt-4'>Belum punya akun? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
