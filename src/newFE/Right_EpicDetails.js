// EpicDetails.js
import React from 'react';

function EpicDetails({ epic }) {
  if (!epic) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        <h2>Select an Epic to View Details</h2>
        <p>Click on any epic card in the middle pane to see its full information here.</p>
      </div>
    );
  }

  const statusBadgeStyle = {
    fontSize: '0.9em',
    padding: '6px 12px',
    borderRadius: '5px',
    fontWeight: 'bold',
    color: 'white',
    display: 'inline-block',
    marginTop: '10px'
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h2 style={{ marginBottom: '10px' }}>{epic.name}</h2>
      <p><strong>Summary:</strong> {epic.summary}</p>

      <p><strong>Feature:</strong></p>
      {
        // epic.fearures.map((item)=> {
        //   <p>{item}</p> 
        // })

        epic.features ? <p>{epic.features}</p> : <p style={{ color: '#999' }}>No feature specified</p>
      }
    </div>
  );
}

export default EpicDetails;