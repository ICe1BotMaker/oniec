import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from './pages/Home';
import Error from './pages/Error';

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Error />} />
        </Routes>
    )
}

export default App;