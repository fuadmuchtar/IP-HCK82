import { Navigate, Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout() {
  if (localStorage.getItem("access_token")) {
    return (
      <>
          <Navbar />

          <Outlet />

          {/* <Footer /> */}
      </>
    );
  }

  return <Navigate to="/login" />;
}
