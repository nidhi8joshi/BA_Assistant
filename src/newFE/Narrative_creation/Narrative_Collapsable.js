// CollapsibleGrid.js
import React, { useState, useEffect } from 'react';
import EpicItem from './Narrative_EpicSection'; // Import the EpicItem component
import { epicStoryData } from '../data'; // Import your mock data

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

function CollapsibleGrid() {
    const [epics, setEpics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        // Simulate data fetching
        const fetchData = async () => {
            try {
                // In a real app: const response = await fetch('/api/epics-and-stories');
                // const data = await response.json();
                // setEpics(data);

                // For this example, just use the imported mock data
                setEpics(epicStoryData);
                setLoading(false);
            } catch (err) {
                setError('Failed to load epic and story data.');
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array means this runs once on mount

    if (loading) {
        return <div style={loadingStyles}>Loading epics and stories...</div>;
    }

    if (error) {
        return <div style={loadingStyles}>Error: {error}</div>;
    }

    return (
        <div style={gridContainerStyles}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Epic & Story Breakdown</h1>
            {epics.length === 0 ? (
                <div style={loadingStyles}>No epics found.</div>
            ) : (
                epics.map((epic) => (
                    <EpicItem key={epic.id} epic={epic} />
                ))
            )}
        </div>
    );
}

export default CollapsibleGrid;