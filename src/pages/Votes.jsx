import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import Add from './sql/Add';
import Update from './sql/Update';
import Get from './sql/Get';

function Votes() {
  const [data, setData] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [updatedPerson, setUpdatedPerson] = useState({ firstName: '', lastName: '', age: '', email: '', password: '' });
  const [route, setRoute] = useState('http://localhost:6565/api/data/person');
  const [searchUser, setSearchUser] = useState('');

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

  useEffect(() => {
    fetchPeople();
  }, [route]);   // Trigger data fetch whenever 'route' changes

  // Select a person to update
  const selectPersonForUpdate = (person) => {
    setSelectedPerson(person); // Set the selected person for update
    setUpdatedPerson({ firstName: person.firstName, lastName: person.lastName, age: person.age, email: person.email, password: person.password }); // Pre-fill the form with the person's data
  };

  // Changing the route for SQL to grab from
  const setNewRoute = (newRoute) => {
    setRoute(newRoute);
    console.log("New Route: " + route);
  };

  return (
    <div>
      <h1 style={{color:'white'}}>Users</h1>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent the default form submission behavior
            console.log(searchUser)
            setRoute(searchUser === '' ? `http://localhost:6565/api/data/person` : `http://localhost:6565/api/data/person/email/${searchUser}`); // Update the route
          }}
        >
          <input
            className='input'
            type="text"
            name="search_user"
            placeholder="Email"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)} // Update the searchUser state on input change
          />
          <button className="button2">Search</button> {/* Add a button for form submission */}
        </form>
      </div>
      {/* Do a bullet list on all the candidates to vote for instead of the blocks for example */}
      <div>
        <Get 
          data={data} 
          setData={setData} 
          route={route} 
          setNewRoute={setNewRoute} 
          selectPersonForUpdate={selectPersonForUpdate}
        />
      </div>
    </div>
  );
};

export default Votes;
