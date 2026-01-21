import './styles/ActiveCareerCard.css';

type CardType = {
    title: string;
    description: string;
    date: string;
}

function ActiveCareerCard({title, description, date}: CardType) {
   return (
       <div className='active-career-card'>
          <h3>{title}</h3>
          <p>{description}</p>
          <span><div className="cNNLQk"></div> {date}</span>
       </div>
   );
}

export default ActiveCareerCard;