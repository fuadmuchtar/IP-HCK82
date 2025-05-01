import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import PostForm from './PostForm';

export default function Dashboard() {
  const token = useSelector(state => state.auth.token);
  const [posts, setPosts] = useState([]);
  const [editPost, setEditPost] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchPosts = async () => {
    const { data } = await axios.get('http://localhost:3000/posts', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPosts(data);
  };

  useEffect(() => {
    if (!token) return navigate('/');
    fetchPosts();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus post ini?')) return;
    await axios.delete(`http://localhost:3000/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchPosts();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
      </div>

      <PostForm token={token} refresh={fetchPosts} editPost={editPost} setEditPost={setEditPost} />

      <h4 className="mt-5">Daftar Post</h4>
      <table className="table table-bordered mt-2">
        <thead>
          <tr>
            <th>Judul</th>
            <th>Konten</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(p => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{p.content}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => setEditPost(p)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
