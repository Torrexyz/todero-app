import { Routes, Route, Navigate } from "react-router";

import LobbyPage from "@pages/public/Lobby/LobbyPage";
import LoginPage from "@pages/public/Login/LoginPage";
import NotFoundPage from "@pages/public/NotFound/NotFoundPage";

import DashboardLayaout from "@pages/dashboard/Layaout/DashboardLayaout";
import DashboardTodoPage from "@pages/dashboard/Todo/TodoPage";
import DashboardNotesPage from "@pages/dashboard/Notes/NotesPage";
import DashboardClockPage from "@pages/dashboard/Clock/ClockPage";
import DashboardProfilePage from "@pages/dashboard/Profile/ProfilePage";
import DashboardSettingsPage from "@pages/dashboard/Settings/SettingsPage";

import "@assets/fonts/Jersey20-Regular.ttf";
import "./index.css";

//====================//

export default function App() {
  return (
    <>
      <div className="app">
        <Routes>
          <Route path="/" element={<LobbyPage />}></Route>
          <Route path="/lobby" element={<LobbyPage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/not-found" element={<NotFoundPage />} />

          <Route path="/dashboard" element={<DashboardLayaout />}>
            <Route
              index
              element={<Navigate to="/dashboard/todo" replace />}
            ></Route>

            <Route path="todo" element={<DashboardTodoPage />}></Route>
            <Route path="notes" element={<DashboardNotesPage />}></Route>
            <Route path="clock" element={<DashboardClockPage />}></Route>
            <Route path="profile" element={<DashboardProfilePage />}></Route>
            <Route path="settings" element={<DashboardSettingsPage />}></Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  );
}
