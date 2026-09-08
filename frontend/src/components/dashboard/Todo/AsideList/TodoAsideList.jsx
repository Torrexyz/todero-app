import { useNavigate } from "react-router";

import styles from "./TodoAsideList.module.css";

//====================//

export default function TodoAsideList({
  location,
  defaultFilterElements,
  projectsData,
}) {
  const navigate = useNavigate();

  let skipEmptyProjects = false;
  if (Object.keys(projectsData).length > 1) skipEmptyProjects = true;

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
        {Object.entries(projectsData).map(([projectId, projectData]) => {
          if (skipEmptyProjects ? projectId !== "empty" : true)
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
        })}
      </ul>
    </>
  );
}
