import './styles/CareerCard.css';

type CardType = {
    title: string;
    description: string;
    date: string;
}

function CareerCard({title, description, date}: CardType) {
   return (
       <div className='career-card'>
          <h3>{title}</h3>
          <p>{description}</p>
          <span>{date}</span>
       </div>
   );
}

export default CareerCard;