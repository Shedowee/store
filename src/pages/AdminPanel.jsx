import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const { role } = useUser();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [clothes, setClothes] = useState([]);
  const [electronics, setElectronics] = useState([]);

  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    image: "",
    descreption: "",
    category: "clothes",
  });

  const [editProduct, setEditProduct] = useState(null);

  // --- FETCH DATA ---
  const fetchData = async () => {
    try {
      const [usersResp, clothesResp, electronicsResp] = await Promise.all([
        fetch("http://localhost:5001/users"),
        fetch("http://localhost:5001/clothes"),
        fetch("http://localhost:5001/electronics"),
      ]);

      setUsers(await usersResp.json());
      setClothes(await clothesResp.json());
      setElectronics(await electronicsResp.json());
    } catch {
      showToast("Failed to fetch admin data", "danger");
    }
  };

  useEffect(() => {
    if (role !== "admin") {
      const timer = setTimeout(() => navigate("/login"), 2000);
      return () => clearTimeout(timer);
    } else {
      fetchData();
    }
  }, [role, navigate]);

  if (role !== "admin") {
    return (
      <div className="container text-center mt-5">
        <h2 className="text-danger">Access Denied</h2>
        <p>You must be an admin to access this page. Redirecting to login...</p>
      </div>
    );
  }

  // --- USER ACTIONS ---
  const handleDeleteUser = async (id) => {
    try {
      const res = await fetch(`http://localhost:5001/users/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      showToast("User deleted successfully", "success");
      fetchData();
    } catch {
      showToast("Failed to delete user", "danger");
    }
  };

  // --- PRODUCT ACTIONS ---
  const handleDeleteProduct = async (category, id) => {
    try {
      const res = await fetch(`http://localhost:5001/${category}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      showToast("Product deleted successfully", "success");
      fetchData();
    } catch {
      showToast("Failed to delete product", "danger");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const category = newProduct.category;
    const categoryArray = category === "clothes" ? clothes : electronics;

    const productToAdd = {
      ...newProduct,
      id: (categoryArray.length + 1).toString(),
    };

    try {
      const res = await fetch(`http://localhost:5001/${category}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productToAdd),
      });
      if (!res.ok) throw new Error();

      showToast("Product added successfully", "success");
      setNewProduct({
        title: "",
        price: "",
        image: "",
        descreption: "",
        category: "clothes",
      });

      fetchData();
    } catch {
      showToast("Failed to add product", "danger");
    }
  };

  const handleUpdateProduct = async () => {
    const category = editProduct.category;
    try {
      const res = await fetch(
        `http://localhost:5001/${category}/${editProduct.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editProduct),
        }
      );
      if (!res.ok) throw new Error();

      showToast("Product updated successfully", "success");
      setEditProduct(null);
      fetchData();
    } catch {
      showToast("Failed to update product", "danger");
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-warning mb-4">Admin Panel</h2>

      {/* USERS */}
      <div className="mb-5">
        <h4 className="text-light bg-dark p-2 rounded">Users</h4>
        <table className="table table-striped table-dark">
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.role}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteUser(u.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PRODUCTS */}
      <div className="mb-5">
        <h4 className="text-light bg-dark p-2 rounded">Products</h4>
        <div className="row mb-3">
          {/* CLOTHES */}
          <div className="col-md-6 mb-3">
            <h5 className="text-warning">Clothes</h5>
            <ul className="list-group">
              {clothes.map((c) => (
                <li
                  key={c.id}
                  className="list-group-item d-flex justify-content-between align-items-center bg-secondary text-light mb-1 rounded"
                >
                  <div>
                    <strong>{c.title}</strong> - {c.price}
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => setEditProduct(c)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteProduct("clothes", c.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* ELECTRONICS */}
          <div className="col-md-6 mb-3">
            <h5 className="text-warning">Electronics</h5>
            <ul className="list-group">
              {electronics.map((e) => (
                <li
                  key={e.id}
                  className="list-group-item d-flex justify-content-between align-items-center bg-secondary text-light mb-1 rounded"
                >
                  <div>
                    <strong>{e.title}</strong> - {e.price}
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => setEditProduct(e)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteProduct("electronics", e.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ADD / EDIT FORM */}
        <div className="bg-dark p-3 rounded">
          <h5 className="text-warning">
            {editProduct ? "Edit Product" : "Add Product"}
          </h5>
          <form
            onSubmit={
              editProduct ? (e) => e.preventDefault() : handleAddProduct
            }
            className="row g-2"
          >
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Title"
                value={editProduct ? editProduct.title : newProduct.title}
                onChange={(e) =>
                  editProduct
                    ? setEditProduct({ ...editProduct, title: e.target.value })
                    : setNewProduct({ ...newProduct, title: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Price"
                value={editProduct ? editProduct.price : newProduct.price}
                onChange={(e) =>
                  editProduct
                    ? setEditProduct({ ...editProduct, price: e.target.value })
                    : setNewProduct({ ...newProduct, price: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Image URL"
                value={editProduct ? editProduct.image : newProduct.image}
                onChange={(e) =>
                  editProduct
                    ? setEditProduct({ ...editProduct, image: e.target.value })
                    : setNewProduct({ ...newProduct, image: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-6">
              <select
                className="form-select"
                value={editProduct ? editProduct.category : newProduct.category}
                onChange={(e) =>
                  editProduct
                    ? setEditProduct({
                        ...editProduct,
                        category: e.target.value,
                      })
                    : setNewProduct({ ...newProduct, category: e.target.value })
                }
              >
                <option value="clothes">Clothes</option>
                <option value="electronics">Electronics</option>
              </select>
            </div>
            <div className="col-12">
              <textarea
                className="form-control"
                placeholder="Description"
                value={
                  editProduct ? editProduct.descreption : newProduct.descreption
                }
                onChange={(e) =>
                  editProduct
                    ? setEditProduct({
                        ...editProduct,
                        descreption: e.target.value,
                      })
                    : setNewProduct({
                        ...newProduct,
                        descreption: e.target.value,
                      })
                }
                required
              />
            </div>
            <div className="col-12 mt-2 d-flex gap-2">
              {editProduct ? (
                <>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleUpdateProduct}
                  >
                    Update Product
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditProduct(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button type="submit" className="btn btn-warning">
                  Add Product
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
