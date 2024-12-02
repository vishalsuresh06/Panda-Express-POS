import { useState } from 'react';
import { GuestRoute, login } from '../../utils/Auth'
import { apiURL } from '../../config';
import './login.css'

export function Login() {
    const [id, setID] = useState("");
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!id || !pin) {
            setError("Please fill in both fields");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${apiURL}/api/login/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, pin }),
            });

            const data = await response.json();

            if (response.ok) {
                login(data.token, data.id, data.isManager, data.name)
            } else {
                console.error("Login failed:", data.message);
                setError(data.message || "Something went wrong!");
            }
        } catch (err) {
            console.error("Error:", err);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <GuestRoute>
            <form onSubmit={handleSubmit} className='loginform'>
                <h3>Employee Login</h3>

                <label htmlFor="id">ID</label>
                <input type="text" placeholder="0" id="id" value={id} onChange={(e) => setID(e.target.value)}></input>

                <label htmlFor="pin">Pin</label>
                <input type="password" placeholder="1234" id="pin" value={pin} onChange={(e) => setPin(e.target.value)}></input>

                <p className='loginerror'>{error}</p>

                <button className='loginbutton'>Log In</button>
                <div className="loginsocial">
                    <button className='loginsocialbutton'>Login with Google</button>
                </div>
            </form>
        </GuestRoute>
    );
}
