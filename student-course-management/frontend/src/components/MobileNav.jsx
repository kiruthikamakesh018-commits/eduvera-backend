import { MenuIcon } from "./UIIcons";
import React from "react";

export default function MobileNav({ active = "home", onHome, onCourses, onMyCourses, onProfile }) {
  return (
    <nav className="mobile-app-nav" aria-label="Mobile navigation">
      <button className={active === "home" ? "active" : ""} onClick={onHome}><span><MenuIcon type="dashboard" /></span><small>Home</small></button>
      <button className={active === "available" ? "active" : ""} onClick={onCourses}><span><MenuIcon type="courses" /></span><small>Courses</small></button>
      <button className={active === "my-courses" ? "active" : ""} onClick={onMyCourses}><span><MenuIcon type="learning" /></span><small>My Courses</small></button>
      <button className={active === "profile" ? "active" : ""} onClick={onProfile}><span><MenuIcon type="profile" /></span><small>Profile</small></button>
    </nav>
  );
}
