import React from 'react'
import axios from 'axios';
import '../../App.css';

function Delete({id, setData, route}) {

  // Fetch data from the database
  const fetchPeople = () => {
    axios.get(route) // Backend API route
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  // Function to delete a person by ID
  const deletePersonFunc = (delId) => {
    axios.delete(`http://localhost:6565/api/deletePerson/${delId}`)
      .then(response => {
        console.log(response.data);
        fetchPeople(); // Re-fetch the data after deletion
      })
      .catch(error => {
        console.error('Error deleting person: ' + delId + ": ", error);
      });
  };

  return (
    <button className='button2' onClick={() => deletePersonFunc(id)}>Delete</button>
  )
}

export default Delete
