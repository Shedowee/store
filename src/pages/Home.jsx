import { Link } from "react-router-dom";
import Footer from "../components/Footer"; // assuming you have a Footer component

export default function Home() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        backgroundImage: "url(/landscape.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Hero content */}
      <div
        style={{
          flex: 1, // takes all available space
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center",
          color: "white",
          padding: "0 20px",
        }}
      >
        <h1 className="display-3 fw-bold">Infinity Styles</h1>
        <p className="lead">Modern fashion and electronics for everyone.</p>
        <Link to="/store" className="btn btn-success btn-lg mt-3">
          Visit Store
        </Link>
      </div>

      {/* Transparent footer overlay */}
      <Footer
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          background: "transparent",
        }}
      />
    </div>
  );
}
