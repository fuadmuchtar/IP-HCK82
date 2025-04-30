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
                    <div class="dropdown me-3">
                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                            Kategori
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <li><a class="dropdown-item" href="#">Kerajinan</a></li>
                            <li><a class="dropdown-item" href="#">Pakaian</a></li>
                            <li><a class="dropdown-item" href="#">Makanan</a></li>
                        </ul>
                    </div>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        {/* Left Menu */}
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <a className="nav-link active" href="#">
                                    Cart
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">
                                    Login
                                </a>
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
                        {/* Right Button */}
                        <a href="#" className="btn btn-outline-warning ms-lg-3 mt-2 mt-lg-0">
                            Explore Indonesia
                        </a>
                    </div>
                </div>
            </nav>

        </>
    )
}