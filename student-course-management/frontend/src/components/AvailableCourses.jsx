import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import API from "../api";
import MobileNav from "./MobileNav";

function AvailableCourses({ user, onBack, onMyCourses, onProfile }) {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/courses`);
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const filteredCourses = useMemo(() => {
    const text = search.toLowerCase().trim();
    if (!text) return courses;
    return courses.filter((course) =>
      [course.title, course.description, course.instructor, course.duration]
        .some((value) => value?.toLowerCase().includes(text))
    );
  }, [courses, search]);

  const handleEnroll = async () => {
    const studentId = user?.id || user?._id;
    const courseId = selectedCourse?._id;

    if (!studentId || !courseId) {
      alert("Student or course information is missing. Please login again.");
      return;
    }

    try {
      setEnrolling(true);
      const response = await axios.post(`${API}/enrollments`, {
        studentId, courseId
      });
      alert(response.data.message || "Course enrolled successfully");
      setSelectedCourse(null);
    } catch (error) {
      alert(error.response?.data?.message || error.response?.data?.error || "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  if (selectedCourse) {
    return (
      <div className="app-shell">
        <aside className="sidebar">
          <div className="side-brand"><div className="brand-mark">SC</div><span>Student<span>Hub</span></span></div>
          <nav className="side-nav">
            <button className="nav-item" onClick={onBack}><span>←</span> Dashboard</button>
            <button className="nav-item active"><span>▣</span> Course Details</button>
          </nav>
        </aside>
        <main className="main-content">
          <header className="topbar"><button className="back-link" onClick={() => setSelectedCourse(null)}>← Back to courses</button></header>
          <section className="content-inner narrow">
            <div className="detail-hero">
              <div className="course-cover large">▣</div>
              <span className="course-tag">COURSE DETAILS</span>
              <h1>{selectedCourse.title}</h1>
              <p>{selectedCourse.description}</p>
              <div className="detail-meta">
                <span>👨‍🏫 {selectedCourse.instructor}</span>
                <span>◷ {selectedCourse.duration}</span>
              </div>
              <button className="primary-btn large-btn" onClick={handleEnroll} disabled={enrolling}>
                {enrolling ? "Enrolling..." : "Enroll in this course →"}
              </button>
            </div>
          </section>
        </main>
        <MobileNav active="available" onHome={onBack} onCourses={() => setSelectedCourse(null)} onMyCourses={onMyCourses} onProfile={onProfile} />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="side-brand"><div className="brand-mark">SC</div><span>Student<span>Hub</span></span></div>
        <nav className="side-nav">
          <button className="nav-item" onClick={onBack}><span>⌂</span> Dashboard</button>
          <button className="nav-item active"><span>▣</span> Available Courses</button>
          <button className="nav-item" onClick={onMyCourses}><span>▤</span> My Courses</button>
          <button className="nav-item" onClick={onProfile}><span>◉</span> My Profile</button>
        </nav>
      </aside>
      <main className="main-content">
        <header className="topbar"><button className="back-link" onClick={onBack}>← Dashboard</button><div className="avatar">{(user?.name || "S").charAt(0).toUpperCase()}</div></header>
        <section className="content-inner">
          <div className="page-heading">
            <div><span className="eyebrow">LEARNING LIBRARY</span><h1>Available Courses</h1><p>Explore courses and choose your next skill.</p></div>
            <button className="secondary-btn" onClick={fetchCourses}>↻ Refresh</button>
          </div>

          <div className="search-box"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by course, instructor or topic..." />{search && <button onClick={() => setSearch("")}>×</button>}</div>

          <div className="result-row"><span>{filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""} available</span>{search && <b>Results for “{search}”</b>}</div>

          {loading ? <div className="loading-card"><div className="spinner" /> Loading courses...</div> :
           filteredCourses.length === 0 ? <div className="empty-card"><div>📚</div><h3>No courses found</h3><p>Try another search term.</p></div> :
           <div className="course-grid">
             {filteredCourses.map((course, index) => (
               <article className="course-card" key={course._id}>
                 <div className={`course-cover cover-${index % 4}`}><span>SC</span><em>COURSE</em></div>
                 <div className="course-body">
                   <span className="course-tag">LEARNING</span>
                   <h2>{course.title}</h2>
                   <p>{course.description}</p>
                   <div className="course-info"><span>👨‍🏫 {course.instructor}</span><span>◷ {course.duration}</span></div>
                   <button className="outline-btn" onClick={() => setSelectedCourse(course)}>View Course <span>→</span></button>
                 </div>
               </article>
             ))}
           </div>
          }
        </section>
      </main>
      <MobileNav active="available" onHome={onBack} onCourses={() => {}} onMyCourses={onMyCourses} onProfile={onProfile} />
    </div>
  );
}

export default AvailableCourses;
