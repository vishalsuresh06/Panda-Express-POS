import { useState, useEffect } from "react";
import { apiURL } from './config.js'

function Home() {
    const [message, setMessage] = useState("Loading...");

    useEffect(() => {
        async function fetchMessage() {
            try {
                let response = await fetch(`${apiURL}/api/helloworld`);

                if (response.ok) {
                    const text = await response.text();
                    setMessage(text);
                } else {
                    setMessage("Failed to fetch data");
                }
            } catch (error) {
                setMessage("Fetch error");
                console.log(error);
            }
        }

        fetchMessage();
    }, [])
    return (
        <>
            <h1>{message}</h1>
        </>
    )
}

export default Home
