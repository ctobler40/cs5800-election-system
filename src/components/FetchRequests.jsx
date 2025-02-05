import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import { useNavigate, Link } from 'react-router-dom';
import ProfileRequestForm from '../pages/request/ProfileRequestForm';

function Login() {
  const [data, setData] = useState([]);
  const [route, setRoute] = useState('http://localhost:6565/api/data/person');
  const [reset, setReset] = useState(false);

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

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

  // Logout functionality
  const LogOut = () => {
    localStorage.removeItem('userId');
    navigate('/');
    window.location.reload();
  };

  useEffect(() => {
    fetchPeople();
  }, [route]);   // Trigger data fetch whenever 'route' changes

  return (
    <div>
        <h1>Elections of 2024</h1>
        <h3>Looks like you still need to submit your Request Forms to vote!</h3>
        <div className='listing'>
          <ProfileRequestForm />
          {data.admin ? (
            <Link to="/pending-request">
              <button className='button2'>Request Profile Update</button>
            </Link>
          ) : ''}
        </div>
        <button className="button" onClick={LogOut}>Logout</button>
    </div>
  );
};

export default Login;
