import { NavLink } from "react-router";

import { LuClipboardCheck, LuSettings } from "react-icons/lu";
import { FaRegClock, FaRegStickyNote } from "react-icons/fa";
import { HiOutlineHome } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";

import styles from "./DashboardNavbar.module.css";

//====================//

const NAVLINK_ELEMENTS = {
  todo: (
    <>
      <LuClipboardCheck /> &nbsp; ToDo
    </>
  ),
  notes: (
    <>
      <FaRegStickyNote /> &nbsp; Notas
    </>
  ),
  clock: (
    <>
      <FaRegClock /> &nbsp; Reloj
    </>
  ),
  profile: (
    <>
      <CgProfile /> &nbsp; Perfil
    </>
  ),
  settings: (
    <>
      <LuSettings /> &nbsp; Ajustes
    </>
  ),
};

//====================//

export default function DashboardNavbar() {
  return (
    <>
      <nav className={styles.dashboardNavbar}>
        {Object.entries(NAVLINK_ELEMENTS).map(([key, value]) => (
          <NavLink
            key={key}
            to={"/dashboard/" + key}
            className={({ isActive }) => (isActive ? styles.activeTab : "")}
          >
            {value}
          </NavLink>
        ))}
        <NavLink to={"/lobby"}>
          <HiOutlineHome /> &nbsp; Lobby
        </NavLink>
      </nav>
    </>
  );
}
