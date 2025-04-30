import { Navigate, Outlet } from "react-router";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  if (localStorage.getItem("access_token")) {
    return (
      <>
          <Navbar />

          <Outlet />
      </>
    );
  }

  return <Navigate to="/login" />;
}
