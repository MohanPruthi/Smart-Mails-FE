import axios from 'axios';

export const replyEmail = async(emailBody) =>{
    try {
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: "llama3",
            prompt: `Write a short reply for the following email:\n\n"${emailBody}"\n\nonly return reply body`,
            stream: false
        });

        console.log("reply:", response.data.response);
        return response.data.response;
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
}