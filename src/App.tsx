import React from 'react';
import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Communicate, Home, Login} from "./pages";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<Home />} />
                <Route path={"/login"} element={<Login />} />
                <Route path={"/communicate"} element={<Communicate />} />
                <Route path={"*"} element={<h1>404</h1>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
