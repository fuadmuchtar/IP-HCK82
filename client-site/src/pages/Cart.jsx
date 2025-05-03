import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCarts, removeFromCart } from '../stores/cartSlice';

function Cart() {
    const dispatch = useDispatch()
    const { items: data, loading, error } = useSelector(state => state.cart)

    useEffect(() => {
        dispatch(fetchCarts())
    }, []);

    return (
        <div className="container mt-5">
            <h3 className="mb-4">Keranjang Belanja</h3>


            {data.length === 0 ? (
                <div className="alert alert-info">Keranjangmu masih kosong!</div>
            ) : (
                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th>Produk</th>
                                <th>Harga</th>
                                <th>Qty</th>
                                <th>Total</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.Product.name}</td>
                                    <td>Rp {item.Product.price.toLocaleString()}</td>
                                    <td>{item.quantity}</td>
                                    <td>Rp {(item.Product.price * item.quantity).toLocaleString()}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => {
                                                dispatch(removeFromCart(item.ProductId))
                                                // dispatch(fetchCarts())
                                            }}
                                        >
                                            <i className="bi bi-trash" /> Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan="3" className="text-end fw-bold">Total</td>
                                <td colSpan="2" className="fw-bold">Rp {
                                    data.reduce((total, item) => total + (item.Product.price * item.quantity), 0).toLocaleString()
                                }</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {data.length > 0 && (
                <div className="d-flex justify-content-end">
                    <button className="btn btn-success">Lanjut ke Pembayaran</button>
                </div>
            )}
        </div>
    );
}

export default Cart;
