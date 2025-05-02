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
      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: error.response?.data?.message || 'Terjadi kesalahan saat login',
      });
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center align-items-stretch">
          <div className="col-lg-6 d-none d-lg-block">
            <img
              src="https://mediaim.expedia.com/destination/1/cdf2aeb7ba7a907b7b0bd8e67419db4c.jpg"
              alt="Login Illustration"
              className="img-fluid rounded-4 shadow w-100 h-100"
              style={{ objectFit: 'cover', height: '100%' }}
            />
          </div>
          <div className="col-lg-5 col-md-8 d-flex">
            <div className="card shadow-lg p-4 border-0 rounded-4 w-100 align-self-stretch">
              <h3 className="text-center mb-4">Welcome Back 👋</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="text"
                    name="email"
                    className="form-control rounded-pill"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Masukkan email anda"
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control rounded-pill"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="********"
                  />
                </div>
                <button type="submit" className="btn btn-warning w-100 rounded-pill">
                  Login
                </button>
              </form>
              <p className="text-center mt-4 mb-0">
                Belum punya akun? <Link to="/register">Daftar sekarang</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
