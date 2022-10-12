import React from 'react';
import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Home, Login} from "./pages";
import {Auth} from "./component";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<Auth><Home /></Auth>} />
                <Route path={"/login"} element={<Login />} />
                <Route path={"*"} element={<h1>404</h1>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
