import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import API from "../api";

function AdminDashboard({ user, onLogout }) {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showStudents, setShowStudents] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseSearch, setCourseSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [courseForm, setCourseForm] = useState({ title: "", description: "", instructor: "", duration: "" });

  const config = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/courses`);
      setCourses(response.data.courses || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setStudentsLoading(true);
      const response = await axios.get(`${API}/enrollments/students`, config());
      setStudents(Array.isArray(response.data.students) ? response.data.students : []);
    } catch (error) {
      alert(error.response?.data?.message || error.response?.data?.error || "Failed to load registered students");
      setStudents([]);
    } finally {
      setStudentsLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const filteredCourses = useMemo(() => {
    const q = courseSearch.toLowerCase();
    return courses.filter((c) => [c.title, c.description, c.instructor].some((v) => v?.toLowerCase().includes(q)));
  }, [courses, courseSearch]);

  const filteredStudents = useMemo(() => {
    const q = studentSearch.toLowerCase();
    return students.filter((row) => {
      const s = row.student || row;
      const c = row.course || {};
      return [s.name, s.email, c.title].some((v) => v?.toLowerCase().includes(q));
    });
  }, [students, studentSearch]);

  const resetForm = () => {
    setCourseForm({ title: "", description: "", instructor: "", duration: "" });
    setEditingCourse(null);
  };

  const handleChange = (e) => setCourseForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const saveCourse = async (e) => {
    e.preventDefault();
    if (Object.values(courseForm).some((v) => !v.trim())) {
      alert("Please fill all course fields");
      return;
    }

    try {
      setSaving(true);
      const payload = Object.fromEntries(Object.entries(courseForm).map(([k, v]) => [k, v.trim()]));
      const response = editingCourse
        ? await axios.put(`${API}/courses/${editingCourse._id}`, payload, config())
        : await axios.post(`${API}/courses`, payload, config());

      alert(response.data.message || (editingCourse ? "Course updated successfully" : "Course created successfully"));
      resetForm();
      setShowAddForm(false);
      await fetchCourses();
    } catch (error) {
      alert(error.response?.data?.message || error.response?.data?.error || "Course save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title || "",
      description: course.description || "",
      instructor: course.instructor || "",
      duration: course.duration || ""
    });
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (courseId) => {
    if (!courseId || !window.confirm("Delete this course?")) return;
    try {
      await axios.delete(`${API}/courses/${courseId}`, config());
      alert("Course deleted successfully");
      await fetchCourses();
    } catch (error) {
      alert(error.response?.data?.message || error.response?.data?.error || "Course deletion failed");
    }
  };

  const totalEnrollments = students.length;

  if (showStudents) {
    return (
      <div className="app-shell">
        <aside className="sidebar admin-side">
          <div className="side-brand"><div className="brand-mark">SC</div><span>Student<span>Hub</span></span></div>
          <nav className="side-nav"><button className="nav-item active"><span>♟</span> Registered Students</button><button className="nav-item" onClick={() => setShowStudents(false)}><span>▣</span> Course Management</button></nav>
          <div className="side-bottom"><button className="logout-btn" onClick={onLogout}>↪ Logout</button></div>
        </aside>
        <main className="main-content">
          <header className="topbar"><button className="back-link" onClick={() => setShowStudents(false)}>← Admin Dashboard</button><div className="avatar">{(user?.name || "A").charAt(0).toUpperCase()}</div></header>
          <section className="content-inner">
            <div className="page-heading">
              <div><span className="eyebrow">ADMINISTRATION</span><h1>Registered Students</h1><p>Students and the courses they have enrolled in.</p></div>
              <button className="secondary-btn" onClick={fetchStudents} disabled={studentsLoading}>↻ {studentsLoading ? "Refreshing..." : "Refresh"}</button>
            </div>
            <div className="search-box"><span>⌕</span><input value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} placeholder="Search students or courses..." /></div>
            {studentsLoading ? <div className="loading-card"><div className="spinner" /> Loading registered students...</div> :
             filteredStudents.length === 0 ? <div className="empty-card"><div>👥</div><h3>No registered students found</h3><p>Enrollments will appear here after students join a course.</p></div> :
             <div className="student-table-wrap"><table className="student-table"><thead><tr><th>Student</th><th>Email</th><th>Role</th><th>Course</th><th>Enrolled</th></tr></thead><tbody>
               {filteredStudents.map((row, index) => {
                 const s = row.student || row;
                 const c = row.course || {};
                 return <tr key={row._id || index}><td><div className="table-person"><div className="avatar small">{(s.name || "S").charAt(0).toUpperCase()}</div><b>{s.name || "Student"}</b></div></td><td>{s.email || "N/A"}</td><td><span className="role-pill">{s.role || "student"}</span></td><td><b>{c.title || "N/A"}</b></td><td>{row.enrolledAt ? new Date(row.enrolledAt).toLocaleDateString() : "—"}</td></tr>;
               })}
            </tbody></table></div>}
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar admin-side">
        <div className="side-brand"><div className="brand-mark">SC</div><span>Student<span>Hub</span></span></div>
        <div className="admin-label">ADMIN PANEL</div>
        <nav className="side-nav">
          <button className="nav-item active"><span>⌂</span> Dashboard</button>
          <button className="nav-item" onClick={() => setShowStudents(true)}><span>♟</span> Registered Students</button>
          <button className="nav-item" onClick={() => { setEditingCourse(null); resetForm(); setShowAddForm(true); }}><span>＋</span> Add Course</button>
        </nav>
        <div className="side-bottom"><button className="logout-btn" onClick={onLogout}>↪ Logout</button></div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="mobile-title">AdminHub</div>
          <div className="topbar-right"><button className="icon-btn">♧</button><div className="avatar">{(user?.name || "A").charAt(0).toUpperCase()}</div><div className="user-mini"><b>{user?.name || "Admin"}</b><span>Administrator</span></div></div>
        </header>

        <section className="content-inner">
          <div className="welcome-row">
            <div><span className="eyebrow">ADMIN DASHBOARD</span><h1>Overview & management</h1><p>Manage your courses and monitor student enrollments.</p></div>
            <button className="primary-btn" onClick={() => { resetForm(); setShowAddForm(true); }}>＋ Add Course</button>
          </div>

          <div className="stats-grid admin-stats">
            <div className="stat-card"><div className="stat-icon blue">▣</div><div><span>Total Courses</span><strong>{courses.length}</strong><small>Courses in catalog</small></div></div>
            <div className="stat-card"><div className="stat-icon green">♟</div><div><span>Registrations</span><strong>{totalEnrollments}</strong><small>Course enrollments</small></div></div>
            <div className="stat-card"><div className="stat-icon purple">👥</div><div><span>Student Records</span><strong>{new Set(students.map((s) => (s.student || s)._id)).size || 0}</strong><small>Unique students</small></div></div>
          </div>

          {showAddForm && (
            <div className="form-card">
              <div className="form-card-head"><div><span className="eyebrow">{editingCourse ? "UPDATE COURSE" : "NEW COURSE"}</span><h2>{editingCourse ? "Edit course" : "Add a new course"}</h2></div><button className="close-btn" onClick={() => { setShowAddForm(false); resetForm(); }}>×</button></div>
              <form onSubmit={saveCourse} className="course-form-grid">
                <label>Course title<input name="title" value={courseForm.title} onChange={handleChange} placeholder="e.g. Full Stack Web Development" /></label>
                <label>Instructor<input name="instructor" value={courseForm.instructor} onChange={handleChange} placeholder="Instructor name" /></label>
                <label>Duration<input name="duration" value={courseForm.duration} onChange={handleChange} placeholder="e.g. 12 Weeks" /></label>
                <label className="full">Description<textarea name="description" value={courseForm.description} onChange={handleChange} rows="3" placeholder="Describe what students will learn..." /></label>
                <div className="form-actions full"><button type="button" className="secondary-btn" onClick={() => { setShowAddForm(false); resetForm(); }}>Cancel</button><button className="primary-btn" disabled={saving}>{saving ? "Saving..." : editingCourse ? "Update Course" : "Create Course"}</button></div>
              </form>
            </div>
          )}

          <div className="section-title course-management-title">
            <div><span className="eyebrow">CATALOG</span><h2>Manage Courses</h2><p>Edit, update or remove courses from the catalog.</p></div>
            <div className="inline-actions"><div className="mini-search"><span>⌕</span><input value={courseSearch} onChange={(e) => setCourseSearch(e.target.value)} placeholder="Search courses" /></div><button className="secondary-btn" onClick={fetchCourses} disabled={loading}>↻</button></div>
          </div>

          {loading ? <div className="loading-card"><div className="spinner" /> Loading courses...</div> :
           filteredCourses.length === 0 ? <div className="empty-card"><div>📚</div><h3>No courses available</h3><p>Create your first course to populate the catalog.</p></div> :
           <div className="admin-course-list">
             {filteredCourses.map((course, index) => (
               <article className="admin-course-row" key={course._id}>
                 <div className={`mini-cover cover-${index % 4}`}><span>SC</span></div>
                 <div className="admin-course-info"><span className="course-tag">COURSE</span><h3>{course.title}</h3><p>{course.description}</p><div className="course-info"><span>👨‍🏫 {course.instructor}</span><span>◷ {course.duration}</span></div></div>
                 <div className="row-actions"><button className="edit-btn" onClick={() => handleEdit(course)}>✎ Edit</button><button className="delete-btn" onClick={() => handleDelete(course._id)}>⌫ Delete</button></div>
               </article>
             ))}
           </div>}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
