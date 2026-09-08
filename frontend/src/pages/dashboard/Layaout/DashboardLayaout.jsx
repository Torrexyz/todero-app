import { Outlet } from "react-router";

import DashboardNavbar from "@components/dashboard/Layaout/Navbar/DashboardNavbar";

import styles from "./DashboardLayaout.module.css";

//====================//

export default function DashboardLayaout() {
  return (
    <>
      <div className={styles.dashboardLayaout}>
        <DashboardNavbar />
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}
