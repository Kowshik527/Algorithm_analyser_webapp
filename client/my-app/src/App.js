import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [metrics, setMetrics] = useState(null);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    // Perform login check here
    if (username === 'admin' && password === 'password') {
      setLoggedIn(true);
      setUsername('');
      setPassword('');
    } else {
      alert('Invalid username or password.');
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    axios.post('http://localhost:5000/upload', formData)
      .then(response => {
        setStatus(response.data.status);
        setMetrics(JSON.parse(response.data.model_metrics));
      })
      .catch(error => console.error(error));
  };

  return (
    <div >
      {loggedIn ? (
        <div className='cardname'>
          <h1>Algorithm Analysis</h1>
          <form onSubmit={handleFileSubmit}>
            <div className="form-group">
              <label htmlFor="file-input">Select a CSV file:</label>
              <input type="file" id="file-input" accept=".csv" onChange={handleFileChange} />
            </div>
            <button type="submit" className="btn btn-primary" >Upload</button>
          </form>
          {status === 'success' && (
            <div>
              <h2>Model Metrics</h2>
              <table>
                <thead>
                  <tr>
                    <th>Model</th>
                    <th>R2</th>
                    <th>RMSE</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map(metric => (
                    <tr key={metric.Model}>
                      <td>{metric.Model}</td>
                      <td>{metric.R2}</td>
                      <td>{metric.RMSE}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="card">
          <h1 >Login</h1>
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label htmlFor="username-input">Username:</label>
              <input type="text" id="username-input" value={username} onChange={handleUsernameChange} />
            </div>
            <div className="form-group">
              <label htmlFor="password-input">Password:</label>
              <input type="password" id="password-input" value={password} onChange={handlePasswordChange} />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
