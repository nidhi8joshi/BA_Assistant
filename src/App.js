import React, { useState } from 'react';
import './css/App.css';
import axios from 'axios';

function App() 
{
  const [activeTab, setActiveTab] = useState('');
  const [featurefile, setFile] = useState(null);
  const [mindmap, setmmFile] = useState(null);

  const [responseMessage, setResponseMessage] = useState('');


  const handleFileChangeFeature = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileChangeMindMap = (e) => {
    setmmFile(e.target.files[0]);
  };



  const handleUpload = async () => {
    if (!featurefile) {
      setResponseMessage("Please select a file first.");
      return;
    }
    const formData = new FormData();
    formData.append('file', featurefile);
    try {
      const res = await axios.post('http://localhost:5000/api/evaluateStory', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res.data);
      const data = await res.data;
      setResponseMessage(data.message || 'Upload successful!');
    } catch (err) {
      console.error(err);
      setResponseMessage("Upload failed.");
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>BA Assistant</h1>
        <nav>
          <button onClick={() => setActiveTab('RefReq')} className={activeTab === 'RefReq' ? 'active' : ''}>
            Refine Requirement
          </button>
          <button onClick={() => setActiveTab('RQS')} className={activeTab === 'RQS' ? 'active' : ''}>
            Requirement Score
          </button>
          <button onClick={() => setActiveTab('JIRA')} className={activeTab === 'JIRA' ? 'active' : ''}>
            Jira Integration
          </button>
        </nav>
      </header>

      <main>
        {activeTab === 'RefReq' && (
            <div>
              <h2>Welcome to the Refine Requirement Tab</h2>
              <p>Add your mindmap file to refine your requirement.</p>
              <div>
                <input type="file" onChange={handleFileChangeMindMap} />
                <button onClick={handleUpload} style={{ marginLeft: 10 }}>Submit</button>
                <p style={{ marginTop: 20 }}>{responseMessage}</p>
              </div>
            </div>
          )
        }

        {activeTab === 'RQS' && (
          <div>
            <h2>Welcome to the Home Tab</h2>
            <p>Add your feature files to rate your requirement.</p>
            <div>
              <h2>Upload Section</h2>
              <input type="file" onChange={handleFileChangeFeature} />
              <button onClick={handleUpload} style={{ marginLeft: 10 }}>Submit</button>
              <p style={{ marginTop: 20 }}>{responseMessage}</p>
            </div>
          </div>
        )}

        {activeTab === 'JIRA' && (
          <div>
            <h2>Upload Section for Jira</h2>
            {/* <input type="file" onChange={handleFileChange} /> */}
            {/* <button onClick={handleUpload} style={{ marginLeft: 10 }}>Submit</button> */}
            <p style={{ marginTop: 20 }}>{responseMessage}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
