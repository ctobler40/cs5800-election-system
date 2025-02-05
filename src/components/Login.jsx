import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [data, setData] = useState([]);
  const [route, setRoute] = useState('http://localhost:6565/api/data/person');
  const [error, setError] = useState('Passes');
  const [reset, setReset] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  const handleLogin = (userId) => {
    // Store the user ID in local storage
    localStorage.setItem('userId', userId);
  };

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

  const fetchRequests = async (userId) => {
    try {
      setLoading(true);  // Set loading to true before making the request
      const response = await axios.get(`http://localhost:6565/api/data/request_form/number_approved/${userId}`);
      // Return the boolean directly based on response data length
      return response.data.length > 0;
    } catch (error) {
      console.error('Error fetching requests:', error);
      return false;  // Return false in case of error
    } finally {
      setLoading(false);  // Set loading to false once the request is done
    }
  };

  const resetPassword = () => {
    setReset(true);
    navigate('/');
  };

  useEffect(() => {
    fetchPeople();
  }, [route]); // Trigger data fetch whenever 'route' changes

  const loginUser = async () => {
    let emailExists = false;
    let validPassword = false;
    let userId = -1;

    // Check if the email exists in the data
    data.forEach(item => {
      if (item.email === email) {
        emailExists = true;
        userId = item.id;
        // If email matches, check if the password is correct
        if (item.password === password) {
          validPassword = true;
        }
      }
    });

    // Validate form inputs
    if (email === '' || password === '') {
      setError('Please make sure you have all boxes filled out.');
    } else if (!emailExists) {
      setError('Sorry. That email does not exist in the database.');
    } else if (!validPassword) {
      setError('Sorry. That password is incorrect.');
    } else {
      // Fetch requests first before proceeding
      const hasApprovedRequests = await fetchRequests(userId);  // Wait for the fetchRequests function to complete

      // Successful login
      handleLogin(userId);

      // Now that we have a userID, we need to make sure they have approved request forms to vote
      // Until they do, they will be stuck on their account page
      if (hasApprovedRequests) {
        setError('Logging in...');
        navigate('/'); // Navigate to the next page
      } else {
        setError('Navigating...');
        navigate('/need-request'); // Navigate to the next page
      }

      window.location.reload();
    }
  };

  return (
    <div>
        <h1>Elections of 2024</h1>
        <h3>{(error === 'Passes' ? 'Login to your account' : error)}</h3>
        {!reset &&
        <div> 
          <input className='input'
            type="text" 
            name="email" 
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input className='input'
            type="password" 
            name="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
              <button className='button' onClick={() => loginUser()} disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
              <Link to='/register'>
                  <button className='button'>Register</button>
              </Link>
          </div>
        
          <div>
            <h6 onClick={() => setReset(!reset)}>
              Forgot Password?
            </h6>
          </div>
        </div>
        }
        {reset &&
        <div>
          <div>
            Enter your email here to send a reset request
          </div>
          <input className='input'
            type="text" 
            name="email" 
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div>
            <button className= 'button' onClick={() => resetPassword()}>Send Request</button>
            <button className= 'button' onClick={() => setReset(!reset)}>Back to Login</button>
          </div>
        </div>
        }
        <br />
    </div>
  );
};

export default Login;
