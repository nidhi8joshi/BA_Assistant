import '../css/new/Refinement.css';
import CollapsibleGrid from './Narrative_creation/Narrative_Collapsable';
import React, { useState } from 'react';
import EpicItem from './Narrative_creation/Narrative_EpicSection';
import axios from 'axios';

export default function Refinement() {
    const [followOnAnswer, setFollowOnAnswer] = useState('');
    const [epics, setEpics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [responseMessage, setResponseMessage] = useState('');
    const [questions , setQuestions] = useState([]);

    const handleInputChange = (e) => {
        setFollowOnAnswer(e.target.value);
        // console.log("Follow-on answer input changed:", e.target.value);
    }
    const handleFollowOn_Answer = async () => {
        try {
            setLoading(true); // Set loading to true when starting fetch
            setError(null);   // Clear any previous errors
            const formData = new FormData();
            formData.append('sessionId', localStorage.getItem('sessionId'));
            formData.append('followOnAnswer', followOnAnswer);
            const res = await axios.post('http://localhost:5000/api/narrative/generateNarratives', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(res.data.message.epics);
            setEpics(res.data.message.epics);
            setQuestions(res.data.message.questions);
            if (questions.length > 0) {
               setResponseMessage(questions);
                console.log(responseMessage);
            } else {
                setResponseMessage("No questions generated for narrative creation");
            }
        }
        catch (error) {
            // console.error("Error fetching epic list:", error);
            setError("Failed to load epic list. Please try again.");
        } finally {
            setLoading(false);
            if (loading) {
                return <div style={loadingStyles}>Loading epics and stories...</div>;
            }

            if (error) {
                return <div style={{ ...loadingStyles, color: 'red' }}>Error: {error}</div>;
            }
        }

    };

    const loadingStyles = {
        textAlign: 'center',
        padding: '20px',
        color: '#666',
    };

    const gridContainerStyles = {
        maxWidth: '800px',
        margin: '30px auto',
        padding: '20px',
        backgroundColor: '#f8f8f8',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    };


    return (
            <div className="middle-pane-refinement">
                <div className="middle-pane-content">
                    <h2>REQUIREMENT REFINEMENT</h2>
                    {/* <CollapsibleGrid epics={data} loading={loading} error={error} /> */}
                    <label for="outputText">LLM Asks:</label>
                    <textarea value={"Questions :\n" + responseMessage} id="outputText" class="output-display" readOnly="true" scrollable="true">
                    </textarea>
                    <div style={gridContainerStyles}>
                        <h3 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Epic & Story Breakdown</h3>
                        {
                            epics.map((epic) => (
                                <EpicItem key={epic.id} epic={epic} />
                            ))
                        }
                    </div>
                    <div class="llm-chat-input">
                        <input type="text" id="llmChatInput" placeholder="Enter your inputs here to be added to the LLM chat" onChange={handleInputChange}></input>
                        <button id="sendChatButton" onClick={handleFollowOn_Answer} disabled={loading} > {loading ? 'Refreshing...' : 'Generate Narratives'}</button>
                    </div>
                </div>
            </div>
    );
}