import { useNavigate } from "react-router";

import styles from "./LobbyPage.module.css";

//====================//

export default function LobbyPage() {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.lobbyPage}>
        <main onClick={() => navigate("/dashboard")}>
          <h1 className={styles.title}>Todero</h1>
          <h2 className={styles.subtitle}>
            Una app ToDo List con tema E-Ink porque si.
            <br />
            <span>
              (Realmente una excusa para aprender desarrollo web moderno
              clasiquito)
            </span>
          </h2>
        </main>
      </div>
    </>
  );
}
