    // UI - Header Version 1 
    return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        {showHeader && !selectedClaim && (
            /* header div */
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

                {/* Reload Button */}
                <button onClick={fetchData} style={{
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: '#82A3A1', // cambridge blue //'#4CAF50', old green
                  color: '#fff',
                  cursor: 'pointer'
                }}><b>RELOAD</b></button>

                {/* Hair Color Filter */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                  {hairColors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setHairFilter(color)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: hairFilter === color ? '#555' : '#eee',
                        color: hairFilter === color ? '#fff' : '#333',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {color}
                    </button>
                  ))}
                  <button
                    onClick={() => setHairFilter("")}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#f44336',
                      color: '#fff',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Reset Hair Filter
                  </button>
                </div>

                {/* Tag Filter */}
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
                        border: '1px solid #9FC490', // olivine // #ccc 
                        backgroundColor: selectedTags.includes(tag) ? '#9FC490' : '#fff', /// #4CAF50
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
        {/* end of header div */}
        {/* Hide Header Button */}
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
        {/* Pin Button */}
        <button
          onClick={() => {
            if (!pinnedClaims.includes(selectedClaim)) {
              setPinnedClaims([selectedClaim, ...pinnedClaims]);
            }
            setSelectedClaim(null); // Close modal after pinning
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#465362', // charcoal
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            marginTop: '10px'
          }}
        >
          PIN
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