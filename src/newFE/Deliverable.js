import '../css/new/Deliverable.css';
import React, { useState } from 'react';
import axios from 'axios';
import EpicCard from './EpicCard';
import EpicDetails from './Right_EpicDetails';
import { epicData } from './data'; // Import your mock data


export default function Deliverable() {
    console.log("Deliverable component loaded");
    const [deliverableFile, setFileDeliverable] = useState(null);
    const [filemm, setFilemm] = useState(null);
    const [responseMessage, setResponseMessage] = useState('');
    const [followOnAnswer, setFollowOnAnswer] = useState('');
    const [epics, setEpics] = useState([]);
    const [selectedEpic, setSelectedEpic] = useState(null);
    const [questions , setQuestions] = useState([]);
    const handleFileChangeDeliverable = (e) => {
        setFileDeliverable(e.target.files[0]);
        console.log("File selected:", e.target.files[0]);
    }

    const handleFileChangeMindMap = (e) => {
        setFilemm(e.target.files[0]);
        console.log("Mind map image selected:", e.target.files[0]);
    }

    const handleCardClick = (epic) => {
        setSelectedEpic(epic);
        console.log("Selected Epic:", epic.title);
    };

    const handleInputChange = (e) => {
        setFollowOnAnswer(e.target.value);
        console.log("Follow-on answer input changed:", e.target.value);
    }


    const handleUpload_AllFiles = async () => {
        setResponseMessage("Uploading files...");
        if (!deliverableFile || !filemm) {
            setResponseMessage(`No file selected for upload.`);
            return;
        }
        const formData = new FormData();
        formData.append('file', deliverableFile);
        formData.append('mindmap', filemm);
        formData.append('followOnAnswer', followOnAnswer);
        formData.append('sessionId', "NEW");


        try {
            const res = await axios.post('http://localhost:5000/api/epics/generateEpicList', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(res.data);
            console.log(res.data.message.questions);
            localStorage.setItem('sessionId  ', res.data.sessionId); // Store sessionId in localStorage for future use
            localStorage.setItem('Epics  ', res.data.message.epics); // Store epics in localStorage for future use
            setEpics(res.data.message.epics);
            setQuestions(res.data.message.questions);
            console.log( questions);
            console.log(questions.length);
            if (epics.length > 0) {
                setSelectedEpic(epics[0]);
            }
            if (questions.length > 0) {
                setResponseMessage(questions);
                console.log(responseMessage);
            } else {
                setResponseMessage("No questions generated from the deliverable and mind map.");
            }
        } catch (err) {
            console.error(err);
            setResponseMessage("Upload failed.");
        }

        // For now, just set the mock data
        // setEpics(epicData);
        // Optionally, select the first epic by default
        // if (epicData.length > 0) {
        // setSelectedEpic(epicData[0]);
        // }
    }

    const handleFollowOn_Answer = async () => {
        setResponseMessage("Processing follow-on answer...");
        if (!deliverableFile || !filemm) {
            setResponseMessage(`No file selected for upload.`);
            return;
        }
        const formData = new FormData();
        if (!followOnAnswer) {
            setResponseMessage("Please enter a follow-on answer.");
            return;
        }
        formData.append('file', deliverableFile);
        formData.append('mindmap', filemm);
        formData.append('followOnAnswer', followOnAnswer);
        formData.append('sessionId', localStorage.getItem("sessionId"));

        try {
            const res = await axios.post('http://localhost:5000/api/epics/generateEpicList', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setEpics(res.data.message.epics);
            setQuestions(res.data.message.questions)
            if (questions > 0) {
                setResponseMessage(questions);
                if (epics.length > 0) {
                    setSelectedEpic(epics[0]);
                }
            } else {
                setResponseMessage("No questions generated from the deliverable and mind map.");
                setEpics(res.data.message.epics);
                if (epics.length > 0) {
                    setSelectedEpic(epics[0]);
                }
            }
            localStorage.setItem('sessionId', res.data.sessionId); // Store sessionId in localStorage for future use   
        } catch (err) {
            console.error(err);
            setResponseMessage("Upload failed.");
        }
    }

    return (
        <div className="pane-container">
            <div className="middle-pane-deliverable">
                <div className="middle-pane-content">
                    <h2>DELIVERABLE ANALYSIS</h2>
                    <div class="input-group">
                        <div class="file-input-wrapper">
                            <div class="section">
                                <label for="inputFile">Add deliverable file (.pdf, .docx, .txt)</label>
                                <input type="file" id="inputFile1" onChange={handleFileChangeDeliverable}></input>
                            </div>
                            <div class="section">
                                <label for="inputFile2">Add mind map image (.png, .jpeg)</label>
                                <input type="file" id="inputFile2" onChange={handleFileChangeMindMap}></input>
                            </div>
                        </div>
                    </div>
                    <div class="button-wrapper">
                        <button id="submitIdeaButton" onClick={handleUpload_AllFiles} enabled>Submit</button>
                    </div>
                    <div class="response-display">
                        <label for="outputText">LLM Asks:</label>
                        <textarea value={"Questions :\n" + responseMessage} id="outputText" class="output-display" readOnly="true" scrollable="true">
                        </textarea>
                        <div class="epic-cards-section">
                            {epics.length > 0 ? (
                                epics.map((epic) => (
                                    <EpicCard
                                        key={epic.id} // Important for React list rendering performance
                                        epic={epic}
                                        onCardClick={handleCardClick}
                                        isActive={selectedEpic && selectedEpic.id === epic.id}
                                    />
                                ))
                            ) : (
                                <p style={{ textAlign: 'center', color: '#666' }}>No epics found.</p>
                            )}
                        </div>
                    </div>
                </div>
                <div class="llm-chat-input">
                    <input type="text" id="llmChatInput" placeholder="Enter your inputs here to be added to the LLM chat" onChange={handleInputChange}></input>
                    <button id="sendChatButton" onClick={handleFollowOn_Answer}>&rarr;</button>
                </div>
            </div>
            <div class="right-pane">
                <EpicDetails epic={selectedEpic} />
            </div>
        </div>
    );
}