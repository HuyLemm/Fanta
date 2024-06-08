import React from "react";
import LogoutButton from "../components/LogOutButton";
import Header from "../components/Header";

const HomePage = () => {
    return (
        <div className="homepage">
            <div>
                <h1>Welcome to Homepage</h1>
            </div>
            <LogoutButton /> 
        </div>
    );
};

export default HomePage;