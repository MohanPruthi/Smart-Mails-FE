import React, { useEffect, useState } from "react";

const Home = () => {
    const [profile, setProfile] = useState(null);
    const [emailSummary, setEmailSummary] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch("http://localhost:4000/auth/profile", {
                    method: "GET",
                    credentials: "include", // Important for cookies/authentication
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
            const response = await fetch("http://localhost:4000/auth/email_summarise", {
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

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 text-center">
                <h1 className="text-2xl font-bold text-yellow-400">Welcome, {profile?.given_name}!</h1>
                {profile && (
                    <div className="mt-4">
                        <img
                            src={profile.picture}
                            alt="Profile"
                            className="w-24 h-24 rounded-full mx-auto border-4 border-yellow-400"
                        />
                        <p className="mt-2 text-lg font-semibold">{profile.name}</p>
                        <p className="text-sm text-gray-400">{profile.email}</p>
                        {profile.verified_email && (
                            <p className="mt-2 text-green-400">✔ Verified Email</p>
                        )}
                    </div>
                )}
            </div>

            {/* Summarize Emails Button */}
            <button
                onClick={fetchEmailSummary}
                className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition"
                disabled={loading}
            >
                {loading ? "Summarizing..." : "Summarize Last 10 Emails"}
            </button>

            {/* Email Summary Display */}
            <div className="mt-6 w-full max-w-lg">
                {emailSummary.length > 0 && (
                    <h2 className="text-yellow-400 text-lg font-semibold mb-4">Email Summaries:</h2>
                )}
                {emailSummary.map((email) => (
                    <div key={email.id} className="bg-gray-800 p-4 rounded-lg shadow-md mb-4">
                        <p className="text-yellow-300 font-semibold mt-2">Summary:</p>
                        <p className="text-gray-400">{email.summary}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
