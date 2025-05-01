import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../stores/productSlice";

export default function Home(props) {
    const dispatch = useDispatch()
    const { items: data, loading, error } = useSelector(state => state.product)
  
    useEffect(() => {
      dispatch(fetchProducts())
    }, []);

    return (
        <main>
            {/* Hero */}
            <div className="bg-light py-5 text-center">
                <div className="container">
                    <h1 className="display-4">Selamat Datang!</h1>
                    <p className="lead">
                        Web E-Commerce barang unik, kerajinan tangan khas Indonesia!
                    </p>
                </div>
            </div>
            <div className="container py-5">
                <div className="row g-4 justify-content-center">
                    {data.slice(0, 4).map((item) => (
                        <div
                            key={item.id}
                            className="col-12 col-sm-6 col-md-4 col-lg-3"
                        >
                            <div
                                className="card custom-card"
                                style={{ cursor: "pointer" }}
                            >
                                <img
                                    src={item.imgUrl}
                                    alt={item.name}
                                />
                                <div className="custom-card-body">
                                    <div className="custom-card-title">{item.name}</div>
                                    {/* <div className="custom-card-text">{item.description}</div> */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>

    );
}