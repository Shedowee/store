import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useToast } from "../context/ToastContext";

export default function Header() {
  const { currentUser, role, logout, cart } = useUser();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully", "warning");
    navigate("/login");
  };

  const isHome = location.pathname === "/";

  return (
    <nav
      className={`navbar navbar-expand-lg px-3 ${
        isHome
          ? "navbar-dark bg-transparent position-absolute w-100"
          : "navbar-dark bg-dark"
      }`}
      style={{ zIndex: 10 }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand fs-3 fw-bold" to="/">
          Infinity Styles
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item me-2">
              <Link className="nav-link fw-semibold" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item me-2">
              <Link className="nav-link fw-semibold" to="/store">
                Store
              </Link>
            </li>
            <li className="nav-item me-2">
              <Link className="nav-link fw-semibold" to="/about">
                About
              </Link>
            </li>

            {role === "admin" && (
              <li className="nav-item me-2">
                <Link className="nav-link fw-semibold" to="/admin">
                  Admin Panel
                </Link>
              </li>
            )}

            {currentUser ? (
              <>
                <li className="nav-item me-2">
                  <Link className="nav-link fw-semibold" to="/cart">
                    Cart (
                    {cart.reduce((sum, item) => sum + (item.quantity || 1), 0)})
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-warning fw-bold"
                    style={{ marginLeft: "10px" }}
                    onClick={handleLogout}
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-2">
                  <Link className="btn btn-warning fw-bold" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-warning fw-bold" to="/signup">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
