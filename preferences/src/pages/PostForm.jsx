import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PostForm({ token, refresh, editPost, setEditPost }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (editPost) {
      setTitle(editPost.title);
      setContent(editPost.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [editPost]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const headers = { Authorization: `Bearer ${token}` };

    if (editPost) {
      await axios.put(`http://localhost:3000/posts/${editPost.id}`, { title, content }, { headers });
    } else {
      await axios.post(`http://localhost:3000/posts`, { title, content }, { headers });
    }

    setTitle('');
    setContent('');
    setEditPost(null);
    refresh();
  };

  return (
    <div>
      <h4>{editPost ? 'Edit Post' : 'Tambah Post Baru'}</h4>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <input className="form-control" placeholder="Judul" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div className="mb-2">
          <textarea className="form-control" placeholder="Konten" rows="3" value={content} onChange={e => setContent(e.target.value)} required />
        </div>
        <button className="btn btn-success">{editPost ? 'Update' : 'Tambah'}</button>
        {editPost && <button type="button" className="btn btn-secondary ms-2" onClick={() => setEditPost(null)}>Batal</button>}
      </form>
    </div>
  );
}
