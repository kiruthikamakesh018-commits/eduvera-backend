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


function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [page, setPage] = useState("home");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setLoggedIn(true);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const goToAuth = (login = true) => {
    setIsLogin(login);
    setShowForgotPassword(false);

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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

      const response = await axios.post(
        `${API}/auth/${endpoint}`,
        body
      );

      if (isLogin) {
        const loggedInUser = response.data.user;

        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify(loggedInUser)
        );

        setUser(loggedInUser);
        setLoggedIn(true);
        setPage("home");

        setFormData({
          name: "",
          email: "",
          password: "",
        });
      } else {
        alert(
          response.data.message ||
            "Registration successful!"
        );

        setIsLogin(true);

        setFormData({
          name: "",
          email: formData.email,
          password: "",
        });
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setLoggedIn(false);
    setPage("home");
    setIsLogin(true);
  };

  if (!loggedIn && showForgotPassword) {
    return (
      <ForgotPassword
        onBack={() => setShowForgotPassword(false)}
      />
    );
  }

  if (loggedIn && user?.role === "admin") {
    return (
      <AdminDashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  if (loggedIn && page === "courses") {
    return (
      <MyCourses
        user={user}
        onBack={() => setPage("home")}
        onAvailableCourses={() => setPage("available")}
        onProfile={() => setPage("profile")}
      />
    );
  }

  if (loggedIn && page === "available") {
    return (
      <AvailableCourses
        user={user}
        onBack={() => setPage("home")}
        onMyCourses={() => setPage("courses")}
        onProfile={() => setPage("profile")}
      />
    );
  }

  if (loggedIn && page === "profile") {
    return (
      <MyProfile
        user={user}
        onBack={() => setPage("home")}
        onAvailableCourses={() => setPage("available")}
        onMyCourses={() => setPage("courses")}
      />
    );
  }

  if (loggedIn) {
    return (
      <Dashboard
        user={user}
        onLogout={handleLogout}
        onCourses={() => setPage("courses")}
        onAvailableCourses={() =>
          setPage("available")
        }
        onProfile={() => setPage("profile")}
      />
    );
  }

  return (
    <main className="edu-page">
      <div className="animated-bg bg-one"></div>
      <div className="animated-bg bg-two"></div>
      <div className="animated-bg bg-three"></div>

      {/* NAVBAR */}

      <header className="navbar">
        <button
          className="brand"
          onClick={() => goToAuth(true)}
        >
          <div className="brand-icon">
            E
          </div>

          <div>
            <strong>Eduvera</strong>
            <small>Learn Beyond Limits.</small>
          </div>
        </button>

        <nav className="nav-links">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Home
          </button>

          <button onClick={() => goToAuth(true)}>
            Courses
          </button>

          <button onClick={() => goToAuth(false)}>
            Get Started
          </button>
        </nav>

        <div className="nav-actions">
          <button
            className="nav-login"
            onClick={() => goToAuth(true)}
          >
            Login
          </button>

          <button
            className="nav-register"
            onClick={() => goToAuth(false)}
          >
            Register
          </button>
        </div>
      </header>

      {/* HERO */}

      <section className="hero">

        <div className="hero-content">

          <div className="hero-text">

            <div className="mini-label">
              ✦ SMARTER LEARNING STARTS HERE
            </div>

            <h1>
              Learn today.
              <br />
              <span>Lead tomorrow.</span>
            </h1>

            <p className="hero-subtitle">
              Explore courses, build valuable skills,
              track your progress and take your learning
              journey to the next level with Eduvera.
            </p>

            <div className="typing-line">
              <span>Explore</span>
              <b>•</b>
              <span>Learn</span>
              <b>•</b>
              <span>Grow</span>
              <b>•</b>
              <span>Achieve</span>
            </div>

            <div className="hero-buttons">

              <button
                className="primary-button"
                onClick={() => goToAuth(false)}
              >
                Get Started
                <span>→</span>
              </button>

              <button
                className="secondary-button"
                onClick={() =>
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                  })
                }
              >
                Login to Eduvera
              </button>

            </div>

            <div className="trust-row">
              <div>
                <strong>100+</strong>
                <span>Courses</span>
              </div>

              <div>
                <strong>10K+</strong>
                <span>Learners</span>
              </div>

              <div>
                <strong>4.8</strong>
                <span>Rating</span>
              </div>
            </div>

          </div>

          {/* HERO VISUAL */}

          <div className="hero-visual">

            <div className="visual-circle"></div>

            <div className="orbit orbit-one"></div>
            <div className="orbit orbit-two"></div>

            <div className="laptop">
              <div className="laptop-screen">

                <div className="screen-top">
                  <span>Eduvera</span>
                  <span>Dashboard</span>
                </div>

                <div className="screen-title">
                  Continue Learning
                </div>

                <div className="progress-card">
                  <div>
                    <strong>Java Full Stack</strong>
                    <span>82% completed</span>
                  </div>

                  <div className="progress">
                    <i></i>
                  </div>
                </div>

                <div className="small-cards">
                  <div>UI/UX</div>
                  <div>Database</div>
                  <div>Python</div>
                </div>

              </div>

              <div className="laptop-base"></div>
            </div>

            <div className="floating-card card-top">
              <span className="card-icon">✓</span>
              <div>
                <strong>Course Complete</strong>
                <small>Java Module</small>
              </div>
            </div>

            <div className="floating-card card-bottom">
              <span className="card-icon">↗</span>
              <div>
                <strong>Great Progress!</strong>
                <small>Keep learning</small>
              </div>
            </div>

            <div className="floating-dot dot-one"></div>
            <div className="floating-dot dot-two"></div>
            <div className="floating-dot dot-three"></div>

          </div>

        </div>

      </section>

      {/* LOGIN */}

      <section className="auth-section">

        <div className="auth-card">

          <div className="auth-top">

            <div className="auth-logo">
              <div className="auth-logo-icon">
                E
              </div>

              <div>
                <strong>Eduvera</strong>
                <span>Learn Beyond Limits.</span>
              </div>
            </div>

          </div>

          <div className="auth-body">

            <div className="auth-heading">

              <span className="welcome-label">
                {isLogin
                  ? "WELCOME BACK"
                  : "GET STARTED"}
              </span>

              <h2>
                {isLogin
                  ? "Welcome back!"
                  : "Create your account"}
              </h2>

              <p>
                {isLogin
                  ? "Sign in and continue your learning journey."
                  : "Register and start exploring Eduvera courses."}
              </p>

            </div>

            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >

              {!isLogin && (
                <div className="field">
                  <label>Full Name</label>

                  <div className="input-box">
                    <span>◯</span>

                    <input
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              <div className="field">
                <label>Email Address</label>

                <div className="input-box">
                  <span>✉</span>

                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="field">
                <label>Password</label>

                <div className="input-box">
                  <span>⌑</span>

                  <input
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    className="eye-button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    title={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.2 12s3.5-6 9.8-6 9.8 6 9.8 6-3.5 6-9.8 6-9.8-6-9.8-6Z"/><circle cx="12" cy="12" r="2.7"/><path d="m4 4 16 16"/></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.2 12s3.5-6 9.8-6 9.8 6 9.8 6-3.5 6-9.8 6-9.8-6-9.8-6Z"/><circle cx="12" cy="12" r="2.7"/></svg>
                    )}
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
                    onClick={() =>
                      setShowForgotPassword(true)
                    }
                  >
                    Forgot password?
                  </button>

                </div>
              )}

              <button
                type="submit"
                className="submit-button"
                disabled={submitting}
              >
                {submitting
                  ? "Please wait..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}

                {!submitting && <span>→</span>}
              </button>

            </form>

            <div className="auth-switch">

              <span>
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </span>

              <button
                onClick={() => {
                  setIsLogin(
                    (value) => !value
                  );

                  setFormData({
                    name: "",
                    email: "",
                    password: "",
                  });
                }}
              >
                {isLogin
                  ? "Create account"
                  : "Sign in"}
              </button>

            </div>

            <div className="secure">
              <span>🔒</span>
              Secure JWT authenticated access
            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default App;