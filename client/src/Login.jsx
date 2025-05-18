const { useEffect } = require("react");

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    async function loginSubmit(e) {
        e.preventDefault();

        const response = await axios.post("/login", {
            username,
            password,
        }, {
            withCredentials: true,
        });
    }






    return (
        <form className="LoginForm" onSubmit={(e) => { loginSubmit }}>
            <input type="text" id="username" name="username" placeholder="username" onChange={(e) => { setUsername(e.target.value) }} />
            <input type="password" id="password" name="password" placeholder="password" onChnage={(e) => { setPassword(e.target.value) }} />
            <input type="submit" id="submit" value="login" />
        </form>
    )
}