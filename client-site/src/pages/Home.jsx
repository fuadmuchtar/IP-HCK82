import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../stores/productSlice'

export default function Home() {
    const dispatch = useDispatch()
    const { items: products, loading, error } = useSelector((state) => state.product)

    useEffect(() => {
        dispatch(fetchProducts())
    }, [])

    return (
        <>
            {/* Main Content */}
            <main>
                {/* Hero */}
                <div className="py-5 text-center">
                    <div className="container">
                        <div className='row'>
                            <div className='col-8'>
                                <div className="card custom-card" onClick={() => window.location.href = `/produk/${product.id}`}
                                    style={{ cursor: "pointer", height: 300 }}>
                                    <img src="https://i.etsystatic.com/ij/1f1067/6862532967/ij_680x540.6862532967_jg2udl6x.jpg?version=0" className="card-img" alt="..." />
                                </div>
                            </div>
                            <div className='col-4'>
                                <div className="card custom-card" onClick={() => window.location.href = `/produk/${product.id}`}
                                    style={{ cursor: "pointer"}}>
                                    <img src="https://i.etsystatic.com/ij/1f1067/6862532967/ij_680x540.6862532967_jg2udl6x.jpg?version=0" className="card-img" alt="..." />
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
                <div className="container py-5">
                    <div className="row g-4 justify-content-center">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="col-12 col-sm-6 col-md-4 col-lg-3"
                            >
                                <div
                                    className="card custom-card"
                                    onClick={() => window.location.href = `/produk/${product.id}`}
                                    style={{ cursor: "pointer" }}
                                >
                                    <img
                                        src={product.imgUrl}
                                        alt={product.name}
                                    />
                                    <div className="custom-card-body">
                                        <div className="custom-card-title">{product.name}</div>
                                        <div className="custom-card-text">
                                            {/* {product.description} */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>

    );
}