import React, { useState, useEffect } from 'react'
import axios from 'axios';
import '../../App.css';
import { useNavigate, Link } from 'react-router-dom';

function Add({data, setData, route}) {

  const [addPerson, setAddPerson] = useState({ firstName: '', lastName: '', age: '', email: '', password: '' });
  const [addAddress, setAddAddress] = useState({address: '', town: '', zip: '', county_id: ''});
  const [addresses, setAddresses] = useState([]);
  const [state, setState] = useState("None");
  const [county, setCounty] = useState(1);
  const [acceptableStates, setAcceptableStates] = useState([]);
  const [error, setError] = useState('Passes');
  const navigate = useNavigate();

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

  // Fetch data from the database
  const fetchAddresses = () => {
    axios.get('/api/data/address') // Backend API route
      .then(response => {
        setAddresses(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  // Add all voting information
  const addNewUserVotes = (id) => {
    // First make sure that all information is filled out
    axios.post(`http://localhost:6565/api/votes/newUser/${id}`, {
      // Adding votes
    })
    .then(() => {
      console.log('Votes submitted successfully.');
    })
    .catch((error) => console.error('Error submitting request:', error));
  };

  // Fetch address data for a given address ID
  const fetchStatesByCounty = (countyName) => {
    // Check if the address has already been fetched to avoid redundant API calls
    axios.get(`http://localhost:6565/api/data/address/get-state-county/${countyName}`) // Backend API route
      .then(response => {
        setAcceptableStates(response.data);
      })
      .catch(error => {
        console.error('Error fetching address:', error);
      });
  };

  // Fetch address data for a given address ID
  const fetchCountyByNameAndState = (countyName, state_id) => {
    // Check if the address has already been fetched to avoid redundant API calls
    axios.get(`http://localhost:6565/api/data/address/get-county/${countyName}/${state_id}`) // Backend API route
      .then(response => {
        if (response.data.length > 0) {
          setCounty(response.data[0].id);
        }
      })
      .catch(error => {
        console.error('Error fetching address:', error);
      });
  };

  // Handle form inputs
  const handleInputChange_Person = (e) => {
    const { name, value } = e.target;
    setAddPerson({ ...addPerson, [name]: value });
  };
  const handleInputChange_Address = (e) => {
    const { name, value } = e.target;
    if (name === 'county_id') {
      // If we are entering our county, we will check to see if they exist in the state we have given
      fetchStatesByCounty(value); 
      fetchCountyByNameAndState(value, state);
    }
    else if (name === 'state_id') {
      // If we are messing with the state, we assign it's state_id to state
      setState(parseInt(value));
    }
    setAddAddress({ ...addAddress, [name]: value });
  };

  const addPersonFunc = async () => {
    try {
      // Step 1: Add the address and get the address ID
      const addAddressResponse = await axios.post('http://localhost:6565/api/addAddress', {
        streetName: addAddress.address,
        townName: addAddress.town,
        zipCode: parseInt(addAddress.zip),
        county_id: county   // addAddress.county_id
      });
  
      // Make sure the insertId exists
      const addressID = addAddressResponse.data.result?.insertId;
      if (!addressID) {
        console.error('No addressID returned from the addAddress API');
        return;
      }
  
      // Step 2: Add the person and get the person ID
      const addPersonResponse = await axios.post('http://localhost:6565/api/addPerson', {
        firstName: addPerson.firstName,
        lastName: addPerson.lastName,
        age: parseInt(addPerson.age),
        email: addPerson.email,
        password: addPerson.password,
        address_id: addressID, // Link person with the newly created address ID
      });
  
      // Extract the person ID from the response
      const personID = addPersonResponse.data.result?.insertId;
      if (!personID) {
        console.error('No personID returned from the addPerson API');
        return;
      }
  
      // Step 3: Call addNewUserVotes with the person ID
      addNewUserVotes(personID);
  
      // Log response for debugging
      console.log('Person added successfully:', addPersonResponse.data);
  
      // Step 4: Fetch the updated list of people and addresses
      const updatedPeopleResponse = await axios.get(route);
      setData(updatedPeopleResponse.data);  // Update your UI with the new data
      fetchPeople();  // Optionally refetch people data (might be redundant with setData)
      fetchAddresses();
  
    } catch (error) {
      console.error('Error adding person or address:', error);
    }
  };
  

  useEffect(() => {
    if (acceptableStates.length > 0) {
      console.log("Acceptable states have been updated:", acceptableStates);
    }
  }, [acceptableStates]);
  

  const registerUser = () => {
    var haveEmail = false;
    var haveAddress = false;
    var passablePassword = false;    
    var passableZipCode = false;
    var passableEmail = false;
    var passableCounty = false;
    

    console.log(data);
    // Check for User already existing
    data.map(item => (
      haveEmail = (haveEmail || item.email == addPerson.email)
    ));
    // Check for address already existing
    addresses.map(item => (
      haveAddress = (haveAddress || (item.address == addAddress.address && item.town == addAddress.town && item.zip == addAddress.zip && item.county_id == addAddress.county_id))
    ));

    // Check for state having the county or not
    acceptableStates.map(item => (
      passableCounty = (passableCounty || item.id == state)
    ));

    // Check for address already existing
    var addressId = -1;
    data.map(item => (
      addressId = item.address_id
    ));

    // Check if the password passes all requirements
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;   // At least 1 capital letter, 1 special character, and 8 characters long
    passablePassword = passwordRegex.test(addPerson.password);
    const zipCodeRegex = /^\d{5}$/; // exactly 5 digits
    passableZipCode = zipCodeRegex.test(addAddress.zip);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // xxx + @ + xxx + . + xxx
    passableEmail = emailRegex.test(addPerson.email);

    // Make sure we have all of our boxes filled out
    if (addPerson.firstName == '' || addPerson.lastName == '' || addPerson.age == '' || addPerson.email == '' || addPerson.password == '' ||
        addAddress.address == '' || addAddress.town == '' || addAddress.zip == '' || addAddress.county_id == '') {
      setError('Please make sure you have all boxes filled out.');
      {/*console.log(String(addPerson.firstName) + String(addPerson.lastName) + String(addPerson.age) + String(addPerson.email) + String(addPerson.password +
        addAddress.address) + String(addAddress.town) + String(addAddress.state_id) + String(addAddress.zip == ''))*/}
    } 
    else if (haveEmail) {
      setError('That email already exists in the database.');
    }
    else if (haveAddress) {
      setError('That address already exists in the database.');
    }
    else if (!passablePassword) {
      setError('That password is not valid.\nMake sure you have at least\n8 characters total\n1 special character\n1 upper case character');
    }
    else if (!passableZipCode){
      setError('ZIP code must be exactly 5 digits.')
    }
    else if (!passableEmail){
      setError('Please enter a valid email address.')
    }
    else if (parseInt(addPerson.age) < 18) {
      setError('Sorry. You are too young to register to vote.');
    }
    else if (!passableCounty) {
      setError('Sorry. The county you entered does not exist in your state.');
      console.log("State Does not exist!");
    }
    else {
      // Add person
      addPersonFunc();
      // Go to new page
      navigate('/');
    }
  };

  return (
    <div className="container">
      {/* Use this to show current errors */}
      {/* {error && <h3>{error}</h3>} */} 

      <h2>
        {error !== 'Passes' && error}
      </h2>

      <div className="input-row">
        <div>
          {/* First Name */}
          <input className='input'
            type="text" 
            name="firstName" 
            placeholder="First Name"
            value={addPerson.firstName} 
            onChange={handleInputChange_Person} 
          />
          <br/>
          <span className={addPerson.firstName === '' ? 'error-message error-visible' : 'error-message'}>
            {addPerson.lastName === ''
              ? 'Please enter your first name'
              : ''}
          </span>
        </div>
        <div>
          {/* Last Name */}
          <input className='input'
            type="text" 
            name="lastName" 
            placeholder="Last Name" 
            value={addPerson.lastName} 
            onChange={handleInputChange_Person} 
          />
          <br/>
          <span className={addPerson.lastName === '' ? 'error-message error-visible' : 'error-message'}>
            {addPerson.lastName === ''
              ? 'Please enter your last name'
              : ''}
          </span>
        </div>
        <div>
          {/* Age */}
          <input className='input'
            type="text" 
            name="age" 
            placeholder="Age" 
            value={addPerson.age} 
            onChange={handleInputChange_Person} 
          />
          <br/>
          <span className={addPerson.age === '' || !/^(1[89]|[2-9]\d|1[01]\d|120)$/.test(addPerson.age) || error === 'Sorry. You are too young to register to vote.' ? 'error-message error-visible' : 'error-message'}>
            {addPerson.age === ''
              ? 'Please enter your age in number'
              : !/^(1[89]|[2-9]\d|1[01]\d|120)$/.test(addPerson.age)
              ? 'It is an invalid age.'
              : error === 'Sorry. You are too young to register to vote.'
              ? error
              : ''}
          </span>
        </div>
      </div>
  
      <div className="input-row">
        <div>
          {/* Email */}
          <input className='input'
            type="text" 
            name="email" 
            placeholder="E-mail" 
            value={addPerson.email} 
            onChange={handleInputChange_Person}
          />
          <br/>
          <span className={addPerson.email === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addPerson.email) || error === 'That email already exists in the database.' ? 'error-message error-visible' : 'error-message'}>
            {addPerson.email === ''
              ? 'Please enter your email address'
              : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addPerson.email)
              ? 'Please enter a valid email address.'
              : error === 'That email already exists in the database.'
              ? error
              : ''}
          </span>
        </div>
        <div>
          {/* Password */}
          <input className='input'
            type="password" 
            name="password" 
            placeholder="Password" 
            value={addPerson.password} 
            onChange={handleInputChange_Person}
          />
          <br/>
          <span className={addPerson.password === '' || !/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/.test(addPerson.password) ? 'error-message error-visible' : 'error-message'}>
            {addPerson.password === ''
              ? 'Please enter your password'
              : !/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/.test(addPerson.password)
              ? 'Make sure you have > 8 characters with 1 special character 1 upper case character'
              : ''}
          </span>
        </div>
      </div>
      
      <div className="input-row">
        <div>
          {/* Address */}
          <input className='input'
            type="text" 
            name="address" 
            placeholder="Address"
            value={addAddress.address} 
            onChange={handleInputChange_Address} 
          />
          <br/>
          <span className={addAddress.address === '' || error === 'That address already exists in the database.' ? 'error-message error-visible' : 'error-message'}>
            {addAddress.address === ''
              ? 'Please enter your address'
              : error === 'That address already exists in the database.'
              ? error
              : ''}
          </span>
        </div>
        <div>
          {/* Town */}
          <input className='input'
            type="text" 
            name="town" 
            placeholder="Town"
            value={addAddress.town} 
            onChange={handleInputChange_Address} 
          />
          <br/>
          <span className={addAddress.town === '' ? 'error-message error-visible' : 'error-message'}>
            {addAddress.town === ''
              ? 'Please enter your town'
              : ''}
          </span>
        </div>
        <div>
          {/* State */}
          <select className="state-select"

            name="state_id"
            value={state}
            onChange={handleInputChange_Address}
          >
            <option value="-1">Select your State</option>
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
          <br/>
          {/*<span className={addAddress.state_id === '' ? 'error-message error-visible' : 'error-message'}>
            {addAddress.state_id === ''
              ? 'Please select your state'
              : ''}
          </span>*/}
        </div>
        <div>
          {/* Zip Code */}
          <input className='input'
            type="text" 
            name="zip" 
            placeholder="Zip Code" 
            value={addAddress.zip} 
            onChange={handleInputChange_Address} 
          />
          <br/>
          <span className={addAddress.zip === '' || !/^\d{5}$/.test(addAddress.zip) ? 'error-message error-visible' : 'error-message'}>
            {addAddress.zip === ''
              ? 'Please enter your 5 digit zip code'
              : !/^\d{5}$/.test(addAddress.zip)
              ? 'ZIP code must be exactly 5 digits.'
              : ''}
          </span>
        </div>
        <div>
          {/* County */}
          <input className='input'
            type="text" 
            name="county_id" 
            placeholder="County" 
            value={addAddress.county_id} 
            onChange={handleInputChange_Address} 
          />
          <br/>
          <span className={addAddress.county_id === '' ? 'error-message error-visible' : 'error-message'}>
            {addAddress.county_id === ''
              ? 'Please enter your County'
              : ''}
          </span>
        </div>
      </div>
  
      <br />
      <div>
        <button className='button2' onClick={() => registerUser()}>Register</button>
        <Link to='/login'>
          <button className='button2'>Back to Login</button>
        </Link>
      </div>
    </div>

    

  )
}

export default Add;