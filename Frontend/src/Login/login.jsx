import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ added
import "../index.css";
import bgImage from "./Movie-theater-background-with-red-seats-vector-05.jpg";

function Login(){

    const navigate = useNavigate(); // ✅ added

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
            const res = await fetch("https://cinima-ticket-backend.onrender.com/api/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.status) {
                localStorage.setItem("token", data.token);
                 localStorage.setItem("userEmail", email);

                navigate("/"); // ✅ redirect only (alert removed)
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
            const res = await fetch("https://cinima-ticket-backend.onrender.com/api/signup/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.status) {
                alert(data.message + " ✅"); // ❗ இதை மட்டும் leave பண்ணியிருக்கேன் (registerக்கு)
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