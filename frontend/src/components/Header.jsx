import {Link} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import '../assets/css/Navbar.css';

export default function Header() {
    const {token, login, logout, email, setEmail, password, setPassword} = useAuth();

    const handleLogin = async () => {
        try {
            await login(email, password);
            alert("Login exitoso");
        } catch (err) {
            alert("Error en login");
        }
    };

    return (
        <header>
            <nav id={"navbar"}>
                <div id="navbar_buttons">
                    {/*<img id="logo" src="../../public/dexter_square.png" alt="logo"/>*/}
                    <Link className={"navbar_button"} to="/"><img id="logo" src="../../public/dexter_square.png" alt="logo"/></Link>
                    <Link className={"navbar_button"} to="/lista">Lista</Link>
                    <Link className={"navbar_button"} to="/about">About</Link>
                    <Link className={"navbar_button"} to="/contact">Contact</Link>
                </div>
                <div id="navbar_login">
                    {token ? (
                        <button className={"button_login"} onClick={logout}>Logout</button>
                    ) : (
                        <>
                            <input className={"input_text"} value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"/>
                            <input className={"input_text"} value={password} onChange={e => setPassword(e.target.value)} type="password"/>
                            <button className={"button_login"} onClick={handleLogin}>Login</button>
                        </>
                    )}
                </div>
            </nav>

        </header>
    );
}
