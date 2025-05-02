import React, { useState } from 'react';
import Axios from 'axios';

export default function ExploreIndonesia() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // const params = useParams();

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    if (!prompt) return;

    setLoading(true);
    try {
      const { data } = await Axios.post('http://localhost:3000/exploreindonesia',{
        'query': prompt
      });
      setResponse(data.result);
    } catch (err) {
      setResponse('Maaf, terjadi kesalahan saat memproses permintaanmu.');
    }
    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Explore Indonesia with AI</h2>

      <form onSubmit={handleSubmit}>
        <textarea
          className="form-control mb-3"
          rows={4}
          placeholder="Contoh: Rekomendasi tempat wisata alam di Jawa Barat"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button className="btn btn-primary" disabled={loading}>
          {loading ? 'Memproses...' : 'Tanya AI'}
        </button>
      </form>

      {response && (
        <div className="mt-4 p-3 border rounded bg-light">
          <h5 className="fw-bold">Jawaban AI:</h5>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
