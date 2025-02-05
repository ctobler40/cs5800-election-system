import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';
import ProfileRequestForm from './request/ProfileRequestForm';

function Account() {
  const [data, setData] = useState(null);
  const [votes, setVotes] = useState([]);
  const [requests, setRequests] = useState([]);
  const [cp, setCP] = useState(false); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    } else {
      fetchPerson(userId);
      fetchRequests(userId);
    }
  }, [userId, navigate]);

  const fetchPerson = (accountID) => {
    axios.get(`http://localhost:6565/api/data/person/${accountID}`)
      .then(response => {
        const personData = response.data[0]; // The user's main account information
        const votesData = response.data.map((item) => ({
          raceName: item.raceName,
          candidateFirstName: item.candidateFirstName,
          candidateLastName: item.candidateLastName,
          party: item.party,
        }));
  
        setData(personData); // Set main account information
        setVotes(votesData); // Set only race and candidate information for votes
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };  

  const fetchRequests = (accountID) => {
    axios.get(`http://localhost:6565/api/user_requests/id/${accountID}`)
      .then(response => {
        console.log(response)
        setRequests(response.data);
      })
      .catch(error => {
        console.error('Error fetching requests:', error);
      });
  };

  const updatePassword = (newPassword) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(newPassword)) {
      setError("Password must be at least 8 characters long and include 1 capital letter and 1 special character.");
      return;
    }
    axios.put(`http://localhost:6565/api/updatePassword/${userId}`, { password: newPassword })
      .then(() => {
        setCP(false);
        setPassword('');
        setError('');
        window.location.reload();
      })
      .catch(error => {
        console.error('Error updating password:', error);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="account-page">
      <h1>My Account</h1>  
      
      {data ? (
        <div className="account-info-container">
          {/* Basic Information Section */}
          <div className='card-container'>
            <div className='card-item'>
              <section className="listing">
                <h2>Basic Information</h2>
                <p><strong>Name:</strong> {data.firstName} {data.lastName}, {data.age} years old</p>
                <p><strong>Email:</strong> {data.email}</p>
                <h2>Address</h2>
                <p>{data.streetName}, {data.townName}, {data.abbr} {data.zipCode}</p>
              </section>
            </div>

            <div className='card-item'>
              {/* Voting Information Section */}
              <section className="listing">
                <h2>Voting Information</h2>
                {votes.length > 0 ? (
                  votes.map((vote, index) => (
                    <div key={index}>
                      {vote.party === '-' ? (
                        <div>
                          <p><strong>{vote.raceName}:</strong> You have not voted yet.</p>
                        </div>
                      ) : (
                        <p>
                          <strong>{vote.raceName}:</strong> {vote.candidateFirstName} {vote.candidateLastName} ({vote.party})
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No voting information available.</p>
                )}
                <Link to='/my-vote' className="button-link">Vote here!</Link>
              </section>
            </div>

            <div className='card-item'>
              {/* Password Management Section */}
              <section className="listing">
                <h2>Account Security</h2>
                {!cp ? (
                  <section>
                    <button className="button" onClick={() => setCP(true)}>Change Password</button>
                    <button className="button logout-button" onClick={handleLogout}>Logout</button>
                  </section>
                ) : (
                  <div className="password-change">
                    <p>Enter your new password:</p>
                    {error && <p className="error-message">{error}</p>}
                    <input 
                      type="password" 
                      placeholder="New Password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field"
                    />
                    <button className="button" onClick={() => updatePassword(password)}>Set New Password</button>
                    <button className="button logout-button" onClick={() => setCP(false)}>Cancel</button>
                  </div>
                )}
              </section>
            </div>
          </div>

          {data.admin ? (
              <Link to="/pending-request">
                <button className='button2'>Approve Profile Requests</button>
              </Link>
            ) : ''}

          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div>
              {!data.admin ? (
                <div>
                  <h3>My Requests</h3>
                  <table className="info-table">
                    <thead>
                      <tr>
                        <th>Request #</th>
                        <th>Email</th>
                        <th>Document 1</th>
                        <th>Document 2</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.length > 0 ? (
                        requests.map((req) => (
                          <tr key={req.id}>
                            <td>{req.id}</td>
                            <td>{req.email}</td>
                            <td>{req.document_type_1}</td>
                            <td>{req.document_type_2}</td>
                            <td>{req.request_status}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center' }}>
                            No pending requests found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="login-prompt">
          <h2>You are currently not logged in</h2>
          <Link to='/login'>
            <button className="button">Please Log In</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Account;
