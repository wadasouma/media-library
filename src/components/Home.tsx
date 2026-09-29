import { Link, useNavigate } from "react-router";
import '../index.css'
function Home(){
    const navigate=useNavigate();
    return(
        <div className="homeNavButtonDiv">
            <button onClick={()=>navigate("/movie")}>MOVIE</button>
            <button onClick={()=>navigate("/comic")}>漫画</button>
        </div>
    )
}

function Header(){
    return(
        <nav className="header">
            <h1><Link to="/movie">MOVIE</Link></h1>
            <h1><Link to="/">HOME</Link></h1>
            <h1><Link to="/comic">COMIC</Link></h1>
        </nav>
    )
}
export {Home,Header};