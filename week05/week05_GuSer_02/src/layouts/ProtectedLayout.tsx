import { Navigate, Outlet } from "react-router-dom";
import {useAuth} from "../context/AuthContext";


const ProtecteLayout = () => {
  const {accessToken} = useAuth();

  if(!accessToken){
    return <Navigate to={"/login"}replace />;
  }

  return <Outlet />;
};

export default ProtecteLayout;