// react pwa for face claim
import { useGoogleDrive } from './useGoogleDrive';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


function App() {
  const [faceClaims, setFaceClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [pinnedClaims, setPinnedClaims] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showHeader, setShowHeader] = useState(true);

  const { signIn, loadJSONFromDrive, gapiReady } = useGoogleDrive();
  const fileId = "1G4kzMSfQxgYe5xJ9bd7rRjNPcv0llciJ"; // Your Drive file ID
  
  const combinedClaims = [...pinnedClaims, ...faceClaims.filter(
  claim => !pinnedClaims.some(pinned => pinned.full_name === claim.full_name)
    )];
  const filteredClaims = selectedTags.length === 0
  ? combinedClaims
  : combinedClaims.filter((claim) =>
      selectedTags.every(tag =>
        claim.tags.toLowerCase().includes(tag.toLowerCase())
      )
    );
  // tags filtering
  const allTags = [...new Set(
    faceClaims.flatMap(claim => claim.tags.split(',').map(tag => tag.trim()))
  )];
  
  
  const convertDriveUrl = (url) => {
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)\//);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return url; // Fallback for non-Google links
    };

const fetchData = async () => {
  try {
    if (!gapiReady) {
      console.log("GAPI still initializing...");
      return;
    }
    await signIn();
    const data = await loadJSONFromDrive(fileId);
    setFaceClaims(data);
  } catch (err) {
    console.error("Google Drive fetch error:", err);
  }
};

useEffect(() => {
  fetchData();
}, [gapiReady]);
useEffect(() => {
  const savedPins = localStorage.getItem('pinnedClaims');
  if (savedPins) setPinnedClaims(JSON.parse(savedPins));
}, []);

useEffect(() => {
  localStorage.setItem('pinnedClaims', JSON.stringify(pinnedClaims));
}, [pinnedClaims]);
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
     {showHeader && !selectedClaim && (
         <div style={{
            position: 'sticky',
            top: 0,
            backgroundColor: '#fff',
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            zIndex: 1000
          }}>
            <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Face Claims</h1>
            <button onClick={fetchData} style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#4CAF50',
              color: '#fff',
              cursor: 'pointer'
            }}>Reload</button>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
              {allTags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedTags(prev =>
                      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                    );
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '16px',
                    border: '1px solid #ccc',
                    backgroundColor: selectedTags.includes(tag) ? '#4CAF50' : '#fff',
                    color: selectedTags.includes(tag) ? '#fff' : '#333',
                    cursor: 'pointer'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
      )}
     <button
              onClick={() => setShowHeader(!showHeader)}
              style={{
                position: 'fixed',
                top: '10px',
                right: '10px',
                zIndex: 1500,
                padding: '8px 12px',
                backgroundColor: '#333',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {showHeader ? 'Hide Header' : 'Show Header'}
            </button>
      <div style={{
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          marginTop: '20px'
        }}>
          {filteredClaims.map((claim, index) => (//combinedClaims.map((claim, index) => (//faceClaims.map((claim, index) => (
            <img
              key={index}
              src={claim.bookmark_image_url}
              alt={claim.full_name}
              style={{
                height: '85vh',            // 🔥 Dynamic height based on viewport
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

      {selectedClaim && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          onClick={() => setSelectedClaim(null)}
        >
        <button
          onClick={() => {
            if (!pinnedClaims.includes(selectedClaim)) {
              setPinnedClaims([selectedClaim, ...pinnedClaims]);
            }
            setSelectedClaim(null); // Close modal after pinning
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#FF9800',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            marginTop: '10px'
          }}
        >
          Pin to Front
        </button>
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