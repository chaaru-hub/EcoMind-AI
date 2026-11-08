import { useEffect, useRef, useState } from "react";
import { useLocation, useOutlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const LEAVE_MS = 170;

// Keeps the old page on screen for a moment so it can fade out,
// then mounts the new page, which animates in (see .route in theme.css).
function useRouteTransition() {
  const location = useLocation();
  const outlet = useOutlet();
  const [shown, setShown] = useState(() => ({ key: location.pathname, outlet }));
  const latest = useRef(null);
  const leaving = shown.key !== location.pathname;

  useEffect(() => {
    latest.current = { key: location.pathname, outlet };
  });

  useEffect(() => {
    if (!leaving) return undefined;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const timer = setTimeout(() => {
      setShown(latest.current);
      window.scrollTo({ top: 0 });
    }, reduce ? 0 : LEAVE_MS);
    return () => clearTimeout(timer);
  }, [leaving, location.pathname]);

  return leaving
    ? { key: shown.key, element: shown.outlet, leaving: true }
    : { key: location.pathname, element: outlet, leaving: false };
}

function MainLayout() {
  const page = useRouteTransition();

  return (
    <div className="shell">
      <Sidebar />

      <main className="workspace">
        <Topbar />
        <div key={page.key} className={`route ${page.leaving ? "is-leaving" : ""}`}>
          {page.element}
        </div>
      </main>
    </div>
  );
}

export default MainLayout;
