import React from 'react';
import axios from 'axios';
import '../../App.css';

function Update({ selectedPerson, updatedPerson, route, setUpdatedPerson, setSelectedPerson, setData }) {

  // Fetch data from the database
  const fetchPeople = () => {
    axios.get(route) // Backend API route
      .then(response => {
        setData(response.data); // Pass the new data to Votes
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  // Handle updating a person through PUT request
  const updatePersonFunc = () => {
    if (selectedPerson) {
      axios.put(`http://localhost:6565/api/updatePerson/${selectedPerson.id}`, {
        firstName: updatedPerson.firstName,
        lastName: updatedPerson.lastName,
        age: parseInt(updatedPerson.age),  // Ensure the age is converted to an integer
        email: updatedPerson.email,
        password: updatedPerson.password,
      }).then(response => {
        console.log(response.data);
        fetchPeople(); // Re-fetch the data to reflect the updated person
        setSelectedPerson(null); // Reset the selected person after update
        setUpdatedPerson({ firstName: '', lastName: '', age: '', email: '', password: '' }); // Clear the form
      }).catch(error => {
        console.error('Error updating person:', error);
      });
    }
  };

  // Handle form inputs for updating
  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPerson({ ...updatedPerson, [name]: value });
  };

  // Ensure that selectedPerson is not null or undefined
  if (!selectedPerson) return null;

  return (
    <div>
      <h2>Update {selectedPerson.firstName || ''} {selectedPerson.lastName || ''}</h2>
      <div>
        <input className='input'
          type="text" 
          name="firstName" 
          placeholder="First Name" 
          value={updatedPerson.firstName} 
          onChange={handleUpdateInputChange} 
        />
        <input className='input'
          type="text" 
          name="lastName" 
          placeholder="Last Name" 
          value={updatedPerson.lastName} 
          onChange={handleUpdateInputChange} 
        />
        <input className='input'
          type="text" 
          name="age" 
          placeholder="Age" 
          value={updatedPerson.age} 
          onChange={handleUpdateInputChange} 
        />
      </div>
      <div>
        <input className='input'
          type="text" 
          name="email" 
          placeholder="E-mail" 
          value={updatedPerson.email} 
          onChange={handleUpdateInputChange} 
        />
        <input className='input'
          type="text" 
          name="password" 
          placeholder="Password" 
          value={updatedPerson.password} 
          onChange={handleUpdateInputChange} 
        />
      </div>
      <div> 
        <button className='button' onClick={updatePersonFunc}>Update Person</button>
        <button className='button' onClick={() => setSelectedPerson(null)}>Cancel</button> {/* Cancel button */}
      </div>
    </div>
  );
}

export default Update;
