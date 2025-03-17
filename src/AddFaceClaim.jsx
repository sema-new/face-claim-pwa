import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddFaceClaim() {
    const navigate = useNavigate();
    const [newClaim, setNewClaim] = useState({
        full_name: "",
        most_known_for: "",
        image_url: ""
    });

    // Handle input changes
    const handleChange = (e) => {
        setNewClaim({ ...newClaim, [e.target.name]: e.target.value });
    };

    // Add face claim to local storage
    const handleSubmit = (e) => {
        e.preventDefault();
        const savedClaims = JSON.parse(localStorage.getItem("faceClaims")) || [];
        const updatedClaims = [...savedClaims, newClaim];
        localStorage.setItem("faceClaims", JSON.stringify(updatedClaims));
        navigate("/"); // Navigate back to main screen
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Add a New Face Claim</h1>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", maxWidth: "400px" }}>
                <input type="text" name="full_name" placeholder="Full Name" value={newClaim.full_name} onChange={handleChange} required />
                <input type="text" name="most_known_for" placeholder="Most Known For" value={newClaim.most_known_for} onChange={handleChange} required />
                <input type="text" name="image_url" placeholder="Image URL" value={newClaim.image_url} onChange={handleChange} />
                <button type="submit" style={{ marginTop: "10px", padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" }}>
                    Add Face Claim
                </button>
            </form>

            {/* Back to Home Button */}
            <button onClick={() => navigate("/")} style={{ marginTop: "20px", padding: "10px", backgroundColor: "gray", color: "white", border: "none", cursor: "pointer" }}>
                Back to Home
            </button>
        </div>
    );
}

export default AddFaceClaim;