import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import Axios from "axios";

export default function Category(props) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [data, setData] = useState([])
    const params = useParams()
    // const { items: data, loading, error } = useSelector(state => state.product)

    async function fetchProductByCategory() {
        const { data } = await Axios({
            method: "GET",
            url: `https://p2-ip.bebrave.cloud/products/c/${params.id}`,
        });

        setData(data)
    }
    useEffect(() => {
        fetchProductByCategory()
    }, [params.id]);

    return (
        <main>
            <div className="container py-5">
                <div className="row g-4 justify-content-center">
                    {data.slice(0, 4).map((item) => (
                        <div
                            key={item.id}
                            className="col-12 col-sm-6 col-md-4 col-lg-3"
                        >
                            <div
                                className="card custom-card"
                                onClick={() => {
                                    navigate(`/product/${item.id}`);
                                }}
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