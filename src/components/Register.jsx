import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import Add from '../pages/sql/Add';

function Register() {
  const [data, setData] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [route, setRoute] = useState('http://localhost:6565/api/data/person');

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

  return (
    <div>
      <h3>Register to Vote!</h3>
      {!selectedPerson && (
        <Add data={data} setData={setData} route={route}/>
      )}
    </div>
  );
};

export default Register;
