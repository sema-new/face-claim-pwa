import { useGoogleDrive } from './useGoogleDrive';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function App() {
  // states
  const [showHeader, setShowHeader] = useState(true); // header hiding state 
  const [faceClaims, setFaceClaims] = useState([]); // state for all claims
  const [selectedClaim, setSelectedClaim] = useState(null); // selected state for modal
  const [pinnedClaims, setPinnedClaims] = useState([]); // pinned claims state
  const [selectedTags, setSelectedTags] = useState([]); // state for tag filtering
  const [hairFilter, setHairFilter] = useState(""); // state for hair filter
  const [menuOpen, setMenuOpen] = useState(false);
  const [claims, setClaims] = useState([]); // initialize state
  const [sortedClaims, setSortedClaims] = useState([]); // state for sorted claims
  const [sortOption, setSortOption] = useState(""); // state for sort option  
  const [searchQuery, setSearchQuery] = useState(""); // state for search query

  // google drive connection for json file
  const { signIn, loadJSONFromDrive, gapiReady } = useGoogleDrive();
  const fileId = "1G4kzMSfQxgYe5xJ9bd7rRjNPcv0llciJ"; // Your Drive file ID

  const hairColors = [...new Set(faceClaims.map(claim => claim.hair_color))];

  // tags filtering
  const allTags = [...new Set(
    faceClaims.flatMap(claim => claim.tags.split(',').map(tag => tag.trim()))
  )];

  // combined claims
  const combinedClaims = [...pinnedClaims, ...faceClaims.filter(
    claim => !pinnedClaims.some(pinned => pinned.full_name === claim.full_name)
  )];

  // Apply filters and sorting
  const applyFiltersAndSorting = () => {
    // Apply tag and hair-based filters
    let filtered = combinedClaims.filter((claim) => {
      const tagMatch = selectedTags.length === 0 || selectedTags.every(tag =>
        claim.tags.toLowerCase().includes(tag.toLowerCase())
      );
      const hairMatch = hairFilter === "" || claim.hair_color.toLowerCase() === hairFilter.toLowerCase();
      return tagMatch && hairMatch;
    });

    // Apply search filter
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(claim => {
        return (
          claim.stage_name.toLowerCase().includes(lowerCaseQuery) ||
          claim.hair_color.toLowerCase().includes(lowerCaseQuery) ||
          claim.tags.toLowerCase().includes(lowerCaseQuery)
        );
      });
    }

    // Apply sorting
    if (sortOption) {
      if (sortOption === 'age') {
        filtered.sort((a, b) => new Date(a.dob) - new Date(b.dob)); // Youngest first
      } else if (sortOption === 'age-desc') {
        filtered.sort((a, b) => new Date(b.dob) - new Date(a.dob)); // Oldest first
      } else if (sortOption === 'height') {
        filtered.sort((a, b) => a.height_cm - b.height_cm); // Shortest first
      } else if (sortOption === 'height-desc') {
        filtered.sort((a, b) => b.height_cm - a.height_cm); // Tallest first
      } else if (sortOption === 'name-asc') {
        filtered.sort((a, b) => a.stage_name.localeCompare(b.stage_name)); // A-Z
      } else if (sortOption === 'name-desc') {
        filtered.sort((a, b) => b.stage_name.localeCompare(a.stage_name)); // Z-A
      }
    }

    setSortedClaims(filtered);
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
      setClaims(data); // Initialize claims state with fetched data
      setSortedClaims(data); // Initialize sortedClaims state with fetched data
    } catch (err) {
      console.error("Google Drive fetch error:", err);
    }
  };

  // Tag toggle logic
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSort = (option) => {
    setSortOption(option);
  };

  // Age calculation function
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Auto-load data when GAPI is ready
  useEffect(() => {
    fetchData();
  }, [gapiReady]);

  // use effect for saving pins in local storage 
  useEffect(() => {
    const savedPins = localStorage.getItem('pinnedClaims');
    if (savedPins) setPinnedClaims(JSON.parse(savedPins));
  }, []);

  useEffect(() => {
    localStorage.setItem('pinnedClaims', JSON.stringify(pinnedClaims));
  }, [pinnedClaims]);

  // Apply filters and sorting whenever relevant states change
  useEffect(() => {
    applyFiltersAndSorting();
  }, [faceClaims, pinnedClaims, selectedTags, hairFilter, searchQuery, sortOption]);

  // UI - Hamburger Menu
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Hamburger Menu Toggle Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          position: "fixed",
          top: "10px",
          left: "10px",
          zIndex: 1500,
          padding: "8px 12px",
          backgroundColor: "#333",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        ☰
      </button>

      {/* Collapsible Hamburger Menu */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "250px",
            height: "100%",
            backgroundColor: "#fff",
            padding: "20px",
            boxShadow: "2px 0 5px rgba(0,0,0,0.3)",
            zIndex: 1400,
            overflowY: "auto"
          }}
        >
          {/* Close Menu Button */}
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              backgroundColor: "transparent",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              float: "right"
            }}
          >
            &times;
          </button>
          <h1 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '1.5rem' }}>
            Face Claim
          </h1>
          <button
            onClick={fetchData}
            style={{
              padding: "8px 16px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "#4CAF50",
              color: "#fff",
              cursor: "pointer",
              marginBottom: "10px"
            }}
          >
            Reload
          </button>

          {/* Search Input*/}
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Search by stage name, hair color, or tags"
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "16px"
              }}
            />
          </div>

          {/* Sort Functionality */}
          <div className="sort-controls">
            <button onClick={() => handleSort('age')}>Sort by Age (Youngest)</button>
            <button onClick={() => handleSort('age-desc')}>Sort by Age (Oldest)</button>
            <button onClick={() => handleSort('height')}>Sort by Height (Shortest)</button>
            <button onClick={() => handleSort('height-desc')}>Sort by Height (Tallest)</button>
            <button onClick={() => handleSort('name-asc')}>Sort by Stage Name (A-Z)</button>
            <button onClick={() => handleSort('name-desc')}>Sort by Stage Name (Z-A)</button>
            <button onClick={() => setSortOption("")}>Reset</button>
          </div>

          <div className="face-claims-container">
            {sortedClaims.map((claim, index) => (
              <faceClaims key={index} claim={claim} />
            ))}
          </div>

          {/* Hair Color Filtering */}
          <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
            {hairColors.map((color, index) => (
              <button
                key={index}
                onClick={() => setHairFilter(color)}
                style={{
                  padding: "8px 12px",
                  backgroundColor: hairFilter === color ? "#555" : "#eee",
                  color: hairFilter === color ? "#fff" : "#333",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                {color}
              </button>
            ))}
            <button
              onClick={() => setHairFilter("")}
              style={{
                padding: "8px 12px",
                backgroundColor: "#f44336",
                color: "#fff",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Reset Hair Filter
            </button>
          </div>

          {/* Tag Filtering */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
            {allTags.map((tag, index) => (
              <button
                key={index}
                onClick={() => toggleTag(tag)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "16px",
                  backgroundColor: selectedTags.includes(tag) ? "#4CAF50" : "#eee",
                  color: selectedTags.includes(tag) ? "#fff" : "#333",
                  cursor: "pointer"
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Horizontally Scrollable Images */}
      <div style={{
        overflowX: "auto",
        whiteSpace: "nowrap",
        marginTop: "20px"
      }}>
        {sortedClaims.map((claim, index) => {
          //const imgUrl = convertDriveUrl(claim.bookmark_image_url);
          return (
            <div key={index} style={{ display: "inline-block", textAlign: "center" }}>
              <img
                key={index}
                src={claim.bookmark_image_url}
                alt={claim.full_name}
                style={{
                  height: "85vh",
                  objectFit: "cover",
                  marginRight: "10px",
                  cursor: "pointer",
                  borderRadius: "8px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                  scrollSnapAlign: "center"
                }}
                onClick={() => setSelectedClaim(claim)}
              />
              <h3 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.3rem' }}>
                {claim.stage_name}, {calculateAge(claim.dob)}
              </h3>
            </div>
          );
        })}
      </div>

      {/* Modal for Claim Details */}
      {selectedClaim && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000
          }}
          onClick={() => setSelectedClaim(null)}
        >
          <div style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            maxWidth: "90%",
            maxHeight: "80%",
            overflowY: "auto"
          }}>

            <div className="modal-grid">
              <div className="modal-details">
                {/* Pin Button */}
                <button
                  onClick={() => {
                    if (pinnedClaims.includes(selectedClaim)) {
                      setPinnedClaims(pinnedClaims.filter(claim => claim !== selectedClaim));
                    } else {
                      setPinnedClaims([selectedClaim, ...pinnedClaims]);
                    }
                    setSelectedClaim(null); // Close modal after pinning/unpinning
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: pinnedClaims.includes(selectedClaim) ? '#f44336' : '#465362', // red for unpin, charcoal for pin
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    marginTop: '10px'
                  }}
                >
                  {pinnedClaims.includes(selectedClaim) ? 'UNPIN' : 'PIN'}
                </button>

                {/* Modal */}
                <h2 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '1.5rem' }}>{selectedClaim.full_name}</h2>
                <p><strong>Stage Name:</strong> {selectedClaim.stage_name}</p>
                <p><strong>Height:</strong> {selectedClaim.height_cm} cm</p>
                <p><strong>Hair Color:</strong> {selectedClaim.hair_color}</p>
                <p><strong>Date of Birth:</strong> {selectedClaim.dob}</p>
                <p><strong>Place of Birth:</strong> {selectedClaim.place_of_birth}</p>
                <p><strong>Most Known For:</strong> {selectedClaim.most_known_for}</p>
                <p><strong>Tags:</strong> {selectedClaim.tags}</p>
              </div>
              <img
                src={selectedClaim.bookmark_image_url}
                alt={selectedClaim.full_name}
                //style={{ width: "100%", marginTop: "10px" }}
                className="modal-image"
              />
            </div>

            <button
              onClick={() => setSelectedClaim(null)}
              style={{
                marginTop: "10px",
                padding: "8px 16px",
                backgroundColor: "#f44336",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;