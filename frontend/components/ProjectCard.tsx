import './styles/ProjectCard.css';

type ProjectCardProps = {
    pic: string;
    title: string;
    description: string;
    techs: string[];
    links: string;
}

function ProjectCard({pic, title, description, techs, links}: ProjectCardProps) {
    return (
        <a href={links} className="project-link" target="_blank" rel="noopener noreferrer">
          <div className="project-card">
              <div className='project-image'>
                <img alt={title} src={pic}></img>
              </div>
              <div className="techs">
                 {techs.map((tech) => (
                   <span key={tech} className='techs-btn'>{tech}</span> 
                 ))}
              </div>

              <h3>{title}</h3>
              <p>{description}</p>
          </div>
        </a>
    );
}

export default ProjectCard;