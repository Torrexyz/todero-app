import { useLocation, Link, Navigate } from "react-router";

import { CLOCK_COMPONENTS, LINK_ELEMENTS } from "./ClockToolElements";
import styles from "./ClockPage.module.css";

//====================//

export default function ClockPage() {
  const location = useLocation();
  const mode = new URLSearchParams(location.search).get("mode");

  if (mode && !CLOCK_COMPONENTS[mode])
    return <Navigate to={location.pathname} replace />;

  return (
    <>
      <div className={styles.clockPage}>
        {location.search.length == 0
          ? Object.entries(LINK_ELEMENTS).map(([key, value]) => (
              <Link
                key={key}
                to={{ pathname: "/dashboard/clock", search: "?mode=" + key }}
              >
                {value}
              </Link>
            ))
          : CLOCK_COMPONENTS[mode] || "redirecting.."}
      </div>
    </>
  );
}
