// CollapsibleGrid.js
import React, { useState, useEffect } from 'react';
import EpicItem from './Backlog_EpicSection'; // Import the EpicItem component

const gridContainerStyles = {
    maxWidth: '800px',
    margin: '30px auto',
    padding: '20px',
    backgroundColor: '#f8f8f8',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
};

const loadingStyles = {
    textAlign: 'center',
    padding: '20px',
    color: '#666',
};

function CollapsibleGrid({ data, loading1, error1 }) {
    const [epics, setEpics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    setLoading(loading1);
    setError(error1);
    console.log("CollapsibleGrid data: " + data);
    if (loading) {
        return <div style={loadingStyles}>Loading epics and stories...</div>;
    }

    if (error) {
        return <div style={{ ...loadingStyles, color: 'red' }}>Error: {error}</div>;
    }
    setEpics(data);

    return (
        <div style={gridContainerStyles}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Epic & Story Breakdown</h1>
            {
                epics.map((epic) => (
                    <EpicItem key={epic.id} epic={epic} />
                ))
            }
        </div>
    );
}

export default CollapsibleGrid;