import { useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <footer
      className="text-center py-3"
      style={{
        backgroundColor: isHome ? "transparent" : "rgba(0,0,0,0.7)",
        color: isHome ? "#000" : "#fff",
        width: "100%",
        backdropFilter: isHome ? "none" : "blur(5px)",
      }}
    >
      &copy; {new Date().getFullYear()} Hemzae. All rights reserved.
    </footer>
  );
}
