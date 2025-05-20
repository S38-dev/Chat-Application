import { useState } from "react";
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation();
  const setLogin = location.state?.setLogin;

  async function loginSubmit(e) {
    e.preventDefault();

    try {
      const response = await axios.post(
        "/login",
        { username, password },
        { withCredentials: true }
      );

      console.log("Login success:", response.data);
      if (setLogin) setLogin(true); 
    } catch (err) {
      console.log("Login error:", err.message);
    }
  }

  return (
    <form className="LoginForm" onSubmit={loginSubmit}>
      <input
        type="text"
        id="username"
        name="username"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        id="password"
        name="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <input type="submit" id="submit" value="login" />
    </form>
  );
}

export default Login;
