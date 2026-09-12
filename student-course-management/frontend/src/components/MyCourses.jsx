import { MenuIcon } from "./UIIcons";
import { useEffect, useState } from "react";
import axios from "axios";
import API from "../api";
import MobileNav from "./MobileNav";

function MyCourses({ user, onBack, onAvailableCourses, onProfile }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentId = user?.id || user?._id;

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        if (!studentId) {
          alert("Student information not found. Please login again.");
          return;
        }
        const response = await axios.get(
          `${API}/enrollments/student/${studentId}`
        );
        setCourses(
          (response.data.enrollments || [])
            .map((enrollment) => enrollment.course)
            .filter(Boolean)
        );
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Failed to load your courses");
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, [studentId]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="side-brand"><div className="brand-mark">E</div><span>Eduvera<span></span></span></div>
        <nav className="side-nav">
          <button className="nav-item" onClick={onBack}><span><MenuIcon type="dashboard" /></span> Dashboard</button>
          <button className="nav-item active"><span><MenuIcon type="learning" /></span> My Courses</button>
          <button className="nav-item" onClick={onProfile}><span><MenuIcon type="profile" /></span> My Profile</button>
          <button className="nav-item"><span>✓</span> Completed</button>
        </nav>
        <div className="side-bottom"><button className="logout-btn" onClick={onBack}>← Back to Dashboard</button></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><button className="back-link" onClick={onBack}>← Dashboard</button><div className="avatar">{(user?.name || "S").charAt(0).toUpperCase()}</div></header>
        <section className="content-inner">
          <div className="page-heading"><div><span className="eyebrow">YOUR LEARNING</span><h1>My Courses</h1><p>Everything you've enrolled in, all in one place.</p></div></div>

          {loading ? <div className="loading-card"><div className="spinner" /> Loading your courses...</div> :
           courses.length === 0 ? <div className="empty-card"><div>🎓</div><h3>No enrolled courses yet</h3><p>Explore available courses and start learning.</p><button className="primary-btn" onClick={onBack}>Back to Dashboard</button></div> :
           <div className="my-course-grid">
             {courses.map((course, index) => (
               <article className="my-course-card" key={course._id}>
                 <div className={`mini-cover cover-${index % 4}`}><span>{String(index + 1).padStart(2, "0")}</span></div>
                 <div className="my-course-content">
                   <div className="status-pill">● ENROLLED</div>
                   <h2>{course.title}</h2>
                   <p>{course.description}</p>
                   <div className="course-info"><span>👨‍🏫 {course.instructor}</span><span>◷ {course.duration}</span></div>
                   <div className="progress-label"><span>Course status</span><b>Enrolled</b></div>
                   <div className="progress-track"><div className="progress-value" /></div>
                 </div>
               </article>
             ))}
           </div>
          }
        </section>
      </main>
      <MobileNav active="my-courses" onHome={onBack} onCourses={onAvailableCourses} onMyCourses={() => {}} onProfile={onProfile} />
    </div>
  );
}

export default MyCourses;
