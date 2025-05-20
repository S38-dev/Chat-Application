import { Navigate } from "react-router-dom";
export default function Authcheck({islogin,children,setLogin}){
   return islogin?children:<Navigate to="/login" state={{ setLogin }} />
}