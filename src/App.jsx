import { useState, useEffect } from "react";

function App() {
    const [faceClaims, setFaceClaims] = useState([]);
    const [newClaim, setNewClaim] = useState({
        full_name: "",
        most_known_for: "",
        image_url: ""
    });

    // Load face claims from Local Storage
    useEffect(() => {
        const savedClaims = localStorage.getItem("faceClaims");
        if (savedClaims) {
            setFaceClaims(JSON.parse(savedClaims));
        }
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setNewClaim({ ...newClaim, [e.target.name]: e.target.value });
    };

    // Function to add a new face claim
    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedClaims = [...faceClaims, newClaim];
        setFaceClaims(updatedClaims);
        localStorage.setItem("faceClaims", JSON.stringify(updatedClaims));

        // Reset form
        setNewClaim({ full_name: "", most_known_for: "", image_url: "" });
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Face Claim Database (Local)</h1>

            {/* Add Face Claim Form */}
            <h2>Add a New Face Claim</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", maxWidth: "400px" }}>
                <input type="text" name="full_name" placeholder="Full Name" value={newClaim.full_name} onChange={handleChange} required />
                <input type="text" name="most_known_for" placeholder="Most Known For" value={newClaim.most_known_for} onChange={handleChange} required />
                <input type="text" name="image_url" placeholder="Image URL" value={newClaim.image_url} onChange={handleChange} />
                <button type="submit" style={{ marginTop: "10px", padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" }}>
                    Add Face Claim
                </button>
            </form>

            {/* Display Face Claims */}
            <h2>Current Face Claims</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {faceClaims.map((claim, index) => (
                    <li key={index} style={{ marginBottom: "15px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
                        <img src={claim.image_url} alt={claim.full_name} width="100" style={{ borderRadius: "5px" }} />
                        <p><strong>{claim.full_name}</strong> - {claim.most_known_for}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;