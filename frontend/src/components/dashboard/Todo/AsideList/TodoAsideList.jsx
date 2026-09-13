import { useLocation, useNavigate } from "react-router";

import { ImFilesEmpty } from "react-icons/im";
import { VscBracketError } from "react-icons/vsc";
import { MdOutlineCloudDownload } from "react-icons/md";

import styles from "./TodoAsideList.module.css";

//====================//

export default function TodoAsideList({
  defaultFilterElements,
  projectsData,
  refreshProjects,
  projectLoading,
  projectError,
}) {
  //..........//

  const navigate = useNavigate();
  const location = useLocation();

  //..........//

  let skipEmptyProjects = false;
  if (Object.keys(projectsData).length === 0) skipEmptyProjects = true;

  //..........//

  return (
    <>
      <ul className={styles.asideList}>
        {Object.entries(defaultFilterElements).map(
          ([filterId, childElement]) => (
            <li
              key={filterId}
              onClick={() =>
                navigate({
                  pathname: location.pathname,
                  search: "?filter=" + filterId,
                })
              }
            >
              {childElement}
            </li>
          ),
        )}
        <hr />
        {!projectError ? (
          !projectLoading ? (
            !skipEmptyProjects ? (
              Object.entries(projectsData).map(([projectId, projectData]) => {
                return (
                  <li
                    key={projectId}
                    onClick={() => {
                      projectId !== "empty" &&
                        navigate({
                          pathname: location.pathname,
                          search: "?project=" + projectId,
                        });
                    }}
                  >
                    {projectData.pname}
                  </li>
                );
              })
            ) : (
              <li>
                <ImFilesEmpty /> &nbsp;&nbsp;Sin proyectos..
              </li>
            )
          ) : (
            <li>
              <MdOutlineCloudDownload /> &nbsp;&nbsp;Cargando proyectos..
            </li>
          )
        ) : (
          <li onClick={() => refreshProjects(true)}>
            <VscBracketError /> &nbsp;&nbsp;Error de carga
          </li>
        )}
      </ul>
    </>
  );
}
