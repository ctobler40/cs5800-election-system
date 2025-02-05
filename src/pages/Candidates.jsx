import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddCand from './sql/AddCand'; // Import AddCand component
import DeleteCand from './sql/DeleteCand';
import '../App.css';

function Candidates() {
  const [currentRace, setCurrentRace] = useState(2); // Current race ID
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // These values are for displaying election information
  const [data, setData] = useState([]);
  const [races, setRaces] = useState([]);
  const [raceType, setRaceType] = useState(1);
  const [raceActive, setRaceActive] = useState(true);

  // These values are for editing election / candidate information
  const [isEditing, setIsEditing] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State to toggle AddCand modal
  const [isCreateRaceModalOpen, setIsCreateRaceModalOpen] = useState(false); // State for "Create Race" modal

  // These values are all for creating new races
  const [newRaceName, setNewRaceName] = useState(''); // State for new race name
  const [newRaceType, setNewRaceType] = useState(1); // State for new race name
  const [newRaceElectionDate, setNewRaceElectionDate] = useState('2024-11-05');

  // These values are for gathering user information
  const [userData, setUserData] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem('userId')); // Store userId in state

  // For managing admins
  const [admins, setAdmins] = useState([]);
  const [newRaceAdmin, setNewRaceAdmin] = useState('');

  // Fetch races from the database
  const fetchRaces = () => {
    axios
      .get('http://localhost:6565/api/data/races')
      .then((response) => {
        setRaces(response.data);
      })
      .catch((error) => console.error('Error fetching races:', error));
  };

  const deactivateRace = (id) => {
    axios.put(`http://localhost:6565/api/updateRace/${id}`, {
      // Deactivate race here
      isActive: false
    }).then(response => {
      // Anything to run after updating person?
      window.location.reload();
    }).catch(error => {
      console.error('Error updating admin permission:', error);
    });
  };

  const activateRace = (id) => {
    axios.put(`http://localhost:6565/api/updateRace/${id}`, {
      // Deactivate race here
      isActive: true
    }).then(response => {
      // Anything to run after updating person?
      window.location.reload();
    }).catch(error => {
      console.error('Error updating admin permission:', error);
    });
  };

  // Fetch user data based on accountID (userId)
  const fetchPerson = (accountID) => {
    if (!accountID) return; // If no accountID, don't fetch data

    axios
      .get(`http://localhost:6565/api/data/person/${accountID}`) // Backend API route
      .then((response) => {
        setUserData(response.data[0]);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  // Fetch candidates based on the current race
  const fetchCandidates = () => {
    if (raceType == 1) {
      axios
      .get(`http://localhost:6565/api/data/candidate/president`) // Use currentRace to fetch candidates
      .then((response) => {
        const filteredCandidates = response.data.filter((item) => item.party !== '-');
        setData(filteredCandidates);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    } else if (raceType == 2) {
      axios
      .get(`http://localhost:6565/api/data/candidate/governer`) // Use currentRace to fetch candidates
      .then((response) => {
        const filteredCandidates = response.data.filter((item) => item.party !== '-');
        setData(filteredCandidates);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    } else if (raceType == 3) {
      axios
      .get(`http://localhost:6565/api/data/candidate/house`) // Use currentRace to fetch candidates
      .then((response) => {
        const filteredCandidates = response.data.filter((item) => item.party !== '-');
        setData(filteredCandidates);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    }
  };

  const fetchRaceType = (currentRace) => {
    axios
      .get(`http://localhost:6565/api/race_type/${currentRace}`)
      .then((response) => {
        setRaceType(response.data[0].raceType);
        console.log(response.data)
        setRaceActive(response.data[0].isActive);
      })
      .catch((error) => {
        console.error('Error fetching race type:', error);
      });
  };

  const fetchAdmins = () => {
    axios.get('http://localhost:6565/api/data/admins')
      .then((response) => {
        setAdmins(response.data);
      })
      .catch((error) => console.error('Error fetching admins:', error));
  };
  
  useEffect(() => {
    if (isCreateRaceModalOpen) {
      fetchAdmins();
    }
  }, [isCreateRaceModalOpen]);  

  useEffect(() => {
    fetchRaces();
    fetchPerson(userId); // Fetch user data
  }, [userId, raceType]);

  useEffect(() => {
    fetchCandidates(); // Fetch candidates whenever raceType changes
  }, [currentRace, raceType]);

  useEffect(() => {
    fetchRaceType(currentRace);
  }, [currentRace]); // This ensures fetchRaceType is called after currentRace updates

  // Group candidates by party
  const groupedCandidates = {
    R: data.filter((candidate) => candidate.party === 'R'),
    D: data.filter((candidate) => candidate.party === 'D'),
    I: data.filter((candidate) => candidate.party === 'I'),
  };

  const handleSave = (selectedCandidate, updatedInfo) => {
    axios
      .put(`http://localhost:6565/api/updateCandidate/${selectedCandidate.id}`, {
        firstName: selectedCandidate.firstName,
        lastName: selectedCandidate.lastName,
        party: selectedCandidate.party,
        information: updatedInfo,
      })
      .then(() => {
        // Update the local state with the updated candidate
        setData((prevData) =>
          prevData.map((candidate) =>
            candidate.id === selectedCandidate.id
              ? { ...candidate, information: updatedInfo } // Update only the information
              : candidate
          )
        );

        // Update the selected candidate with new information
        setSelectedCandidate((prevSelected) => ({
          ...prevSelected,
          information: updatedInfo,
        }));

        setIsEditing(false); // Exit edit mode
      })
      .catch((error) => console.error('Error updating candidate:', error));
  };

  // Handle the creation of a new race
const handleCreateRace = () => {
  if (!newRaceName.trim() || !newRaceAdmin) {
    return alert('Race name and admin are required');
  }

  axios
    .post('http://localhost:6565/api/race', {
      race_name: newRaceName,
      race_type: newRaceType,
      election_date: newRaceElectionDate
    })
    .then((response) => {
      const newRaceId = response.data.requestId;

      // Update the poll_station of the selected admin
      axios
        .put(`http://localhost:6565/api/updatePerson/poll/${newRaceAdmin}`, {
          poll_station: newRaceId,
        })
        .then(() => {
          console.log(`Poll station for admin ID ${newRaceAdmin} updated to ${newRaceId}`);
        })
        .catch((error) => {
          console.error('Error updating admin poll station:', error);
          alert('Failed to update admin poll station');
        });


      // Update the current race and reset modal
      setCurrentRace(newRaceId);
      addNewPollVotes(newRaceId);
      setIsCreateRaceModalOpen(false);
      setNewRaceName('');
      setNewRaceAdmin('');
    })
    .catch((error) => {
      console.error('Error creating new race:', error);
      alert('Failed to create new race');
    });
};

  // Add all voting information
  const addNewPollVotes = (id) => {
    // First make sure that all information is filled out
    axios.post(`http://localhost:6565/api/votes/newPoll/${id}`, {
      // Adding votes
    })
    .then(() => {
      console.log('Votes submitted successfully.');
    })
    .catch((error) => console.error('Error submitting request:', error));
  };

  return (
    <div className="candidates-page">
      <h1>
        Current Race:{' '}
        {races.find((race) => race.id === currentRace)?.raceName || 'None'}
      </h1>
      <button
        onClick={() => {
          if (currentRace > 2) setCurrentRace(currentRace - 1);
          else setCurrentRace(races.length);
        }}
        className="button2"
      >
        Prev Race
      </button>

      <button
        onClick={() => {
          if (currentRace < races.length) setCurrentRace(currentRace + 1);
          else setCurrentRace(2);
        }}
        className="button2"
      >
        Next Race
      </button>

      {/* Modal for creating a new race */}
      {isCreateRaceModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateRaceModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setIsCreateRaceModalOpen(false)}>
              X
            </button>
            <h2>Create New Race</h2>

            {/* Input for Race Name */}
            <input
              type="text"
              placeholder="Enter Race Name"
              value={newRaceName}
              onChange={(e) => setNewRaceName(e.target.value)}
            />
            <br /><br />

            {/* Dropdown for Race Type */}
            <label htmlFor="raceType">Race Type:</label>
            <select
              id="raceType"
              value={newRaceType}
              onChange={(e) => setNewRaceType(parseInt(e.target.value, 10))}
              className="dropdown"
            >
              <option value={1}>Presidential</option>
              <option value={2}>Government</option>
              <option value={3}>House of Reps</option>
            </select>
            <br /><br />

            {/* Input for Election Date */}
            <label htmlFor="electionDate">Election Date:</label>
            <input
              type="date"
              id="electionDate"
              value={newRaceElectionDate}
              onChange={(e) => setNewRaceElectionDate(e.target.value)}
            />
            <br /><br />

            {/* Dropdown for Assigning Admin */}
            <label htmlFor="assignAdmin">Assign Admin:</label>
            <select
              id="assignAdmin"
              value={newRaceAdmin}
              onChange={(e) => setNewRaceAdmin(e.target.value)}
              className="dropdown"
            >
              <option value="">Select an Admin</option>
              {admins.map((admin) => (
                <option key={admin.id} value={admin.id}>
                  {admin.firstName} {admin.lastName}
                </option>
              ))}
            </select>
            <br /><br />

            <button onClick={handleCreateRace} className="button2">
              Create Race
            </button>
          </div>
        </div>
      )}

      {/* Displaying all candidates */}
      {(raceActive || userData?.admin) ? (Object.keys(groupedCandidates).map((party) => (
        <div key={party} className="party-section">
          <h2>
            {/* Show their party name followed by the word 'Candidates' */}
            {party === 'R' ? 'Republican' : party === 'D' ? 'Democrat' : 'Independent'}{' '}
            Candidates
          </h2>

          <div className="candidate-container">
            {/* All candidate information */}
            {groupedCandidates[party].map((item) => (
              <div
                key={item.id}
                className={`candidate-item ${
                  selectedCandidate && selectedCandidate.id === item.id
                    ? 'highlighted'
                    : ''
                }`}
                onClick={() => {
                  setSelectedCandidate(item);
                  setIsEditing(false); // Exit edit mode if selecting a different candidate
                }}
              >
                {/* Name and clickable information here */}
                <div className="card-header">
                  <h3>
                    {item.firstName} {item.lastName}
                  </h3>
                  <span className="party-badge">({item.party})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))) : (
        <div>
          <br />
          <h3>Race is currently not active</h3>
          <br /><br />
        </div>
      )}

      {/* Button for creating a new race */}
      {userData?.admin && userData?.station === currentRace ? (
        <div>
          <button className="button2" onClick={() => setIsAddModalOpen(true)}>
            (Admin) Add a Candidate to the Ballot
          </button>
          <button className="button2" onClick={() => setIsCreateRaceModalOpen(true)}>
            (Admin) Create a New Ballot
          </button>
          {/* Allow for the ballot to be activated or deactivated */}
          {raceActive ? (
            <button className="button2" onClick={() => deactivateRace(currentRace)}>
              (Admin) Deactivate Ballot
            </button>
            ) : 
            <button className="button2" onClick={() => activateRace(currentRace)}>
              (Admin) Activate Ballot
            </button>
          }
        </div>  
      ) : (
        <div>
          <button className="button2" onClick={() => setIsCreateRaceModalOpen(true)}>
            (Admin) Create a New Ballot
          </button>
        </div>
      )}

      {/* Modal for displaying selected candidate information */}
      {selectedCandidate && (
        <div className="modal-overlay" onClick={() => setSelectedCandidate(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setSelectedCandidate(null)}>
              X
            </button>
            <h2>
              {selectedCandidate.firstName} {selectedCandidate.lastName}
            </h2>
            <p>
              <strong>Party:</strong> {selectedCandidate.party}
            </p>

            {!isEditing ? (
              <>
                <p>{selectedCandidate.information}</p>
                {userData?.admin ? (
                  <div>
                    <button
                      className="button2"
                      onClick={() => {
                        setIsEditing(true);
                        setUpdatedInfo(selectedCandidate.information); // Pre-fill the textbox with current info
                      }}
                    >
                      Update Candidate Information
                    </button>
                    <DeleteCand id={selectedCandidate.id} setData={setData} />
                  </div>
                ) : (
                  <div></div>
                )}
              </>
            ) : (
              <div>
                <textarea
                  value={updatedInfo}
                  onChange={(e) => setUpdatedInfo(e.target.value)}
                  rows="4"
                  style={{ width: '100%', height: '300px' }}
                />
                <br />
                <br />
                <button
                  onClick={() => handleSave(selectedCandidate, updatedInfo)}
                  className="button2"
                >
                  Save
                </button>
                <button onClick={() => setIsEditing(false)} className="button2">
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal for adding a candidate */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setIsAddModalOpen(false)}>
              X
            </button>
            <AddCand setIsAddModalOpen={setIsAddModalOpen} currentRace ={currentRace} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Candidates;
