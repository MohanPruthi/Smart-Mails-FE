import React, { useEffect, useState } from "react";
import { replyEmail } from "./AIreply";

const Home = () => {
    const [profile, setProfile] = useState(null);
    const [emailSummary, setEmailSummary] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch("http://localhost:4000/auth/profile", {
                    method: "GET",
                    credentials: "include", 
                });
                const data = await response.json();
                setProfile(data.profile);
                console.log("Profile data:", data.profile);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchProfile();
    }, []);

    const fetchEmailSummary = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:4000/auth/email/summarise", {
                method: "GET",
            });
            const data = await response.json();
            setEmailSummary(data || "No summary available.");
            console.log("Email Summary:", data);
        } catch (error) {
            console.error("Error fetching email summary:", error);
            setEmailSummary("Failed to fetch summary.");
        }
        setLoading(false);
    };

    const replyEmail = async (emailBody, senderEmail, myEmail) => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:4000/auth/email/reply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", 
                },
                body: JSON.stringify({ emailBody, senderEmail, myEmail }), 
            });
    
            const data = await response.json();
            console.log("Response:", data); 
    
        } catch (error) {
            console.error("Error fetching email reply:", error);
        }
        setLoading(false);
    };
    

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col justify-center items-center p-6">
           { !profile && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
                ) 
            }   
            {/* Profile Card */}
            <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black p-8 rounded-3xl shadow-2xl  mx-auto border border-gray-700 overflow-hidden backdrop-blur-md">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 opacity-30 blur-2xl animate-pulse"></div>

                {/* Profile Content */}
                <div className="relative z-10 text-center">
                    <h1 className="text-3xl font-extrabold text-white mb-4">
                        👋 Welcome, {profile?.given_name}!
                    </h1>
                    { 
                        <div className="flex flex-col items-center gap-4">
                            {/* Profile Picture */}
                            <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg">
                                <img
                                    src={profile?.picture}
                                    alt="Profile"
                                    referrerPolicy="no-referrer"
                                    crossOrigin="anonymous"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            {/* Name & Email */}
                            <p className="text-xl font-semibold text-gray-100">{profile?.name}</p>
                            <p className="text-sm text-gray-400">{profile?.email}</p>

                            {/* Verified Badge */}
                            {profile?.verified_email && (
                                <div className="flex items-center gap-2 mt-2 bg-green-700/20 px-3 py-1 rounded-full text-green-400 text-sm font-medium">
                                    <span>✔ Verified Email</span>
                                </div>
                            )}

                        </div>
                    }
                </div>
            </div>


            {/* Summarize Emails Button */}
            <button
                onClick={fetchEmailSummary}
                className="mt-4 w-1/3 py-3 font-semibold rounded-full relative overflow-hidden text-white 
                                border-none transition-all duration-300 ease-in-out 
                                bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
                                hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 
                                shadow-lg shadow-blue-500/40 hover:shadow-pink-500/40 
                                before:absolute before:inset-0 before:-z-10 before:rounded-full 
                                before:bg-[radial-gradient(circle_at_top_left,_#00c6ff,_#0072ff,_#7b00ff,_#ff00ff)] 
                                before:blur-2xl before:opacity-50 before:transition-opacity before:duration-500 
                                hover:before:opacity-75 animate-gradient hover:scale-105 hover:animate-pulse"
                disabled={loading}
            >
                {loading ? "⏳ Fetching...API is slow, Grab a Coffee☕" : "✨ Summarize Last 5 Emails"}
            </button>

            {/* Email Summary Display */}
<div className="mt-10 w-full max-w-2xl mx-auto">
    {emailSummary.length > 0 && (
        <h2 className="text-gray-300 text-2xl font-bold mb-6">📩 Email Summaries</h2>
    )}
    {emailSummary?.map((email) => {
        const sentimentStyles = {
            positive: "from-green-400 to-green-600 border-green-500 shadow-green-500/40",
            negative: "from-red-400 to-red-600 border-red-500 shadow-red-500/40",
            neutral: "from-yellow-400 to-yellow-600 border-yellow-500 shadow-yellow-500/40"
        };
        const sentimentClass = sentimentStyles[email?.emailDetails?.sentiment] || "from-gray-400 to-gray-600 border-gray-500 shadow-gray-500/40";

        return (
            <div 
                key={email.id} 
                className={`relative p-6 rounded-xl mb-10 border ${sentimentClass} bg-gray-800 shadow-lg shadow-opacity-40 hover:animate-pulse`}
            >
                <div className="absolute -top-3 left-4 px-4 py-1 text-sm font-semibold rounded-full text-gray-100 shadow-sm 
                            bg-gray-700 border border-gray-500">
                    {email?.emailDetails?.sentiment?.charAt(0).toUpperCase() + email?.emailDetails?.sentiment?.slice(1)}
                </div>
                <p className="text-gray-200 text-lg font-semibold mt-4">Summary:</p>
                <p className="text-gray-400 text-md leading-relaxed">{email?.emailDetails?.summary}</p>
                <div className="flex flex-col items-center justify-between">
                    <button 
                        onClick={() => replyEmail(email?.emailDetails?.summary, email?.senderEmail, profile?.email)}
                        className="mt-4 w-1/2 py-3 font-semibold rounded-full relative overflow-hidden text-white 
                                border-none transition-all duration-300 ease-in-out 
                                bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
                                hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 
                                shadow-lg shadow-blue-500/40 hover:shadow-pink-500/40 
                                before:absolute before:inset-0 before:-z-10 before:rounded-full 
                                before:bg-[radial-gradient(circle_at_top_left,_#00c6ff,_#0072ff,_#7b00ff,_#ff00ff)] 
                                before:blur-2xl before:opacity-50 before:transition-opacity before:duration-500 
                                hover:before:opacity-75 animate-gradient hover:scale-105"
                    >
                        ✨ Reply Using AI
                    </button>
                </div>
                
            </div>
        );
    })}
</div>

        </div>
    );
};

export default Home;