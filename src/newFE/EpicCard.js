import React from 'react';
import '../css/new/epicCard.css'; // Assuming you have a CSS file for styling

export default function EpicCard({ epic, onCardClick, isActive }) {

    return (
        <div className='epic-card-wrapper' active={isActive ? 'true' : 'false'} >
            <div className='epicCard-grid-container' onClick={() => onCardClick(epic)}>
                <h5>{epic.name})</h5>
                <p>
                    {epic.summary.substring(0, 20)}...
                </p>
            </div>
        </div>
    );
}