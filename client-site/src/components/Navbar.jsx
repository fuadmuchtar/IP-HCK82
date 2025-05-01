

export default function Navbar() {
    return (
    <>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
  <div className="container">
    <a className="navbar-brand" href="#">
      BroFuadMarket
    </a>
    <button
      className="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
    >
      <span className="navbar-toggler-icon" />
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      {/* Left Menu */}
      <ul className="navbar-nav me-auto">
        {/* Dropdown Baru */}
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
            <li>
              <a className="dropdown-item" href="#">
                Kerajinan
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Fashion
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Aksesoris
              </a>
            </li>
          </ul>
        </li>
      </ul>
      {/* Centered Search */}
      <form className="d-flex mx-auto" style={{ width: 400 }}>
        <input
          className="form-control rounded-pill w-100"
          type="search"
          placeholder="Cari produk..."
          aria-label="Search"
        />
      </form>
      <div className="d-flex align-items-center ms-lg-3 mt-2 mt-lg-0">
        <a href="#" className="btn btn-light me-2 position-relative">
          <i className="bi bi-cart3" />
          {/* Optional: badge */}
          {/* <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">3</span> */}
        </a>
        <a href="#" className="btn btn-outline-warning me-2">
          Explore Indonesia
        </a>
        {/* Profile & Sign In */}
        <div className="dropdown">
          <button
            className="btn btn-outline-light dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
          >
            <i className="bi bi-person-circle" />
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <a className="dropdown-item" href="#">
                Profile
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Sign In
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</nav>

    </>

    )
}