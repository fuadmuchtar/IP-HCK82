import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { fetchUser, updateUser } from "../stores/userSlice";
import Swal from "sweetalert2";

export default function Profile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: user, loading, error } = useSelector((state) => state.user);
    const [form, setForm] = useState({
        email: "",
        password: "",
        fullName: "",
        address: "",
        phoneNumber: "",
    });

    useEffect(() => {
        dispatch(fetchUser());
    }, []);

    useEffect(() => {
        if (user) {
            setForm({
                fullName: user.fullName || "",
                email: user.email || "",
                password: user.password || "",
                address: user.address || "",
                phoneNumber: user.phoneNumber || "",
            });
        }
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(updateUser(form));

            Swal.fire({
                icon: 'success',
                title: 'Update Berhasil',
                text: 'Data berhasil diupdate',
            });
            dispatch(fetchUser());
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Update Gagal',
                text: error.response?.data?.message || 'Terjadi kesalahan saat update',
            });
        }
    };

    //   if (loading) {
    //     return (
    //       <div className="container mt-5 text-center">
    //         <div className="spinner-border text-primary" role="status" />
    //         <p className="mt-2">Memuat data profil...</p>
    //       </div>
    //     );
    //   }

    if (!user) {
        return (
            <div className="container mt-5">
                <div className="text-center p-4 rounded bg-warning text-dark fw-semibold">
                    <i className="bi bi-exclamation-circle me-2" />
                    Kamu harus login terlebih dahulu untuk melihat profil.
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h3 className="mb-4 text-center">Profil Saya</h3>
            <div className="card shadow-sm p-4">
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col-sm-3 fw-bold">Nama Lengkap</div>
                        <div className="col-sm-9">
                            <input
                                type="text"
                                className="form-control"
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-sm-3 fw-bold">Email</div>
                        <div className="col-sm-9">
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-sm-3 fw-bold">Password</div>
                        <div className="col-sm-9">
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-sm-3 fw-bold">Alamat Lengkap</div>
                        <div className="col-sm-9">
                            <input
                                type="text"
                                className="form-control"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-sm-3 fw-bold">No Hp</div>
                        <div className="col-sm-9">
                            <input
                                type="tel"
                                className="form-control"
                                name="phoneNumber"
                                value={form.phoneNumber}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <button
                            type="submit"
                            className="btn btn-outline-primary me-2"
                        >
                            <i className="bi bi-pencil-square" /> Edit Profil
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
