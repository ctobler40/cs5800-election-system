import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import { useNavigate, Link } from 'react-router-dom';

function MainPage() {
  const [data, setData] = useState(null);
  const [headline, setHeadline] = useState('');
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      fetchPerson(userId);
    }
    setElectionHeadline();
  }, [userId]);

  // Fetch person data if logged in
  const fetchPerson = (accountID) => {
    axios.get(`http://localhost:6565/api/data/person/${accountID}`)
      .then(response => setData(response.data[0]))
      .catch(error => console.error('Error fetching data:', error));
  };

  // Mock fetching of an election headline
  const setElectionHeadline = () => {
    const headlines = [
      "Record Voter Turnout Expected!",
      "Close Race as Candidates Reach Final Stretch",
      "Independents Shake Up the 2024 Election!"
    ];
    const randomHeadline = headlines[Math.floor(Math.random() * headlines.length)];
    setHeadline(randomHeadline);
  };

  // Logout functionality
  const LogOut = () => {
    localStorage.removeItem('userId');
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="main-page">
      <h1>Elections of 2024</h1>

      {/* Display election headlines */}
      <section className="headline-section">
        <h2>Latest Update</h2>
        <p className="headline">{headline}</p>
      </section>

      {/* Welcome or login prompt */}
      <div className="welcome-section">
        {userId && data ? (
          <div>
            <h2>Welcome, {data.firstName} {data.lastName}</h2>
          </div>
        ) : (
          <div>
            {console.log(data)}
            <h2>Welcome to the 2024 Elections Portal</h2>
          </div>
        )}
      </div>

      {/* Quick links section */}
      <section className="quick-links">
        <div className="quick-links-container">
          {/* Link to account page if logged in, login otherwise */}
          {userId ? (
            <>
              <button className="button" onClick={LogOut}>Logout</button>
              {/* Link to election results */}
              <Link to="/results">
                <button className="button">
                  View Election Results
                </button>
              </Link>
            </>
          ) : (
            <Link to="/login">
              <button className="button">Login</button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

export default MainPage;
