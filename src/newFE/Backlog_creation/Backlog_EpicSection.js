// EpicItem.js
import React, { useState } from 'react';
import StoryItem from './Backlog_StorySection'; // Import the StoryItem component

const epicItemStyles = {
    marginBottom: '20px',
    borderRadius: '8px',
    border: '1px solid #c0c0c0',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const epicHeaderStyles = {
    padding: '15px 20px',
    backgroundColor: '#e0e0e0',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: '1.2em',
    color: '#333',
};
    
const storiesContainerStyles = {
    padding: '15px',
    backgroundColor: '#f2f2f2',
    borderTop: '1px solid #d0d0d0',
};

function EpicItem({ epic }) {
    const [areStoriesOpen, setAreStoriesOpen] = useState(true); // Epic stories start open

    const toggleStories = () => {
        setAreStoriesOpen(!areStoriesOpen);
    };

    return (
        <div style={epicItemStyles}>
            {/* Epic header is always visible and clickable to toggle stories */}
            <div style={epicHeaderStyles} onClick={toggleStories}>
                <span>{epic.name}</span>
                <span>{areStoriesOpen ? '▲' : '▼'}</span>
            </div>
            
            {/* Stories container collapses */}
            {areStoriesOpen && (
                <div style={storiesContainerStyles}>
                    {epic.userStories.map((story) => (
                        <StoryItem key={story.id} story={story} />
                    ))}
                     {epic.technicalStories.map((story) => (
                        <StoryItem key={story.id} story={story}/>
                    ))}
                </div>
            )}
        </div>
    );
}

export default EpicItem;