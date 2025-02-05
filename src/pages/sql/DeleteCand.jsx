import React from 'react';
import axios from 'axios';
import '../../App.css';

function DeleteCand({ id, setData, route }) {
  // Fetch data from the database
  const fetchCandidates = () => {
    axios.get(route) // Backend API route
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching candidates:', error);
      });
  };

  // Function to delete a candidate by ID
  const deleteCandidateFunc = (delId) => {
    axios.delete(`http://localhost:6565/api/deleteCandidate/${delId}`)
      .then((response) => {
        console.log(response.data);
        fetchCandidates(); // Re-fetch the data after deletion
      })
      .catch((error) => {
        console.error('Error deleting candidate: ' + delId + ': ', error);
      });
  };

  return (
    <button className="button2" onClick={() => {deleteCandidateFunc(id), window.location.reload()}}>
      Drop Out of Election
    </button>
  );
}

export default DeleteCand;
