import ClockDatetime from "@components/dashboard/Clock/Datetime/ClockDatetime";
import ClockTimer from "@components/dashboard/Clock/Timer/ClockTimer";
import ClockChronometer from "@components/dashboard/Clock/Chronometer/ClockChronometer";
import ClockAlarm from "@components/dashboard/Clock/Alarm/ClockAlarm";

import { PiClockClockwise, PiClockFill } from "react-icons/pi";
import { LuAlarmClock } from "react-icons/lu";
import { RxLapTimer } from "react-icons/rx";

//====================//

export const LINK_ELEMENTS = {
  datetime: (
    <>
      <PiClockFill /> Hora Actual
    </>
  ),
  timer: (
    <>
      <PiClockClockwise /> Temporizador
    </>
  ),
  chronometer: (
    <>
      <RxLapTimer /> Cronómetro
    </>
  ),
  alarm: (
    <>
      <LuAlarmClock /> &nbsp;&nbsp;&nbsp; Alarma &nbsp;&nbsp;&nbsp;
    </>
  ),
};

export const CLOCK_COMPONENTS = {
  datetime: <ClockDatetime />,
  timer: <ClockTimer />,
  chronometer: <ClockChronometer />,
  alarm: <ClockAlarm />,
};
