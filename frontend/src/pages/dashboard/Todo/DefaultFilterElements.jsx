import { MdCalendarMonth, MdFormatListBulleted } from "react-icons/md";
import { FaRegCalendarTimes, FaRegCalendarCheck } from "react-icons/fa";
import { BiCalendarWeek } from "react-icons/bi";
import { PiSunHorizon } from "react-icons/pi";
import { GoTasklist } from "react-icons/go";
import { FiTarget } from "react-icons/fi";

//====================//

export const DEFAULT_FILTER_ELEMENTS = {
  today: (
    <>
      <FiTarget /> &nbsp; Hoy
    </>
  ),
  tomorrow: (
    <>
      <PiSunHorizon /> &nbsp; Mañana
    </>
  ),
  week: (
    <>
      <BiCalendarWeek /> &nbsp; Esta semana
    </>
  ),
  month: (
    <>
      <MdCalendarMonth /> &nbsp; Este mes
    </>
  ),
  activities: (
    <>
      <GoTasklist /> &nbsp; Actividades
    </>
  ),
  all: (
    <>
      <MdFormatListBulleted /> &nbsp; Todos
    </>
  ),
  completed: (
    <>
      <FaRegCalendarCheck /> &nbsp; Completados
    </>
  ),
  expired: (
    <>
      <FaRegCalendarTimes /> &nbsp; Vencidos
    </>
  ),
};
