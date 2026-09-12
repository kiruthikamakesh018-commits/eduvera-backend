import React from "react";

export function MenuIcon({ type, size = 18 }) {
  const icons = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    courses: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22z"/><path d="M4 5.5v14A2.5 2.5 0 0 1 6.5 17H20"/><path d="M8 7h7M8 10h9"/></>,
    learning: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 5.5v15"/><path d="m10 8 5 2.8-5 2.7z"/></>,
    profile: <><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.4 3.1-5.2 7-5.2s6.2 1.8 7 5.2"/></>,
    students: <><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3.5 20c.6-3.3 2.5-5 5.5-5s4.9 1.7 5.5 5M14.5 15.5c2.8-.3 5.1 1.1 5.8 4.5"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[type] || icons.dashboard}</svg>;
}

export function CourseLogo({ title = "" }) {
  const t = title.toLowerCase();
  let type = "code";
  if (t.includes("data") || t.includes("analytics") || t.includes("sql") || t.includes("database")) type = "data";
  else if (t.includes("web") || t.includes("html") || t.includes("css") || t.includes("javascript") || t.includes("react")) type = "web";
  else if (t.includes("design") || t.includes("ui") || t.includes("ux") || t.includes("figma")) type = "design";
  else if (t.includes("marketing") || t.includes("digital") || t.includes("seo")) type = "marketing";
  else if (t.includes("python")) type = "python";
  else if (t.includes("java")) type = "java";
  else if (t.includes("ai") || t.includes("machine") || t.includes("ml") || t.includes("artificial")) type = "ai";

  const paths = {
    code: <><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/></>,
    data: <><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></>,
    web: <><circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c2 2.2 3 4.9 3 8s-1 5.8-3 8c-2-2.2-3-4.9-3-8s1-5.8 3-8z"/></>,
    design: <><path d="m4 17 10-10 4 4L8 21H4z"/><path d="m13 8 3 3M17 5l2 2M7 17h4"/></>,
    marketing: <><path d="M4 13h3l9 5V6l-9 5H4z"/><path d="M7 13v5M19 10a3 3 0 0 1 0 4"/></>,
    python: <><path d="M12 3c-4 0-5 1.8-5 4v3h7v2H7c-3 0-4 1.7-4 4s1.5 5 5 5h3v-3h-4v-2h7c3 0 4-1.7 4-4V8c0-3-2.5-5-6-5z"/><circle cx="9" cy="6.5" r=".7" fill="currentColor" stroke="none"/><circle cx="15" cy="17.5" r=".7" fill="currentColor" stroke="none"/></>,
    java: <><path d="M8 18h8M7 21h10M9 15c-2.5 1.5 6 2 4-1M12 3c3 3-2 4 1 6 2 1.4 1 3-1 4"/><path d="M16 9c3 1 2 4 0 5"/></>,
    ai: <><rect x="6" y="6" width="12" height="12" rx="3"/><path d="M9 12h6M12 9v6M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/></>
  };
  return <div className={`course-logo course-logo-${type}`} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[type]}</svg></div>;
}
