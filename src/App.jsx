// react pwa for face claim
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function App() {
    const [faceClaims, setFaceClaims] = useState([]);

    // Load saved face claims from Local Storage
    useEffect(() => {
        const savedClaims = localStorage.getItem("faceClaims");
        if (savedClaims) {
            setFaceClaims(JSON.parse(savedClaims));
        }
    }, []);

    // Function to delete a face claim
    const deleteFaceClaim = (index) => {
        const updatedClaims = [...faceClaims];
        updatedClaims.splice(index, 1);
        setFaceClaims(updatedClaims);
        localStorage.setItem("faceClaims", JSON.stringify(updatedClaims));
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", textAlign: "center" }}>
            <h1>Face Claim Database</h1>

            {/* Add Face Claim Button */}
            <Link to="/add">
                <button style={{ padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" }}>
                    + Add Face Claim
                </button>
            </Link>

            {/* Horizontal Scrollable Face Claims List */}
            <div style={{ overflowX: "auto", whiteSpace: "nowrap", marginTop: "20px" }}>
                {faceClaims.map((claim, index) => (
                    <div key={index} style={{ display: "inline-block", width: "150px", margin: "10px" }}>
                        <img src={claim.image_url} alt={claim.full_name} width="100" style={{ borderRadius: "5px" }} />
                        <p><strong>{claim.full_name}</strong></p>
                        <button onClick={() => deleteFaceClaim(index)} style={{ backgroundColor: "red", color: "white", border: "none", cursor: "pointer", marginTop: "5px" }}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;