import {AuthProvider} from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import './App.css';

import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app-container">
                    <Header/>
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Home/>}/>
                            <Route path="/about" element={<About/>}/>
                            <Route path="/contact" element={<Contact/>}/>
                        </Routes>
                    </main>
                    <Footer/>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
