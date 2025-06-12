// StoryItem.js
import React, { useState } from 'react';

const storyItemStyles = {
    marginBottom: '8px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    border: '1px solid #e0e0e0',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
};

const storyHeaderStyles = {
    padding: '10px 15px',
    backgroundColor: '#f5f5f5',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 'bold',
    color: '#333',
};

const storyContentStyles = {
    padding: '10px 15px',
    backgroundColor: '#fdfdfd',
    borderTop: '1px solid #eee',
};

const featureFileFieldStyles = {
    width: '100%',
    minHeight: '120px',
    padding: '10px',
    marginTop: '10px',
    backgroundColor: '#eee',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '0.9em',
    resize: 'vertical',
    boxSizing: 'border-box', // Include padding and border in the element's total width and height
    whiteSpace: 'pre-wrap', // Preserve whitespace and wrap text
};


function StoryItem({ story }) {
    const [isStoryOpen, setIsStoryOpen] = useState(false);

    const toggleStory = () => {
        setIsStoryOpen(!isStoryOpen);
    };

    return (
        <div style={storyItemStyles}>
            <div style={storyHeaderStyles} onClick={toggleStory}>
                <span>{story.title}</span>
                <span>{isStoryOpen ? '▲' : '▼'}</span>
            </div>
            {isStoryOpen && (
                <div style={storyContentStyles}>
                    <p><strong>Description:</strong></p>
                    <p>{story.description}</p>
                    <p><strong>Acceptance Criteria:</strong></p>
                    <p>{story.acceptanceCriteria}</p>
{/*                     
                    <p><strong>Feature File:</strong></p>
                    <textarea
                        readOnly // This makes the text field read-only
                        value={story.featureFile}
                        style={featureFileFieldStyles}
                    /> */}
                </div>
            )}
        </div>
    );
}

export default StoryItem;