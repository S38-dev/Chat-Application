import { Navigate, Route, Routes } from "react-router-dom";
import AuthForm from "./AuthForm";
export default function Authcheck({islogin,children,setLogin}){
  
   return islogin?children: <Navigate to="/login"  />;
}