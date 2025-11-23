import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export default function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState("guest");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // On app load, check localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("user"));
    if (saved) {
      setCurrentUser(saved);
      setRole(saved.role);
      setCart(saved.cart || []);
    }
    setLoading(false);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify({ ...currentUser, cart }));
    }
  }, [currentUser, cart]);

  const login = async (username, password) => {
    const res = await fetch("http://localhost:5001/users");
    const users = await res.json();
    const found = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!found) return false;

    // Sync cart from backend
    const userRes = await fetch(`http://localhost:5001/users/${found.id}`);
    const freshUser = await userRes.json();

    setCurrentUser(freshUser);
    setRole(freshUser.role || "user");
    setCart(freshUser.cart || []);

    return true;
  };

  const signup = async (user) => {
    const newUser = { ...user, role: "user", cart: [] };
    await fetch("http://localhost:5001/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setRole("guest");
    setCart([]);
    localStorage.removeItem("user");
  };

  const addToCart = async (product) => {
    if (role === "guest") return false;

    setCart((prev) => {
      const existing = prev.find((item) => item.title === product.title);
      let newCart;
      if (existing) {
        newCart = prev.map((item) =>
          item.title === product.title
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        newCart = [...prev, { ...product, quantity: 1 }];
      }

      // Persist to backend
      if (currentUser?.id) {
        fetch(`http://localhost:5001/users/${currentUser.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart: newCart }),
        });
      }

      return newCart;
    });

    return true;
  };

  const removeFromCart = async (title) => {
    const newCart = cart.filter((item) => item.title !== title);
    setCart(newCart);

    if (currentUser?.id) {
      await fetch(`http://localhost:5001/users/${currentUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: newCart }),
      });
    }
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        role,
        cart,
        loading,
        login,
        signup,
        logout,
        addToCart,
        removeFromCart,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
