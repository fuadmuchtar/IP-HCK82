import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../stores/categorySlice";
import { Link } from "react-router";

export default function Navbar(props) {
  const dispatch = useDispatch()
  const { items: data, loading, error } = useSelector(state => state.category)
  const [search, setSearch] = useState('')

  const token = localStorage.getItem('access_token')

  useEffect(() => {
    dispatch(fetchCategories())
  }, []);


  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link to="/" className="navbar-brand">
            Bumi Karya
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="kategoriDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Kategori
                </a>
                <ul className="dropdown-menu">
                  {data.map((item) => (
                    <li key={item.id}>
                      <Link className="dropdown-item" to={`/category/${item.id}`}>
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
            <div className="d-flex align-items-center ms-lg-3 mt-2 mt-lg-0">

              <Link to='/explorewithai' className="btn btn-outline-warning me-5">
                Explore Indonesia
              </Link>
              <Link to="/cart" className="btn btn-light me-2 position-relative">
                <i className="bi bi-cart3" />
              </Link>
              {/* Optional: badge */}
              {/* <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">3</span>*/}
              {token && (
              <div className="dropdown">
                <button
                  className="btn btn-light dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle" />
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      Profile
                    </Link>
                  </li>
                  <li>
                  <Link className="dropdown-item" to="/orders">
                      My Orders
                    </Link>
                  </li>
                  <li>
                  <Link className="dropdown-item" onClick={() => {
                      localStorage.removeItem('access_token');
                      dispatch(logout());
                      }}>
                      Log out
                    </Link>
                  </li>
                </ul>
              </div>
              )}
              {!token && (
                <Link to="/login" className="btn btn-light">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

    </>

  )
}