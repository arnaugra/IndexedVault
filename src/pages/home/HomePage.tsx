import { useEffect } from "react";
// import Datastats from "../../components/DataStats";
import { Link } from "wouter";
import ProjectModal from "../project/ProjectModal";
import useProjectsStore from "../../stores/ProjectsStore";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import { ProjectI } from "../../db/interfaces";
import { Project } from "../../db/Project";
import DragIcon from "../../svg/DragIcon";
import { UUID } from "../../types/fields";
import { useSeo } from "../../hooks/useSeo";

function HomePage () {

  const { projects, setProjects } = useProjectsStore();

  // init
  useEffect(() => {
    setProjects();
  }, [setProjects]);
  
  // SEO
  useSeo({ title: "IndexedVault"});

  // drag and drop
  const { draggedItem, overItem, onDragStart, onDragEnd, onDragOver, onDrop, reorderItems } = useDragAndDrop<ProjectI>();

  const handleReorder = (target: ProjectI): React.DragEventHandler => {
    return onDrop(target, async (from, to) => {
      const updated = reorderItems(projects, from, to);
      for (const project of updated) {
        await new Project().update(project.id!, { order: project.order });
      }
      setProjects();
    });
  };

  const getOnDraggingClass = (projectUUID: UUID): string | undefined => {
    if (!draggedItem) return;
    if (draggedItem.uuid === projectUUID) return 'dragging';
    if (overItem?.uuid === projectUUID) return 'dragging-over';
    return 'not-dragging';
  };

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
            <Link href={ "/project/" + project.uuid } key={ project.uuid } className={`card bg-base-200 border-base-300 rounded-box w-full h-full border p-4 ${getOnDraggingClass(project.uuid!)}`}
            onDrop={ handleReorder(project) } 
            onDragEnd={ onDragEnd }
            onDragOver={ onDragOver(project) }
            >
              <div className="flex items-center gap-2">
                  <div className="shrink-0 text-gray-500 -ml-1"
                  draggable
                  onDragStart={ onDragStart(project) }
                  >
                      <DragIcon className="w-5 cursor-grab"/>

                  </div>
                  <h2 className="line-clamp-1">{ project.name }</h2>
              </div>
              {project.description && <p className="text-gray-600 whitespace-pre-line line-clamp-2">{ project.description }</p>}
            </Link>
            ))
        }

      </article>
    </section>
  );
}

export default HomePage;
 