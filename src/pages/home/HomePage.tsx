import { useEffect } from "react";
// import Datastats from "../../components/DataStats";
import { Link } from "wouter";
import NewProjectModal from "./NewProjectModal";
import useProjectsStore from "../../stores/ProjectsStore";

function HomePage () {

  const projects = useProjectsStore((state) => state.projects);
  const setProjects = useProjectsStore((state) => state.setProjects);

  // init
  useEffect(() => {
    setProjects();
  }
  , [setProjects]);

  return (
    <section id="page">
      <article className="head-c">
        <NewProjectModal />
        {/* TODO: make stats [num projects, num sections, num value] */}
        {/* <Datastats /> */}
      </article>
      <article className="content">

        {projects.length === 0
          ? <p className="text-gray-600">No projects found.</p>
          : projects.map((project) => (
            <Link href={ "/project/" + project.id } key={ project.id } className="card bg-base-200 border-base-300 rounded-box w-full h-full border p-4">
              <h2 className="line-clamp-1">{ project.name }</h2>
              {project.description && <p className="text-gray-600 whitespace-pre-line line-clamp-2">{ project.description }</p>}
            </Link>
            ))
        }

      </article>
    </section>
  );
}

export default HomePage;
 