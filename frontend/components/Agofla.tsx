// @ts-ignore: allow side-effect CSS import without type declarations
import "./styles/Agofla.css"

type AgoflaType = {
    text: string;
};

function Agofla({ text }: AgoflaType) {
    return <div className='a9ofla' aria-hidden="true">{text}</div>
}

export default Agofla;