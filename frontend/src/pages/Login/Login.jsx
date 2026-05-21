import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { login as loginApi } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const justRegistered = location.state?.registered;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginApi(username, password);
      login(res.data.token);
      navigate("/");
    } catch {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <h1>HMS</h1>
          <p>Hospital Management System</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Sign in to your account</h2>

          {justRegistered && (
            <p className="login-success">Account created! Please sign in.</p>
          )}
          {error && <p className="login-error">{error}</p>}

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="auth-switch-text">
            Don't have an account?{" "}
            <Link to="/register" className="auth-switch-link">Create account</Link>
          </p>
        </form>

        <div className="login-footer">
          <p>Default credentials</p>
          <p>Admin: <strong>admin</strong> / <strong>admin123</strong></p>
          <p>Receptionist: <strong>receptionist</strong> / <strong>receptionist123</strong></p>
        </div>
      </div>
    </div>
  );
}
