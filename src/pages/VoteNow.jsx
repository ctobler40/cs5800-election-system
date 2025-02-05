import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import { useNavigate, Link } from 'react-router-dom';

function VoteNow() {
  const [data, setData] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [myInformation, setMyInformation] = useState([]);
  const [canVote, setCanVote] = useState(false);
  const [voted, setVoted] = useState(false);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [currentRace, setCurrentRace] = useState(2);  // state for current race
  const [raceType, setRaceType] = useState(1);
  const [races, setRaces] = useState([]);  // to store races from the server
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  // Fetch candidates based on the current race and race type
  const fetchCandidates = () => {
    if (raceType === 1) {
      // Presidential
      axios
        .get(`http://localhost:6565/api/data/candidate/president`)
        .then((response) => {
          const filteredCandidates = response.data.filter((item) => item.party !== '-');
          setData(filteredCandidates);
          console.log(response.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    } else if (raceType === 2) {
      // Government
      axios
        .get(`http://localhost:6565/api/data/candidate/governer/${userId}`)
        .then((response) => {
          const filteredCandidates = response.data.filter((item) => item.party !== '-');
          setData(filteredCandidates);
          console.log(response.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    } else if (raceType === 3) {
      // House of Reps
      axios
        .get(`http://localhost:6565/api/data/candidate/house/${userId}`)
        .then((response) => {
          const filteredCandidates = response.data.filter((item) => item.party !== '-');
          setData(filteredCandidates);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  };

  // Fetch races from the server
  const fetchRaces = () => {
    axios
      .get('http://localhost:6565/api/data/races')
      .then((response) => {
        setRaces(response.data);
      })
      .catch((error) => {
        console.error('Error fetching races:', error);
      });
  };

  // Fetch user's voting availability
  const fetchVoteAvailability = (personID) => {
    axios
      .get(`http://localhost:6565/api/data/person/can-vote/${personID}`)
      .then((response) => {
        setMyInformation(response.data);
      })
      .catch((error) => {
        console.error('Error fetching availability:', error);
      });
  };

  // Fetch the type of race based on the current race
  const fetchRaceType = (currentRace) => {
    axios
      .get(`http://localhost:6565/api/race_type/${currentRace}`)
      .then((response) => {
        setRaceType(response.data[0].raceType);
      })
      .catch((error) => {
        console.error('Error fetching race type:', error);
      });
  };

  // Submit a vote
  const submitVote = (candidateId) => {
    axios
      .put(`http://localhost:6565/api/updateVote/${userId}`, {
        vote_id: candidateId,
        race_id: currentRace,
      })
      .then(() => {
        setIsVoteModalOpen(false);
        navigate('/');
      })
      .catch((error) => {
        console.error('Error updating vote:', error);
      });
  };

  // Set voting eligibility and status
  useEffect(() => {
    if (Array.isArray(myInformation)) {
      console.log('myInformation:', myInformation);
      if (myInformation.length > 0) {
        // Find the race that matches the currentRace
        const myRace = myInformation.find((info) => info.race_id === currentRace);
  
        if (myRace) {
          console.log('Found myRace:', myRace);
          setCanVote(new Date(myRace.voteDay) < new Date(date));
          setVoted(myRace.vote_id !== 1);
        } else {
          console.warn('No matching race found for currentRace:', currentRace);
          setCanVote(false);
          setVoted(false);
        }
      } else {
        setCanVote(false);
        setVoted(false);
      }
    } else {
      console.error('myInformation is not an array:', myInformation);
      setCanVote(false);
    }
  }, [myInformation, date, currentRace]);
  
  // Fetch candidates and user information on mount
  useEffect(() => {
    fetchCandidates();
    fetchRaces();  // Fetch races from the server
    if (userId) {
      fetchVoteAvailability(userId);
    }

    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [userId, currentRace, raceType]); // Re-fetch when currentRace or raceType changes

  // Fetch race type after currentRace changes
  useEffect(() => {
    fetchRaceType(currentRace);
  }, [currentRace]); // This ensures fetchRaceType is called after currentRace updates

  return (
    <div className="candidates-page">
      <h1>
        {userId === null
          ? 'Please Login to Vote!'
          : canVote
          ? 'Vote Now!'
          : `Sorry. You cannot vote until ${
              myInformation.length > 0 ? new Date(myInformation[0].voteDay).toLocaleString() : 'an unknown date'
            }`}
      </h1>

      {/* Display the current race */}
      <div>
        <h3>
          Current Race:{' '}
          {races.find((race) => race.id === currentRace)?.raceName || 'None'}
        </h3>
      </div>

      {/* Buttons to switch races */}
      <div>
        <button
          onClick={() => {
            if (currentRace > 2) setCurrentRace(currentRace - 1);
            else setCurrentRace(races.length);  // Loop back to last race
          }}
          className="button2"
        >
          Prev Race
        </button>

        <button
          onClick={() => {
            if (currentRace < races.length) setCurrentRace(currentRace + 1);
            else setCurrentRace(2);  // Loop back to first race
          }}
          className="button2"
        >
          Next Race
        </button>
      </div>

      {/* Display candidates */}
      <div className="card-container">
        {Array.isArray(data) &&
          data.map((item) => (
            <div
              key={item.id}
              className={`card-item ${selectedCandidate && selectedCandidate.id === item.id ? 'highlighted' : ''}`}
              onClick={() => {
                setSelectedCandidate(item);
                setIsVoteModalOpen(true);
              }}
            >
              <div className="card-header">
                <h3>
                  {item.firstName} {item.lastName}
                </h3>
                <span className="party-badge">({item.party})</span>
              </div>
            </div>
          ))}
      </div>

      {/* Modal for voting */}
      {isVoteModalOpen && selectedCandidate && (
        <div className="modal-overlay" onClick={() => setIsVoteModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setIsVoteModalOpen(false)}>
              X
            </button>
            <h2>
              {selectedCandidate.firstName} {selectedCandidate.lastName}
            </h2>
            <p>
              <strong>Party:</strong> {selectedCandidate.party}
            </p>
            {userId !== null && !voted ? (
              <button className="button2" onClick={() => submitVote(selectedCandidate.id)}>
                Vote for {selectedCandidate.firstName} {selectedCandidate.lastName}
              </button>
            ) : (
              <div className="button2">Cannot Vote</div>
            )}
          </div>
        </div>
      )}

      {/* Message for already voted */}
      {userId !== null && voted && (
        <div>
          <h2>Looks like you have already voted!</h2>
          <button className="button" onClick={() => navigate('/results')}>
            Click here to see the results!
          </button>
        </div>
      )}

      {/* Message for login/register */}
      {userId === null && (
        <div>
          <Link to="/login">
            <button className="button">Login</button>
          </Link>
          <Link to="/register">
            <button className="button">Register</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default VoteNow;
