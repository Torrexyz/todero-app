import { MdCalendarMonth, MdFormatListBulleted } from "react-icons/md";
import { FaRegCalendarTimes, FaRegCalendarCheck } from "react-icons/fa";
import { BiCalendarWeek } from "react-icons/bi";
import { PiSunHorizon } from "react-icons/pi";
import { GoTasklist } from "react-icons/go";
import { FiTarget } from "react-icons/fi";

//====================//

const getLocalTimestamp = (isoString) => {
  if (!isoString) return 0;
  return new Date(isoString).getTime();
};

const getLocalTimeRanges = () => {
  const currentTimestamp = Date.now();
  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  const endOfToday = new Date(
    currentYear,
    currentMonth,
    currentDay,
    23,
    59,
    59,
    999,
  ).getTime();
  const endOfTomorrow = new Date(
    currentYear,
    currentMonth,
    currentDay + 1,
    23,
    59,
    59,
    999,
  ).getTime();

  const currentDayOfWeek = currentDate.getDay();
  const daysUntilSunday = currentDayOfWeek === 0 ? 0 : 7 - currentDayOfWeek;
  const endOfWeek = new Date(
    currentYear,
    currentMonth,
    currentDay + daysUntilSunday,
    23,
    59,
    59,
    999,
  ).getTime();

  const endOfMonth = new Date(
    currentYear,
    currentMonth + 1,
    0,
    23,
    59,
    59,
    999,
  ).getTime();

  return {
    now: currentTimestamp,
    today: endOfToday,
    tomorrow: endOfTomorrow,
    week: endOfWeek,
    month: endOfMonth,
  };
};

/*..........*/

const isToday = (isoString) => {
  const taskTimestamp = getLocalTimestamp(isoString);
  const ranges = getLocalTimeRanges();
  return taskTimestamp >= ranges.now && taskTimestamp <= ranges.today;
};

const isTomorrow = (isoString) => {
  const taskTimestamp = getLocalTimestamp(isoString);
  const ranges = getLocalTimeRanges();
  return taskTimestamp > ranges.today && taskTimestamp <= ranges.tomorrow;
};

const isThisWeek = (isoString) => {
  const taskTimestamp = getLocalTimestamp(isoString);
  const ranges = getLocalTimeRanges();
  return taskTimestamp >= ranges.now && taskTimestamp <= ranges.week;
};

const isThisMonth = (isoString) => {
  const taskTimestamp = getLocalTimestamp(isoString);
  const ranges = getLocalTimeRanges();
  return taskTimestamp >= ranges.now && taskTimestamp <= ranges.month;
};

const isExpired = (isoString) => {
  const taskTimestamp = getLocalTimestamp(isoString);
  const ranges = getLocalTimeRanges();
  return taskTimestamp > 0 && taskTimestamp < ranges.now;
};

//====================//

const DEFAULT_FILTERS = {
  today: {
    element: (
      <>
        <FiTarget /> &nbsp; Hoy
      </>
    ),
    call: (tasksData) => {
      return Object.fromEntries(
        Object.entries(tasksData).filter(
          ([, value]) => isToday(value.expires_at) && !value.is_checked,
        ),
      );
    },
  },
  tomorrow: {
    element: (
      <>
        <PiSunHorizon /> &nbsp; Mañana
      </>
    ),
    call: (tasksData) => {
      return Object.fromEntries(
        Object.entries(tasksData).filter(
          ([, value]) => isTomorrow(value.expires_at) && !value.is_checked,
        ),
      );
    },
  },
  week: {
    element: (
      <>
        <BiCalendarWeek /> &nbsp; Esta semana
      </>
    ),
    call: (tasksData) => {
      return Object.fromEntries(
        Object.entries(tasksData).filter(
          ([, value]) => isThisWeek(value.expires_at) && !value.is_checked,
        ),
      );
    },
  },
  month: {
    element: (
      <>
        <MdCalendarMonth /> &nbsp; Este mes
      </>
    ),
    call: (tasksData) => {
      return Object.fromEntries(
        Object.entries(tasksData).filter(
          ([, value]) => isThisMonth(value.expires_at) && !value.is_checked,
        ),
      );
    },
  },
  activities: {
    element: (
      <>
        <GoTasklist /> &nbsp; Actividades
      </>
    ),
    call: (tasksData) => {
      return Object.fromEntries(
        Object.entries(tasksData).filter(
          ([, value]) => value.expires_at === null,
        ),
      );
    },
  },
  all: {
    element: (
      <>
        <MdFormatListBulleted /> &nbsp; Todos
      </>
    ),
    call: (tasksData) => {
      return tasksData;
    },
  },
  completed: {
    element: (
      <>
        <FaRegCalendarCheck /> &nbsp; Completados
      </>
    ),
    call: (tasksData) => {
      return Object.fromEntries(
        Object.entries(tasksData).filter(([, value]) => value.is_checked),
      );
    },
  },
  expired: {
    element: (
      <>
        <FaRegCalendarTimes /> &nbsp; Vencidos
      </>
    ),
    call: (tasksData) => {
      return Object.fromEntries(
        Object.entries(tasksData).filter(
          ([, value]) => isExpired(value.expires_at) && !value.is_checked,
        ),
      );
    },
  },
};

//====================//

export default DEFAULT_FILTERS;
