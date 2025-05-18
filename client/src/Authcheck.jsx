import { Navigate } from "react-router-dom";
function Authcheck({islogin,children}){
   return islogin?children:<Navigate to="/login"/> 
}