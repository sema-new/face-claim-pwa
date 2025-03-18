import { useState } from "react";

function JsonEditor() {
  const [jsonData, setJsonData] = useState([
    {
      full_name: "Alex Pettyfer",
      most_known_for: "I Am Number Four",
      image_url: "https://www.dropbox.com/s/sample/alex.jpg?raw=1"
    }
  ]);

  // Handle editing JSON text directly
  const handleJsonChange = (e) => {
    try {
      const parsed = JSON.parse(e.target.value);
      setJsonData(parsed);
    } catch {
      // Invalid JSON - ignore or show error
    }
  };

  // Add a new face claim
  const addNewClaim = () => {
    setJsonData([...jsonData, { full_name: "", most_known_for: "", image_url: "" }]);
  };

  // Delete a face claim
  const deleteClaim = (index) => {
    const updated = [...jsonData];
    updated.splice(index, 1);
    setJsonData(updated);
  };

  // Download the current JSON
  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "face_claims.json";
    link.click();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Face Claim JSON Editor</h1>

      <button onClick={addNewClaim} style={{ marginBottom: "10px" }}>+ Add New Face Claim</button>
      <button onClick={downloadJson} style={{ marginLeft: "10px" }}>Download JSON</button>

      {/* Live JSON View */}
      <textarea
        style={{ width: "100%", height: "300px", marginTop: "20px" }}
        value={JSON.stringify(jsonData, null, 2)}
        onChange={handleJsonChange}
      />

      {/* Editable List View */}
      {jsonData.map((claim, index) => (
        <div key={index} style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}>
          <input
            type="text"
            placeholder="Full Name"
            value={claim.full_name}
            onChange={(e) => {
              const updated = [...jsonData];
              updated[index].full_name = e.target.value;
              setJsonData(updated);
            }}
          />
          <input
            type="text"
            placeholder="Most Known For"
            value={claim.most_known_for}
            onChange={(e) => {
              const updated = [...jsonData];
              updated[index].most_known_for = e.target.value;
              setJsonData(updated);
            }}
          />
          <input
            type="text"
            placeholder="Image URL"
            value={claim.image_url}
            onChange={(e) => {
              const updated = [...jsonData];
              updated[index].image_url = e.target.value;
              setJsonData(updated);
            }}
          />
          <button onClick={() => deleteClaim(index)} style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default JsonEditor;