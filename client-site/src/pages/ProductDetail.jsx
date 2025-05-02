import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useParams } from 'react-router';
import { addToCart } from '../stores/cartSlice';

// import { addToCart } from '../redux/actions/cartActions'; // asumsi ada action ini

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error('Gagal ambil data produk:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart(product.id))
  };

  if (!product) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-5">
          <img
            src={product.imgUrl}
            alt={product.name}
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-7">
          <h3>{product.name}</h3>
          <h4 className="text-success mb-3">Rp {product.price.toLocaleString()}</h4>
          <p>{product.description}</p>

          <button className="btn btn-warning" onClick={handleAddToCart}>
            <i className="bi bi-cart-plus" /> Tambah ke Keranjang
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
