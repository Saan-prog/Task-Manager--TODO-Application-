import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


const ProtectedRoutes = ({children}) => {
    const { user, loading } = useContext (AuthContext)
    if(loading) return <div className='Container Center'>Loading...</div>
    return user ? children : <Navigate to="/" replace />
}

//     const token = localStorage.getItem("token");

//     return token ? children : <Navigate to="/" />
 
// }

export default ProtectedRoutes;