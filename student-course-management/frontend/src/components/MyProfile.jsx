import { MenuIcon } from "./UIIcons";
import { useState } from "react";
import axios from "axios";
import API from "../api";
import MobileNav from "./MobileNav";

function MyProfile({ user, onBack, onAvailableCourses, onMyCourses }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert("Name and email are required");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API}/auth/profile`,
        { name: name.trim(), email: email.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedUser = response.data.user || { ...user, name: name.trim(), email: email.trim() };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert(response.data.message || "Profile updated successfully");
      setEditing(false);
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || error.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="side-brand"><div className="brand-mark">E</div><span>Eduvera<span></span></span></div>
        <nav className="side-nav">
          <button className="nav-item" onClick={onBack}><span><MenuIcon type="dashboard" /></span> Dashboard</button>
          <button className="nav-item active"><span><MenuIcon type="profile" /></span> My Profile</button>
          <button className="nav-item" onClick={onMyCourses}><span><MenuIcon type="learning" /></span> My Courses</button>
        </nav>
        <div className="side-bottom"><button className="logout-btn" onClick={onBack}>← Back to Dashboard</button></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><button className="back-link" onClick={onBack}>← Dashboard</button><div className="avatar">{(user?.name || "S").charAt(0).toUpperCase()}</div></header>
        <section className="content-inner profile-page">
          <div className="page-heading"><div><span className="eyebrow">ACCOUNT</span><h1>My Profile</h1><p>Manage your account information.</p></div></div>

          <div className="profile-card">
            <div className="profile-cover" />
            <div className="profile-main">
              <div className="profile-avatar">{(name || "S").charAt(0).toUpperCase()}</div>
              <div className="profile-title"><h2>{name || "Student"}</h2><span>Student account</span></div>
              <button className="secondary-btn" onClick={() => setEditing((v) => !v)}>{editing ? "Cancel" : "Edit Profile"}</button>
            </div>

            <form className="profile-form" onSubmit={handleUpdateProfile}>
              <label>Full name<input disabled={!editing} value={name} onChange={(e) => setName(e.target.value)} /></label>
              <label>Email address<input disabled={!editing} type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
              <label>Account role<input disabled value={user?.role || "student"} /></label>
              {editing && <button className="primary-btn" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>}
            </form>
          </div>
        </section>
      </main>
      <MobileNav active="profile" onHome={onBack} onCourses={onAvailableCourses} onMyCourses={onMyCourses} onProfile={() => {}} />
    </div>
  );
}

export default MyProfile;
