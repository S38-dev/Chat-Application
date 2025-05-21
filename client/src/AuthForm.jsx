import Login from "./Login"
import { Link } from "react-router-dom";
export default function AuthForm({setLogin}){
    return (
        <>
            <Login setLogin={setLogin}/>
            <Link to="/register" style={{ color: 'blue' }}>
                Register
            </Link>
        </>
    )
}