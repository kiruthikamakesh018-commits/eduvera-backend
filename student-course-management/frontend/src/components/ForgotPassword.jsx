import { useState } from "react";

function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="auth-page single-auth">
      <div className="auth-form-panel">
        <div className="auth-form-wrap">
          <div className="mobile-brand">
            <div className="brand-mark small">SC</div>
            <span className="brand-name">Eduvera<span></span></span>
          </div>
          <button className="back-link auth-back" onClick={onBack}>← Back to Login</button>
          <div className="auth-heading">
            <span className="eyebrow">ACCOUNT RECOVERY</span>
            <h2>Forgot your password?</h2>
            <p>Enter your registered email to continue.</p>
          </div>

          {submitted ? (
            <div className="success-box">
              <div className="success-icon">✓</div>
              <h3>Request received</h3>
              <p>If an account exists with this email, password reset instructions will be sent.</p>
              <button className="primary-btn" onClick={onBack}>Back to Login</button>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <label>Email address<div className="input-wrap"><span>✉</span><input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} /></div></label>
              <button className="primary-btn auth-submit">Send Reset Link →</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
