import "./styles/Agofla.css"

type AgoflaType = {
    text: string;
};

function Agofla({ text }: AgoflaType) {
    return <button className='a9ofla'>{text}</button>
}

export default Agofla;