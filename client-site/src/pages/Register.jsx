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
      Swal.fire({
        icon: 'error',
        title: 'Register Gagal',
        text: error.response?.data?.message || 'Terjadi kesalahan saat register',
      });
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center align-items-stretch">
          <div className="col-lg-6 d-none d-lg-block">
            <img
              src="https://a.travel-assets.com/findyours-php/viewfinder/images/res70/210000/210083-Central-Java.jpg"
              alt="Register Illustration"
              className="img-fluid rounded-4 shadow w-100 h-100 object-fit-cover"
              style={{ objectFit: 'cover', height: '100%' }}
            />
          </div>
          <div className="col-lg-5 col-md-8 d-flex">
            <div className="card shadow-lg p-4 border-0 rounded-4 w-100 align-self-stretch">
              <h3 className="text-center mb-4">Buat Akun Baru</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nama Lengkap</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control rounded-pill"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Nama lengkap kamu"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="text"
                    name="email"
                    className="form-control rounded-pill"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Masukkan email aktif"
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
                    placeholder="Buat password"
                  />
                </div>
                <button type="submit" className="btn btn-success w-100 rounded-pill">
                  Daftar
                </button>
              </form>
              <p className="text-center mt-4 mb-0">
                Sudah punya akun? <Link to="/login">Login di sini</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
