import React, { useState } from 'react';
import Axios from 'axios';

export default function ExploreIndonesia() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt) return;

    setLoading(true);
    try {
      const { data } = await Axios.post('http://localhost:3000/exploreindonesia', {
        'query': prompt
      });
      setResponse(data.result);
    } catch (err) {
      setResponse('Maaf, terjadi kesalahan saat memproses permintaanmu.');
    }
    setLoading(false);
  };

  const backgroundStyle = {
    backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_Indonesia.svg/800px-Flag_of_Indonesia.svg.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    padding: '40px 0',
  };

  const contentContainerStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '10px',
    padding: '30px',
    boxShadow: '0 0 15px rgba(0,0,0,0.2)'
  };

  return (
    <div style={backgroundStyle}>
      <div className="container mt-5" style={contentContainerStyle}>
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
            <div className="response-content">
              {response.split('\n').map((paragraph, index) => (
                paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
