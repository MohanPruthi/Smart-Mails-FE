import React from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            // Make a request to the backend to get the Google auth URL
            const response = await fetch("http://localhost:4000/auth/google", {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch Google login URL");
            }

            const data = await response.json();
            
            if (data.url) {
                console.log(data)
                // Redirect the user to the Google login page
                window.location.href = data.url;
            }
        } catch (error) {
            console.error("Google Login Error:", error);
        }
    };

    return (
        <div>
            <div
                onClick={handleGoogleLogin}
                className="bg-red-800 text-yellow-300 p-4 justify-center items-center flex hover:bg-red-500 hover:text-yellow-200 hover:cursor-pointer"
            >
                LOGIN WITH GOOGLE
            </div>
        </div>
    );
};

export default Login;
