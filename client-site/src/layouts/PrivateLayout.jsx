import { Navigate, Outlet } from "react-router";
import Navbar from "../components/Navbar";

export default function PrivateLayout() {
    if (localStorage.getItem("access_token")) {
        return (
            <>
                <Navbar />
                <Outlet />
            </>
        )
    }

    return <Navigate to="/login" />;
}
