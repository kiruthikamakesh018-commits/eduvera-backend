import { useEffect, useState } from "react";
import axios from "axios";
import API from "./api";

import Dashboard from "./components/Dashboard";
import MyCourses from "./components/MyCourses";
import MyProfile from "./components/MyProfile";
import AvailableCourses from "./components/AvailableCourses";
import ForgotPassword from "./components/ForgotPassword";
import AdminDashboard from "./components/AdminDashboard";

import "./style.css";

const getPath = () => window.location.pathname.replace(/\/+$/, "") || "/";

const Icon = ({ name, size = 18, stroke = 1.9 }) => {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  const paths = {
    user: <><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.4 3.1-5.2 7-5.2s6.2 1.8 7 5.2"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></>,
    lock: <><rect x="4" y="10" width="16" height="10" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    eye: <><path d="M2.5 12s3.5-5.5 9.5-5.5 9.5 5.5 9.5 5.5-3.5 5.5-9.5 5.5S2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.5"/></>,
    eyeOff: <><path d="m3 3 18 18"/><path d="M10.6 6.7A10.5 10.5 0 0 1 12 6.5c6 0 9.5 5.5 9.5 5.5a17 17 0 0 1-3.1 3.4"/><path d="M6.2 6.2C3.8 7.8 2.5 12 2.5 12s3.5 5.5 9.5 5.5c1.2 0 2.3-.2 3.3-.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></>,
    arrow: <><path d="M5 12h13"/><path d="m13 6 6 6-6 6"/></>,
    plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
};


function App() {
  const [path, setPath] = useState(getPath());
  const [isLogin, setIsLogin] = useState(getPath() !== "/register");
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // =========================
  // SIMPLE FRONTEND ROUTER
  // =========================

  const navigate = (nextPath) => {
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handlePopState = () => setPath(getPath());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // =========================
  // RESTORE LOGIN
  // =========================

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) return;

    try {
      const parsedUser = JSON.parse(savedUser);
      const normalizedUser = {
        ...parsedUser,
        role: String(parsedUser?.role || "student").toLowerCase(),
      };

      setUser(normalizedUser);
      setLoggedIn(true);

      // Keep the user on the requested page after refresh.
      // If they refresh the landing/auth route while logged in, send them to dashboard.
      const currentPath = getPath();
      if (
        currentPath === "/" ||
        currentPath === "/login" ||
        currentPath === "/register"
      ) {
        navigate(
          normalizedUser.role === "admin"
            ? "/admin/dashboard"
            : "/student/dashboard"
        );
      }
    } catch (error) {
      console.error("Restore login error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================
  // AUTH NAVIGATION
  // =========================

  const goToAuth = (login = true) => {
    setIsLogin(login);
    setShowForgotPassword(false);
    setFormData({ name: "", email: "", password: "" });
    navigate(login ? "/login" : "/register");
  };

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================
  // LOGIN / REGISTER
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      alert("Please enter email and password.");
      return;
    }

    if (!isLogin && !formData.name.trim()) {
      alert("Please enter your full name.");
      return;
    }

    try {
      setSubmitting(true);
      const endpoint = isLogin ? "login" : "register";

      const body = isLogin
        ? {
            email: formData.email.trim(),
            password: formData.password,
          }
        : {
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
          };

      const response = await axios.post(`${API}/auth/${endpoint}`, body);

      if (isLogin) {
        const loggedInUser = response.data.user;

        if (!loggedInUser) {
          alert("Login successful, but user information is missing.");
          return;
        }

        const normalizedUser = {
          ...loggedInUser,
          role: String(loggedInUser.role || "student").toLowerCase(),
        };

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(normalizedUser));

        setUser(normalizedUser);
        setLoggedIn(true);
        setFormData({ name: "", email: "", password: "" });

        navigate(
          normalizedUser.role === "admin"
            ? "/admin/dashboard"
            : "/student/dashboard"
        );
        return;
      }

      alert(response.data.message || "Registration successful!");
      setIsLogin(true);
      setFormData({
        name: "",
        email: formData.email,
        password: "",
      });
      navigate("/login");
    } catch (error) {
      console.error("Authentication Error:", error);
      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setLoggedIn(false);
    setIsLogin(true);
    setShowForgotPassword(false);
    setFormData({ name: "", email: "", password: "" });
    navigate("/");
  };

  // =========================
  // AUTH PAGE
  // =========================

  const authPage = (
    <main className="edu-page auth-only-page">
      <div className="animated-bg bg-one"></div>
      <div className="animated-bg bg-two"></div>
      <div className="animated-bg bg-three"></div>

      <header className="navbar">
        <button className="brand" onClick={() => navigate("/")}>
          <div className="brand-icon">E</div>
          <div>
            <strong>Eduvera</strong>
            <small>Learn Beyond Limits.</small>
          </div>
        </button>

        <div className="nav-actions">
          <button className="nav-login" onClick={() => goToAuth(true)}>
            Login
          </button>
          <button className="nav-register" onClick={() => goToAuth(false)}>
            Register
          </button>
        </div>
      </header>

      <section className="auth-section auth-page-section">
        <div className="auth-card">
          <div className="auth-top">
            <div className="auth-logo">
              <div className="auth-logo-icon">E</div>
              <div>
                <strong>Eduvera</strong>
                <span>Learn Beyond Limits.</span>
              </div>
            </div>
          </div>

          <div className="auth-body">
            <div className="auth-heading">
              <span className="welcome-label">
                {isLogin ? "WELCOME BACK" : "GET STARTED"}
              </span>
              <h2>{isLogin ? "Welcome back!" : "Create your account"}</h2>
              <p>
                {isLogin
                  ? "Sign in and continue your learning journey."
                  : "Register and start exploring Eduvera courses."}
              </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              {!isLogin && (
                <div className="field">
                  <label htmlFor="name">Full Name</label>
                  <div className="input-box">
                    <span className="input-icon" aria-hidden="true"><Icon name="user" size={17} /></span>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="name"
                      spellCheck="false"
                      onKeyDown={(e) => { if (e.key === "Escape") e.currentTarget.blur(); }}
                    />
                  </div>
                </div>
              )}

              <div className="field">
                <label htmlFor="email">Email Address</label>
                <div className="input-box">
                  <span className="input-icon" aria-hidden="true"><Icon name="mail" size={17} /></span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    inputMode="email"
                    spellCheck="false"
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>
                <div className="input-box">
                  <span className="input-icon" aria-hidden="true"><Icon name="lock" size={17} /></span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    spellCheck="false"
                  />
                  <button
                    type="button"
                    className="eye-button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    title={showPassword ? "Hide password" : "Show password"}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    <span className="eye-icon" aria-hidden="true">
                      {showPassword ? <Icon name="eye" size={21} stroke={2.1} /> : <Icon name="eyeOff" size={21} stroke={2.1} />}
                    </span>
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="form-options">
                  <label className="remember">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="forgot"
                    onClick={() => {
                      setShowForgotPassword(true);
                      navigate("/forgot-password");
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button type="submit" className="submit-button" disabled={submitting}>
                <span className="submit-icon" aria-hidden="true">{submitting ? "…" : isLogin ? <Icon name="arrow" size={17} /> : <Icon name="plus" size={17} />}</span>
                {submitting
                  ? "Please wait..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
                {!submitting && <span className="submit-arrow"><Icon name="arrow" size={17} /></span>}
              </button>
            </form>

            <div className="auth-switch">
              <span>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </span>
              <button onClick={() => goToAuth(!isLogin)}>
                {isLogin ? "Create account" : "Sign in"}
              </button>
            </div>

            <div className="secure">
              <span className="secure-icon"><Icon name="lock" size={13} /></span>
              Secure JWT authenticated access
            </div>
          </div>
        </div>
      </section>
    </main>
  );

  // =========================
  // LANDING PAGE
  // =========================

  const LandingPage = () => (
    <main className="edu-page">
      <div className="animated-bg bg-one"></div>
      <div className="animated-bg bg-two"></div>
      <div className="animated-bg bg-three"></div>

      <header className="navbar">
        <button className="brand" onClick={() => navigate("/")}>
          <div className="brand-icon">E</div>
          <div>
            <strong>Eduvera</strong>
            <small>Learn Beyond Limits.</small>
          </div>
        </button>

        <nav className="nav-links">
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => goToAuth(true)}>Courses</button>
          <button onClick={() => goToAuth(false)}>Get Started</button>
        </nav>

        <div className="nav-actions">
          <button className="nav-login" onClick={() => goToAuth(true)}>Login</button>
          <button className="nav-register" onClick={() => goToAuth(false)}>Register</button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <div className="mini-label">✦ SMARTER LEARNING STARTS HERE</div>
            <h1>Learn today.<br /><span>Lead tomorrow.</span></h1>
            <p className="hero-subtitle">
              Explore courses, build valuable skills, track your progress and take your learning journey to the next level with Eduvera.
            </p>
            <div className="typing-line">
              <span>Explore</span><b>•</b><span>Learn</span><b>•</b><span>Grow</span><b>•</b><span>Achieve</span>
            </div>
            <div className="hero-buttons">
              <button className="primary-button" onClick={() => goToAuth(false)}>Get Started <span>→</span></button>
              <button className="secondary-button" onClick={() => goToAuth(true)}>Login to Eduvera</button>
            </div>
            <div className="trust-row">
              <div><strong>100+</strong><span>Courses</span></div>
              <div><strong>10K+</strong><span>Learners</span></div>
              <div><strong>4.8</strong><span>Rating</span></div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-circle"></div>
            <div className="orbit orbit-one"></div>
            <div className="orbit orbit-two"></div>
            <div className="laptop">
              <div className="laptop-screen">
                <div className="screen-top"><span>Eduvera</span><span>Dashboard</span></div>
                <div className="screen-title">Continue Learning</div>
                <div className="progress-card">
                  <div><strong>Java Full Stack</strong><span>82% completed</span></div>
                  <div className="progress"><i></i></div>
                </div>
                <div className="small-cards"><div>UI/UX</div><div>Database</div><div>Python</div></div>
              </div>
              <div className="laptop-base"></div>
            </div>
            <div className="floating-card card-top"><span className="card-icon">✓</span><div><strong>Course Complete</strong><small>Java Module</small></div></div>
            <div className="floating-card card-bottom"><span className="card-icon">↗</span><div><strong>Great Progress!</strong><small>Keep learning</small></div></div>
            <div className="floating-dot dot-one"></div><div className="floating-dot dot-two"></div><div className="floating-dot dot-three"></div>
          </div>
        </div>
      </section>
    </main>
  );

  // =========================
  // ROUTES
  // =========================

  if (!loggedIn) {
    if (showForgotPassword || path === "/forgot-password") {
      return <ForgotPassword onBack={() => { setShowForgotPassword(false); navigate("/login"); }} />;
    }
    if (path === "/login" || path === "/register") return authPage;
    // Eduvera opens on the login page first.
    navigate("/login");
    return null;
  }

  if (String(user?.role || "").toLowerCase() === "admin") {
    if (path === "/admin/dashboard" || path === "/") {
      return <AdminDashboard user={user} onLogout={handleLogout} />;
    }
    // Keep unknown authenticated admin URLs safe.
    navigate("/admin/dashboard");
    return null;
  }

  if (path === "/student/courses") {
    return (
      <MyCourses
        user={user}
        onBack={() => navigate("/student/dashboard")}
        onAvailableCourses={() => navigate("/student/available-courses")}
        onProfile={() => navigate("/student/profile")}
      />
    );
  }

  if (path === "/student/available-courses") {
    return (
      <AvailableCourses
        user={user}
        onBack={() => navigate("/student/dashboard")}
        onMyCourses={() => navigate("/student/courses")}
        onProfile={() => navigate("/student/profile")}
      />
    );
  }

  if (path === "/student/profile") {
    return (
      <MyProfile
        user={user}
        onBack={() => navigate("/student/dashboard")}
        onAvailableCourses={() => navigate("/student/available-courses")}
        onMyCourses={() => navigate("/student/courses")}
      />
    );
  }

  return (
    <Dashboard
      user={user}
      onLogout={handleLogout}
      onCourses={() => navigate("/student/courses")}
      onAvailableCourses={() => navigate("/student/available-courses")}
      onProfile={() => navigate("/student/profile")}
      onSearchCourses={(query) => {
        navigate(`/student/available-courses${query ? `?search=${encodeURIComponent(query)}` : ""}`);
      }}
    />
  );
}

export default App;
