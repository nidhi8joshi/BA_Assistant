import React, { useState } from 'react';
import '../css/new/landing.css'
import Ideation from './Ideation.js';
import Deliverable from './Deliverable.js';
import Backlog from './Backlog.js';
import Refinement from './Refinement.js';
import TestCase from './TestCase.js';
import EpicDetails from './Right_EpicDetails.js';


function Landing() {
    console.log("Landing page loaded");
    const [activeTab, setActiveTab] = useState('');

    return (
        <div className="Landing">
            <title>Landing Page</title>
            <h3>Requirement Refinement Application</h3>
            <div className="pane-container">
                <div class="left-pane">
                    {/* <button onClick={() => setActiveTab('Ideation')} className={activeTab === 'Ideation' ? 'active' : ''} >Ideation</button> */}
                    <button onClick={() => setActiveTab('Deliverable')} className={activeTab === 'Deliverable' ? 'active' : ''}>Deliverable</button>
                    <button onClick={() => setActiveTab('Backlog')} className={activeTab === 'Backlog' ? 'active' : ''}>Backlog</button>
                    <button onClick={() => setActiveTab('Refinement')} className={activeTab === 'Refinement' ? 'active' : ''}>Refinement</button>
                    {/* <button onClick={() => setActiveTab('TestCase')} className={activeTab === 'TestCase' ? 'active' : ''}>Test cases</button> */}
                </div>

                <div class="middle-pane">
                    {/* {activeTab === 'Ideation' && (
                    <Ideation/>
                    )} */}
                      {activeTab === 'Deliverable' && (
                    <Deliverable/>
                    )}
                      {activeTab === 'Backlog' && (
                    <Backlog/>
                    )}
                      {activeTab === 'Refinement' && (
                    <Refinement/>
                    )}
                      {/* {activeTab === 'TestCase' && (
                    <TestCase/>
                    )} */}
                </div>
            </div>
        </div>);
}
export default Landing;