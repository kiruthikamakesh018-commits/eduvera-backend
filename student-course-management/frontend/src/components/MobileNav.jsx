import React from "react";

export default function MobileNav({ active = "home", onHome, onCourses, onMyCourses, onProfile }) {
  return (
    <nav className="mobile-app-nav" aria-label="Mobile navigation">
      <button className={active === "home" ? "active" : ""} onClick={onHome}><span>⌂</span><small>Home</small></button>
      <button className={active === "available" ? "active" : ""} onClick={onCourses}><span>▣</span><small>Courses</small></button>
      <button className={active === "my-courses" ? "active" : ""} onClick={onMyCourses}><span>▤</span><small>My Courses</small></button>
      <button className={active === "profile" ? "active" : ""} onClick={onProfile}><span>◉</span><small>Profile</small></button>
    </nav>
  );
}
