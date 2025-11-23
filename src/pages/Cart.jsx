import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

export default function Cart() {
  const { currentUser, cart, removeFromCart, loading } = useUser();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [userCart, setUserCart] = useState([]);

  useEffect(() => {
    if (!loading && (!currentUser || currentUser.role === "guest")) {
      navigate("/login?redirect=cart");
      return;
    }
    setUserCart(cart || []);
  }, [currentUser, cart, loading, navigate]);

  if (loading) return <p className="text-center my-5">Loading...</p>;

  if (!userCart || userCart.length === 0) {
    return (
      <div className="container my-5 text-center">
        <h2 className="text-success fw-bold mb-4">Your Cart is Empty</h2>
        <p>Add products from the store to see them here.</p>
      </div>
    );
  }

  const handleRemove = (title) => {
    removeFromCart(title);
    showToast(`Removed "${title}" from cart`, "warning");
  };

  return (
    <div className="container my-5">
      <h2 className="text-success fw-bold mb-4">Your Shopping Cart</h2>
      <div className="row g-4">
        {userCart.map((item) => (
          <div className="col-md-4" key={item.title}>
            <div className="card h-100 shadow-sm border-0">
              <img
                src={item.image}
                alt={item.title}
                className="card-img-top"
                style={{ height: "250px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title text-success fw-bold">
                  {item.title}
                </h5>
                <p className="card-text text-dark fw-semibold">{item.price}</p>
                <div className="d-flex justify-content-between mt-2">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleRemove(item.title)}
                  >
                    Remove
                  </button>
                  <span className="badge bg-success align-self-center">
                    Qty: {item.quantity || 1}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
