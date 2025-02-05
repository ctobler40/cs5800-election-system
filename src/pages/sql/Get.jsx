import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Delete from './Delete';
import '../../App.css';

function Get({ data, setData, route, setNewRoute }) {
  const [addresses, setAddresses] = useState({});
  const [states, setStates] = useState({});
  const [selectedVoter, setSelectedVoter] = useState(null); // State for selected voter

  // Fetch data from the database
  const fetchPeople = () => {
    axios.get(route)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  // Fetch state data for a given address ID
  const fetchState = (addressID) => {
    if (!states[addressID]) {
      axios.get(`http://localhost:6565/api/data/address/get-state/${addressID}`)
        .then(response => {
          setStates(prevStates => ({
            ...prevStates,
            [addressID]: response.data
          }));
        })
        .catch(error => {
          console.error('Error fetching state:', error);
        });
    }
  };

  // Fetch address data for a given address ID
  const fetchAddress = (addressID) => {
    if (!addresses[addressID]) {
      axios.get(`http://localhost:6565/api/data/address/${addressID}`)
        .then(response => {
          setAddresses(prevAddresses => ({
            ...prevAddresses,
            [addressID]: response.data
          }));
        })
        .catch(error => {
          console.error('Error fetching address:', error);
        });
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  return (
    <div className="listing">
      <h2>Voters Information</h2>
      <div>
        <button className='button' onClick={() => setNewRoute('http://localhost:6565/api/data/person')}>Sort By ID</button>
        <button className='button' onClick={() => setNewRoute('http://localhost:6565/api/data/person/firstName')}>Sort By First Name</button>
        <button className='button' onClick={() => setNewRoute('http://localhost:6565/api/data/person/lastName')}>Sort By Last Name</button>
        <button className='button' onClick={() => setNewRoute('http://localhost:6565/api/data/person/age')}>Sort By Age</button>
      </div>
      <br /><br />
      <table className="info-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) && data.length > 0 ? (data.map(item => {
            const address = addresses[item.address_id];
            const state = states[item.address_id];

            // Fetch address and state data
            fetchAddress(item.address_id);
            fetchState(item.address_id);

            return (
              <tr key={item.id}>
                <td>{item.firstName} {item.lastName}</td>
                <td>{item.age}</td>
                <td>{item.email}</td>
                <td>
                  <button className="button2" onClick={() => setSelectedVoter(item)}>Info</button>
                  <Delete id={item.id} setData={setData} route={route} />
                </td>
              </tr>
            );
          })) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for displaying voter information */}
      {selectedVoter && (
        <div className="modal-overlay" onClick={() => setSelectedVoter(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setSelectedVoter(null)}>X</button>
            <h2>Voter Information</h2>
            <p><strong>Name:</strong> {selectedVoter.firstName} {selectedVoter.lastName}</p>
            <p><strong>Age:</strong> {selectedVoter.age}</p>
            <p><strong>Email:</strong> {selectedVoter.email}</p>
            <p><strong>Address:</strong></p>
            {addresses[selectedVoter.address_id] && states[selectedVoter.address_id] ? (
              <p>
                {addresses[selectedVoter.address_id][0]?.streetName}, {addresses[selectedVoter.address_id][0]?.townName}, 
                {states[selectedVoter.address_id][0]?.abbr} {addresses[selectedVoter.address_id][0]?.zipCode}
              </p>
            ) : (
              <p>Loading address...</p>
            )}
            <Delete id={selectedVoter.id} setData={setData} route={route} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Get;
