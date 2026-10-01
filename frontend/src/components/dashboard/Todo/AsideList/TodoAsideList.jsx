import { useLocation, useNavigate } from "react-router";

import { useProjectStore } from "@store/dashboard/todo/projectStore";
import { useTodoProject } from "@hooks/dashboard/todo/useProject";

import { ImFilesEmpty } from "react-icons/im";
import { VscBracketError } from "react-icons/vsc";
import { MdOutlineCloudDownload } from "react-icons/md";

import styles from "./TodoAsideList.module.css";

//====================//

export default function TodoAsideList({ defaultFilters }) {
  //..........//

  const navigate = useNavigate();
  const location = useLocation();

  //..........//

  const projectsData = useProjectStore((state) => state.projects);
  const projectError = useProjectStore((state) => state.error);
  const projectIsFetching = useProjectStore((state) => state.isFetching);

  const { refreshProjects } = useTodoProject({ autoFetch: false });

  let skipEmptyProjects = false;
  if (Object.keys(projectsData).length === 0) skipEmptyProjects = true;

  //..........//

  return (
    <>
      <ul className={styles.asideList}>
        {Object.entries(defaultFilters).map(([filterId, filterObj]) => (
          <li
            key={filterId}
            onClick={() =>
              navigate({
                pathname: location.pathname,
                search: "?filter=" + filterId,
              })
            }
          >
            {filterObj.element}
          </li>
        ))}

        <hr />

        {!projectError ? (
          !projectIsFetching ? (
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
