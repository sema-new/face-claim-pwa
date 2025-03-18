// react pwa for face claim
import { useGoogleDrive } from './useGoogleDrive';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function App() {
    const { signIn, loadJSONFromDrive, uploadJSONToDrive } = useGoogleDrive();
  const [faceClaims, setFaceClaims] = useState([]);
  const fileId = "1G4kzMSfQxgYe5xJ9bd7rRjNPcv0llciJ";

   const fetchData = async () => {
    await signIn();
    const data = await loadJSONFromDrive(fileId);
    setFaceClaims(data);
  };

  const saveData = async () => {
    await uploadJSONToDrive(fileId, faceClaims);
    alert("Synced to Google Drive!");
  };


    return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Face Claim Gallery</h1>

      <button onClick={fetchData} style={{ marginRight: "10px" }}>Load from Google Drive</button>
      <button onClick={saveData}>Save to Google Drive</button>

      {/* Horizontally Scrollable Bookmark Images */}
      <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', marginTop: '20px' }}>
        {faceClaims.map((claim, index) => (
          <img
            key={index}
            src={claim.bookmark_image_url}
            alt={claim.full_name}
            style={{
              width: '150px',
              height: '220px',
              objectFit: 'cover',
              marginRight: '10px',
              cursor: 'pointer',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
            }}
            onClick={() => setSelectedClaim(claim)}
          />
        ))}
      </div>

      {/* Popup Modal for Details */}
      {selectedClaim && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
          onClick={() => setSelectedClaim(null)} // Close modal on click
        >
          <div style={{
            backgroundColor: '#fff', padding: '20px', borderRadius: '8px',
            maxWidth: '90%', maxHeight: '80%', overflowY: 'auto'
          }}>
            <h2>{selectedClaim.full_name}</h2>
            <p><strong>Stage Name:</strong> {selectedClaim.stage_name}</p>
            <p><strong>Height:</strong> {selectedClaim.height_cm} cm</p>
            <p><strong>Hair Color:</strong> {selectedClaim.hair_color}</p>
            <p><strong>Date of Birth:</strong> {selectedClaim.dob}</p>
            <p><strong>Place of Birth:</strong> {selectedClaim.place_of_birth}</p>
            <p><strong>Most Known For:</strong> {selectedClaim.most_known_for}</p>
            <p><strong>Tags:</strong> {selectedClaim.tags}</p>
            <img src={selectedClaim.bookmark_image_url} alt={selectedClaim.full_name} style={{ width: '100%', marginTop: '10px' }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;