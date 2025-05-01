import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Axios from 'axios';
import Swal from 'sweetalert2';

function Register() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const success = await Axios({
            method: 'POST',
            url: 'http://localhost:3000/register',
            data: form,
          });
          Swal.fire({
            icon: 'success',
            title: 'Register Berhasil',
            text: 'Silahkan login untuk melanjutkan',
          });
          if (success) navigate('/login');
    } catch (error) {
        console.log(error)
        Swal.fire({
            icon: 'error',
            title: 'Register Gagal',
            text: error.response?.data?.message || 'Terjadi kesalahan saat register',
        });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h3 className="text-center mb-4">Register</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Nama</label>
              <input
                type="text"
                name="fullName"
                className="form-control"
                value={form.fullName}
                onChange={handleChange}
              />
            </div>
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
            <button type="submit" className="btn btn-success w-100">Register</button>
          </form>
          <p className='text-center mt-4'>Sudah punya akun? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
