import React from "react";
import { Link } from "react-router-dom";

const Error: React.FC = () => {
    return (
        <>
            <h1>404 Page Not Found</h1>
            <hr />
            <p><Link to="/">go home</Link></p>
        </>
    )
}

export default Error;