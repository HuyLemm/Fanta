import React from "react";
import LogoutButton from "../components/LogOutButton";
import Logofanta from "../components/FantaLogo";

const HomePage = () => {
    return (
        <div className="homepage">
            <Logofanta />
            <div>
                <h1>Welcome to Homepage</h1>
            </div>
            <LogoutButton /> 
        </div>
    );
};

export default HomePage;