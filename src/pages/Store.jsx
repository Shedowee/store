// pages/Store.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useToast } from "../context/ToastContext";

export default function Store() {
  const { currentUser, addToCart } = useUser();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [data, setData] = useState({ users: [], clothes: [], electronics: [] });
  const [searchValue, setSearchValue] = useState("");
  const [category, setCategory] = useState("all");
  const [modalProduct, setModalProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResp, clothesResp, electronicsResp] = await Promise.all([
          fetch("http://localhost:5001/users"),
          fetch("http://localhost:5001/clothes"),
          fetch("http://localhost:5001/electronics"),
        ]);

        const [users, clothes, electronics] = await Promise.all([
          usersResp.json(),
          clothesResp.json(),
          electronicsResp.json(),
        ]);

        setData({ users, clothes, electronics });
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast("Failed to load products", "danger");
      }
    };
    fetchData();
  }, [showToast]);

  const handleCart = (product) => {
    if (!currentUser) {
      showToast("You must be logged in to add to cart", "warning");
      navigate("/login?redirect=store");
      return;
    }
    addToCart(product);
    showToast(`${product.title} added to cart`, "success");
  };

  const filteredClothes =
    searchValue.trim() === ""
      ? data.clothes
      : data.clothes.filter((c) =>
          c.title.toLowerCase().includes(searchValue.toLowerCase())
        );

  const filteredElectronics =
    searchValue.trim() === ""
      ? data.electronics
      : data.electronics.filter((e) =>
          e.title.toLowerCase().includes(searchValue.toLowerCase())
        );

  return (
    <main
      className="container my-4"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e9f1f8, #fefefe)",
        padding: "40px 20px",
        borderRadius: "15px",
      }}
    >
      {/* Filters */}
      <div className="row align-items-center mb-4">
        <div className="col-md-3 mb-2">
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All</option>
            <option value="clothes">Clothes</option>
            <option value="electronics">Electronics</option>
          </select>
        </div>
        <div className="col-md-6 text-center mb-2">
          <h1 className="text-success">{category} Products</h1>
        </div>
        <div className="col-md-3 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search product..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      {/* Products */}
      <div className="row">
        {(category === "all" || category === "clothes") &&
          filteredClothes.map((c, idx) => (
            <div className="col-md-4 mb-4" key={idx}>
              <div
                className="card h-100 shadow-lg"
                style={{
                  borderRadius: "15px",
                  background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 30px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                }}
              >
                <img
                  src={c.image}
                  alt={c.title}
                  className="card-img-top"
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    borderTopLeftRadius: "15px",
                    borderTopRightRadius: "15px",
                  }}
                  onClick={() => setModalProduct(c)}
                />
                <div className="card-body d-flex flex-column justify-content-between">
                  <span className="card-title fw-bold">{c.title}</span>
                  <span className="text-success fw-bold">{c.price}</span>
                  <button
                    className="btn btn-warning mt-2"
                    onClick={() => handleCart(c)}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          ))}

        {(category === "all" || category === "electronics") &&
          filteredElectronics.map((e, idx) => (
            <div className="col-md-4 mb-4" key={idx}>
              <div
                className="card h-100 shadow-lg"
                style={{
                  borderRadius: "15px",
                  background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 30px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                }}
              >
                <img
                  src={e.image}
                  alt={e.title}
                  className="card-img-top"
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    borderTopLeftRadius: "15px",
                    borderTopRightRadius: "15px",
                  }}
                  onClick={() => setModalProduct(e)}
                />
                <div className="card-body d-flex flex-column justify-content-between">
                  <span className="card-title fw-bold">{e.title}</span>
                  <span className="text-success fw-bold">{e.price}</span>
                  <button
                    className="btn btn-warning mt-2"
                    onClick={() => handleCart(e)}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Product Modal */}
      {modalProduct && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setModalProduct(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-content shadow-lg"
              style={{
                borderRadius: "15px",
                background: "linear-gradient(145deg, #f8f9fa, #dee2e6)",
              }}
            >
              <div className="modal-header">
                <h5 className="modal-title">{modalProduct.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalProduct(null)}
                ></button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={modalProduct.image}
                  alt={modalProduct.title}
                  style={{
                    maxHeight: "250px",
                    objectFit: "cover",
                    marginBottom: "15px",
                    borderRadius: "10px",
                  }}
                />
                <p>{modalProduct.descreption}</p>
                <h5 className="text-success">{modalProduct.price}</h5>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-warning"
                  onClick={() => {
                    handleCart(modalProduct);
                    setModalProduct(null);
                  }}
                >
                  Add to Cart
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setModalProduct(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
