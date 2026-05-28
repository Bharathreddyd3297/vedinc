import { Navigate } from "react-router-dom";

const AdminGuard = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
        return <Navigate to="/login" replace />;
    }


    return children;
};

export default AdminGuard;
