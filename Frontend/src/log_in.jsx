import { useState } from "react";
import "./index.css";
import bgImage from "./Movie-theater-background-with-red-seats-vector-05.jpg";


function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLogin, setIsLogin] = useState(true);

    const handleLogin = async () => {
        setError("");

        if (!email || !password) {
            setError("Please fill all fields");
            return;
        }

        try {
            const res = await fetch("http://127.0.0.1:8000/api/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.status) {
                localStorage.setItem("token", data.token);
                alert(data.message + " ✅");
            } else {
                setError(data.message);
            }
        } catch {
            setError("Server error");
        }
    };

    const handleRegister = async () => {
        setError("");

        if (!email || !password) {
            setError("Please fill all fields");
            return;
        }

        try {
            const res = await fetch("http://127.0.0.1:8000/api/signup/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.status) {
                alert(data.message + " ✅");
                setIsLogin(true);
                setEmail("");
                setPassword("");
            } else {
                setError(data.message);
            }
        } catch {
            setError("Server error");
        }
    };
    return (
        <div
            className="login-bg"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "100vh"
            }}
        >
            <div className="login-box">

                <h2>{isLogin ? "Login" : "Sign Up"}</h2>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button onClick={isLogin ? handleLogin : handleRegister}>
                    {isLogin ? "Login" : "Sign Up"}
                </button>

                <p style={{ marginTop: "10px" }}>
                    {isLogin ? (
                        <span
                            onClick={() => setIsLogin(false)}
                            style={{ cursor: "pointer", color: "blue" }}
                        >
                            New user? Sign up
                        </span>
                    ) : (
                        <span
                            onClick={() => setIsLogin(true)}
                            style={{ cursor: "pointer", color: "blue" }}
                        >
                            Already user? Login
                        </span>
                    )}
                </p>

            </div>
        </div>  
      );
}

export default Login;