import React, { useState } from 'react';
import axios from 'axios';
import '../../App.css';
import { useNavigate, Link } from 'react-router-dom';

function AddCand({ setIsAddModalOpen, currentRace }) {
  const [addCandidate, setAddCandidate] = useState({
    firstName: '',
    lastName: '',
    party: '',
    race_id: currentRace,
    state_running: '',  // New state for state_id
    county_running: '',  // New state for county_id
    information: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddCandidate({ ...addCandidate, [name]: value });
  };

  // Handle adding a new candidate through POST request
  const addCandidateFunc = async () => {
    try {
      // Ensure all fields are filled out
      if (
        !addCandidate.firstName ||
        !addCandidate.lastName ||
        !addCandidate.party ||
        !addCandidate.state_running ||
        !addCandidate.county_running ||
        !addCandidate.information
      ) {
        alert('Please make sure all fields are filled out.');
        return;
      }

      // Make the POST request to add the candidate
      const response = await axios.post('http://localhost:6565/api/addCandidate', {
        firstName: addCandidate.firstName,
        lastName: addCandidate.lastName,
        party: addCandidate.party,
        race_id: currentRace,
        state_running: addCandidate.state_running,
        county_running: addCandidate.county_running,
        information: addCandidate.information,
      });

      console.log('Candidate added successfully:', response.data);

      // Reset error message and close modal
      setError('');
      setIsAddModalOpen(false); // Close the modal after adding the candidate
      navigate('/candidates'); // Redirect to the candidates page (or refresh data)
      window.location.reload(); // Refresh page after adding
    } catch (error) {
      console.error('Error adding candidate:', error);
      setError('Error adding candidate. Please try again.');
    }
  };

  return (
    <div className="container">
      {/* Error Message */}
      {error && <h3 className="error-message">{error}</h3>}

      <h2>Add Candidate</h2>

      <div className="input-row">
        <div>
          {/* First Name */}
          <input
            className="input"
            type="text"
            name="firstName"
            placeholder="First Name"
            value={addCandidate.firstName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          {/* Last Name */}
          <input
            className="input"
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={addCandidate.lastName}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="input-row">
        <div>
          {/* Party */}
          <select
            className="input"
            name="party"
            value={addCandidate.party}
            onChange={handleInputChange}
          >
            <option value="">Select Party</option>
            <option value="R">Republican</option>
            <option value="D">Democrat</option>
            <option value="I">Independent</option>
          </select>
        </div>
      </div>

      <div className="input-row">
        <div>
          {/* State */}
          <select
            className="input"
            name="state_running"
            value={addCandidate.state_running}
            onChange={handleInputChange}
          >
            <option value="">Select State</option>
            <option value="1">Alabama</option>
            <option value="2">Alaska</option>
            <option value="3">Arizona</option>
            <option value="4">Arkansas</option>
            <option value="5">California</option>
            <option value="6">Colorado</option>
            <option value="7">Connecticut</option>
            <option value="8">Delaware</option>
            <option value="9">Florida</option>
            <option value="10">Georgia</option>
            <option value="11">Hawaii</option>
            <option value="12">Idaho</option>
            <option value="13">Illinois</option>
            <option value="14">Indiana</option>
            <option value="15">Iowa</option>
            <option value="16">Kansas</option>
            <option value="17">Kentucky</option>
            <option value="18">Louisiana</option>
            <option value="19">Maine</option>
            <option value="20">Maryland</option>
            <option value="21">Massachusetts</option>
            <option value="22">Michigan</option>
            <option value="23">Minnesota</option>
            <option value="24">Mississippi</option>
            <option value="25">Missouri</option>
            <option value="26">Montana</option>
            <option value="27">Nebraska</option>
            <option value="28">Nevada</option>
            <option value="29">New Hampshire</option>
            <option value="30">New Jersey</option>
            <option value="31">New Mexico</option>
            <option value="32">New York</option>
            <option value="33">North Carolina</option>
            <option value="34">North Dakota</option>
            <option value="35">Ohio</option>
            <option value="36">Oklahoma</option>
            <option value="37">Oregon</option>
            <option value="38">Pennsylvania</option>
            <option value="39">Rhode Island</option>
            <option value="40">South Carolina</option>
            <option value="41">South Dakota</option>
            <option value="42">Tennessee</option>
            <option value="43">Texas</option>
            <option value="44">Utah</option>
            <option value="45">Vermont</option>
            <option value="46">Virginia</option>
            <option value="47">Washington</option>
            <option value="48">West Virginia</option>
            <option value="49">Wisconsin</option>
            <option value="50">Wyoming</option>
          </select>
        </div>
      </div>

      <div className="input-row">
        <div>
          {/* County */}
          <input
            className="input"
            type="text"
            name="county_running"
            placeholder="County"
            value={addCandidate.county_running}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="input-row">
        <div>
          {/* Information */}
          <textarea
            className="input"
            name="information"
            placeholder="Candidate Information"
            rows="5"
            value={addCandidate.information}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <br />
      <div>
        {/* Buttons */}
        <button
          className="button2"
          onClick={() => {
            addCandidateFunc(); // Add the candidate
          }}
        >
          Add Candidate
        </button>
        <Link to="/candidates">
          <button className="button2" onClick={() => setIsAddModalOpen(false)}>
            Cancel
          </button>
        </Link>
      </div>
    </div>
  );
}

export default AddCand;
