
import '../css/new/ideation.css';
import {React, useState } from 'react';



export default function Ideation() {
    console.log("Ideation component loaded");
    const [deliverableFile, setFile] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
const handleFileChangeDeliverable = (e) => {
    setFile(e.target.files[0]);
    console.log("File selected:", e.target.files[0]);
}
const handleUpload_Deliverable = async () => {
if(!deliverableFile) {
    setResponseMessage("No file selected for upload.");
    return;
}


}



    return (
        <div class="middle-pane-ideation">
                    <div class="middle-pane-content">
                        <h2>TELL ME YOUR IDEA</h2>
                        <div class="input-group">
                            <div class="file-input-wrapper">
                                <input type="file" id="inputFile" onChange={handleFileChangeDeliverable}></input>
                            </div>
                            <button id="submitIdeaButton" onClick={handleUpload_Deliverable} enabled>Submit</button>
                        </div>
                        <label for="outputText">Application Output:</label>
                        <textarea value = {responseMessage} id="outputText" class="output-display" readOnly="true">
                        </textarea>
                    </div>
                    <div class="llm-chat-input">
                        <input type="text" id="llmChatInput" placeholder="Enter your inputs here to be added to the LLM chat"></input>
                        <button id="sendChatButton">&rarr;</button>
                    </div>
        </div>
    );
}