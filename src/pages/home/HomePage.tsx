import { useEffect } from "react";
// import Datastats from "../../components/DataStats";
import { Link } from "wouter";
import ProjectModal from "../project/ProjectModal";
import useProjectsStore from "../../stores/ProjectsStore";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import { ProjectI } from "../../db/interfaces";
import { Project } from "../../db/Project";

function HomePage () {

  const { draggedItem, onDragStart, onDragEnd, onDragOver, onDrop, reorderItems } = useDragAndDrop<ProjectI>();

  const projects = useProjectsStore((state) => state.projects);
  const setProjects = useProjectsStore((state) => state.setProjects);

  const handleReorder = (target: ProjectI): React.DragEventHandler => {
    return onDrop(target, async (from, to) => {
      const updated = reorderItems(projects, from, to);
      for (const project of updated) {
        await new Project().update(project.id!, { order: project.order });
      }
      setProjects();
    });
  };

  // init
  useEffect(() => {
    setProjects();
    document.title = "IndexedVault";
  }
  , [setProjects]);

  const isDraging = (projectId: number) => draggedItem?.id === projectId ? 'dragging' : 'not-dragging'

  return (
    <section id="page">
      <article className="head-c">
        <ProjectModal />
        {/* TODO: make stats [num projects, num sections, num value] */}
        {/* <Datastats /> */}
      </article>
      <article className="content">

        {projects.length === 0
          ? <p className="text-gray-600">No projects found.</p>
          : projects.map((project) => (
            <Link href={ "/project/" + project.id } key={ project.id } className={`card bg-base-200 border-base-300 rounded-box w-full h-full border p-4 ${draggedItem ? isDraging(project.id as number) : ''}`}
            draggable
            onDragStart={ onDragStart(project) }
            onDragEnd={ onDragEnd }
            onDragOver={ onDragOver }
            onDrop={ handleReorder(project) } 
            >
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
 