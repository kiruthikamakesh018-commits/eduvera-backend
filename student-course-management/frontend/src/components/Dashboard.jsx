import React from "react";


import { MenuIcon } from "./UIIcons";
function Dashboard({
  user,
  onLogout,
  onCourses,
  onAvailableCourses,
  onProfile,
  onSearchCourses,
}) {
  const firstName = user?.name?.split(" ")[0] || "Student";

  return (
    <div className="dashboard-page">

      {/* BACKGROUND DECORATION */}
      <div className="dashboard-bg bg-a"></div>
      <div className="dashboard-bg bg-b"></div>

      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">

        <div className="dashboard-brand">
          <div className="edu-logo">E</div>

          <div className="brand-text">
            <strong>Eduvera</strong>
            <span>Learn Beyond Limits.</span>
          </div>
        </div>

        <div className="sidebar-label">
          MENU
        </div>

        <nav className="dashboard-nav">

          <button className="dashboard-nav-item active">
            <span className="nav-icon"><MenuIcon type="dashboard" /></span>
            <span>Dashboard</span>
          </button>

          <button
            className="dashboard-nav-item"
            onClick={onAvailableCourses}
          >
            <span className="nav-icon"><MenuIcon type="courses" /></span>
            <span>Available Courses</span>
          </button>

          <button
            className="dashboard-nav-item"
            onClick={onCourses}
          >
            <span className="nav-icon"><MenuIcon type="learning" /></span>
            <span>My Courses</span>
          </button>

          <button
            className="dashboard-nav-item"
            onClick={onProfile}
          >
            <span className="nav-icon"><MenuIcon type="profile" /></span>
            <span>My Profile</span>
          </button>

        </nav>

        <div className="sidebar-spacer"></div>

        {/* LEARNING TIP */}
        <div className="learning-tip">

          <div className="tip-glow"></div>

          <div className="tip-top">
            <span className="tip-star">✦</span>
            <span>Daily reminder</span>
          </div>

          <h4>Keep learning!</h4>

          <p>
            Small progress every day
            creates big results.
          </p>

        </div>

        {/* LOGOUT */}
        <button
          className="dashboard-logout"
          onClick={onLogout}
        >
          <span>↪</span>
          <span>Logout</span>
        </button>

      </aside>

      {/* MAIN */}
      <main className="dashboard-main">

        {/* TOPBAR */}
        <header className="dashboard-topbar">

          <div className="mobile-brand">
            <div className="edu-logo small-logo">
              E
            </div>

            <strong>Eduvera</strong>
          </div>

          <div className="topbar-search">

            <span>⌕</span>

            <input
              type="search"
              placeholder="Search courses..."
              aria-label="Search courses"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const value = e.currentTarget.value.trim();
                  onSearchCourses?.(value);
                }
              }}
            />

            <kbd>⌘ K</kbd>

          </div>

          <div className="topbar-right">

            <button
              className="notification-btn"
              title="Notifications"
            >
              ♧
              <i></i>
            </button>

            <div className="top-divider"></div>

            <button
              className="user-menu"
              onClick={onProfile}
            >
              <div className="user-avatar">
                {firstName.charAt(0).toUpperCase()}
              </div>

              <div className="user-info">
                <strong>
                  {user?.name || "Student"}
                </strong>

                <span>
                  Student
                </span>
              </div>

              <span className="chevron">
                ˅
              </span>
            </button>

          </div>

        </header>

        {/* CONTENT */}
        <section className="dashboard-content">

          {/* WELCOME */}
          <div className="dashboard-welcome">

            <div className="welcome-copy">

              <span className="dashboard-eyebrow">
                STUDENT DASHBOARD
              </span>

              <h1>
                Good day, {firstName}
                <span className="wave">👋</span>
              </h1>

              <p>
                Ready to continue your learning journey?
                Let's make today productive.
              </p>

            </div>

            <div className="welcome-actions">
              <div className="today-card">
                <div className="today-icon"><MenuIcon type="learning" size={17} /></div>
                <div>
                  <span>LEARNING PULSE</span>
                  <strong>Keep your momentum</strong>
                  <small>One course today can move you forward.</small>
                </div>
                <div className="pulse-dot" aria-hidden="true"></div>
              </div>
              <button
                className="explore-button"
                onClick={onAvailableCourses}
              >
                <span>Explore Courses</span>
                <b>→</b>
              </button>
            </div>

          </div>

          {/* STATS */}
          <div className="dashboard-stats">

            <button
              className="dashboard-stat-card"
              onClick={onAvailableCourses}
            >
              <div className="stat-icon-wrap blue-icon">
                <span><MenuIcon type="courses" size={19} /></span>
              </div>

              <div className="stat-details">
                <span>Available Courses</span>
                <strong>Explore</strong>
                <small>
                  Discover new skills
                </small>
              </div>

              <div className="stat-arrow">
                →
              </div>
            </button>

            <button
              className="dashboard-stat-card"
              onClick={onCourses}
            >
              <div className="stat-icon-wrap green-icon">
                <span><MenuIcon type="learning" size={19} /></span>
              </div>

              <div className="stat-details">
                <span>My Courses</span>
                <strong>View</strong>
                <small>
                  Continue your learning
                </small>
              </div>

              <div className="stat-arrow">
                →
              </div>
            </button>

            <button
              className="dashboard-stat-card"
              onClick={onProfile}
            >
              <div className="stat-icon-wrap purple-icon">
                <span><MenuIcon type="profile" size={19} /></span>
              </div>

              <div className="stat-details">
                <span>My Profile</span>
                <strong>Manage</strong>
                <small>
                  Keep your details updated
                </small>
              </div>

              <div className="stat-arrow">
                →
              </div>
            </button>

          </div>

          {/* SECTION TITLE */}
          <div className="dashboard-section-heading">

            <div>
              <span>YOUR SHORTCUTS</span>
              <h2>Quick actions</h2>
              <p>
                Everything you need, right at your fingertips.
              </p>
            </div>

          </div>

          {/* QUICK ACTIONS */}
          <div className="quick-actions">

            <button
              className="quick-card"
              onClick={onAvailableCourses}
            >
              <div className="quick-number">
                01
              </div>

              <div className="quick-icon">
                ⌕
              </div>

              <div className="quick-content">
                <strong>
                  Browse Courses
                </strong>

                <span>
                  Search and enroll in courses
                </span>
              </div>

              <div className="quick-arrow">
                →
              </div>
            </button>

            <button
              className="quick-card"
              onClick={onCourses}
            >
              <div className="quick-number">
                02
              </div>

              <div className="quick-icon">
                🎓
              </div>

              <div className="quick-content">
                <strong>
                  My Learning
                </strong>

                <span>
                  View your enrolled courses
                </span>
              </div>

              <div className="quick-arrow">
                →
              </div>
            </button>

            <button
              className="quick-card"
              onClick={onProfile}
            >
              <div className="quick-number">
                03
              </div>

              <div className="quick-icon">
                ◉
              </div>

              <div className="quick-content">
                <strong>
                  My Profile
                </strong>

                <span>
                  Update your personal details
                </span>
              </div>

              <div className="quick-arrow">
                →
              </div>
            </button>

          </div>

          {/* BOTTOM BANNER */}
          <div className="learning-banner">

            <div className="banner-orb"></div>

            <div className="banner-icon">
              ✦
            </div>

            <div className="banner-content">
              <span>
                READY TO LEARN?
              </span>

              <h3>
                Your next achievement starts here.
              </h3>

              <p>
                Find a course that matches your goals
                and start building new skills today.
              </p>
            </div>

            <button
              onClick={onAvailableCourses}
              className="banner-button"
            >
              Start Exploring
              <span>→</span>
            </button>

          </div>

        </section>

      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="mobile-bottom-nav">

        <button className="mobile-nav active">
          <span>⌂</span>
          <small>Home</small>
        </button>

        <button
          className="mobile-nav"
          onClick={onAvailableCourses}
        >
          <span>▣</span>
          <small>Courses</small>
        </button>

        <button
          className="mobile-nav"
          onClick={onCourses}
        >
          <span>▤</span>
          <small>My Learning</small>
        </button>

        <button
          className="mobile-nav"
          onClick={onProfile}
        >
          <span>◉</span>
          <small>Profile</small>
        </button>

      </nav>

    </div>
  );
}

export default Dashboard;