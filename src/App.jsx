import { useState, useEffect } from "react";

function App() {
    const API_URL = "https://face-claim-api.onrender.com/face_claims"; // Replace with your actual API URL

    const [faceClaims, setFaceClaims] = useState([]);
    const [newClaim, setNewClaim] = useState({
        full_name: "",
        first_name: "",
        last_name: "",
        age: "",
        dob: "",
        place_of_birth: "",
        nationality: "",
        height_cm: "",
        hair_color: "",
        most_known_for: "",
        image_url: "",
        tags: ""
    });

    // Fetch all face claims from API
    useEffect(() => {
        fetch(API_URL)
            .then(response => response.json())
            .then(data => setFaceClaims(data));
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setNewClaim({ ...newClaim, [e.target.name]: e.target.value });
    };

    // Submit new face claim
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newClaim)
        });

        if (response.ok) {
            alert("Face Claim Added Successfully!");
            setNewClaim({
                full_name: "",
                first_name: "",
                last_name: "",
                age: "",
                dob: "",
                place_of_birth: "",
                nationality: "",
                height_cm: "",
                hair_color: "",
                most_known_for: "",
                image_url: "",
                tags: ""
            });

            // Refresh the face claims list
            fetch(API_URL)
                .then(response => response.json())
                .then(data => setFaceClaims(data));
        } else {
            alert("Error adding face claim.");
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Face Claim Database</h1>

            {/* Add Face Claim Form */}
            <h2>Add a New Face Claim</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", maxWidth: "400px" }}>
                <input type="text" name="full_name" placeholder="Full Name" value={newClaim.full_name} onChange={handleChange} required />
                <input type="text" name="first_name" placeholder="First Name" value={newClaim.first_name} onChange={handleChange} required />
                <input type="text" name="last_name" placeholder="Last Name" value={newClaim.last_name} onChange={handleChange} required />
                <input type="number" name="age" placeholder="Age" value={newClaim.age} onChange={handleChange} />
                <input type="text" name="dob" placeholder="Date of Birth" value={newClaim.dob} onChange={handleChange} />
                <input type="text" name="place_of_birth" placeholder="Place of Birth" value={newClaim.place_of_birth} onChange={handleChange} />
                <input type="text" name="nationality" placeholder="Nationality" value={newClaim.nationality} onChange={handleChange} />
                <input type="number" name="height_cm" placeholder="Height (cm)" value={newClaim.height_cm} onChange={handleChange} />
                <input type="text" name="hair_color" placeholder="Hair Color" value={newClaim.hair_color} onChange={handleChange} />
                <input type="text" name="most_known_for" placeholder="Most Known For" value={newClaim.most_known_for} onChange={handleChange} />
                <input type="text" name="image_url" placeholder="Image URL" value={newClaim.image_url} onChange={handleChange} />
                <input type="text" name="tags" placeholder="Tags (comma-separated)" value={newClaim.tags} onChange={handleChange} />
                <button type="submit" style={{ marginTop: "10px", padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" }}>Add Face Claim</button>
            </form>

            {/* Display Face Claims */}
            <h2>Current Face Claims</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {faceClaims.map((claim) => (
                    <li key={claim.id} style={{ marginBottom: "15px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
                        <img src={claim.image_url} alt={claim.full_name} width="100" style={{ borderRadius: "5px" }} />
                        <p><strong>{claim.full_name}</strong> - {claim.most_known_for}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;