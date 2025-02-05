import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import USMap from '../components/USMap';
import { useNavigate } from 'react-router-dom';

function Results() {
  const [republicans, setRepublicans] = useState([]);
  const [democrats, setDemocrats] = useState([]);
  const [independents, setIndependents] = useState([]);
  const [percentages, setPercentages] = useState([]);
  const [electoralVotes, setElectoralVotes] = useState([]);
  const [stateInformation, setStateInformation] = useState(-1);
  const [races, setRaces] = useState([]); // List of races
  const [currentRace, setCurrentRace] = useState(2); // Current race ID
  const [isPresidential, setIsPresidential] = useState(false);
  const [isActive, setIsActive] = useState(false); 
  const [isAdmin, setIsAdmin] = useState(false); 
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const fetchPerson = () => {
    axios.get(`http://localhost:6565/api/data/person/${userId}`)
      .then(response => {
        setIsAdmin(response.data[0].admin);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };  

  const fetchRaces = () => {
    axios.get('http://localhost:6565/api/data/races')
      .then((response) => {
        setRaces(response.data);
        setIsActive(races[currentRace].isActive);
      })
      .catch((error) => {
        console.error('Error fetching races:', error);
      });
  };

  const fetchRepublicans = (currentRace, party, raceType, userId) => {
    axios.get(`http://localhost:6565/api/data/results/${currentRace}/${party}/${raceType}/${userId}`)
      .then(response => {
        console.log(response.data)
        setRepublicans(response.data);
      })
      .catch(error => {
        console.error('Error fetching Republicans:', error);
      });
  };

  const fetchDemocrats = (currentRace, party, raceType, userId) => {
    axios.get(`http://localhost:6565/api/data/results/${currentRace}/${party}/${raceType}/${userId}`)
      .then(response => {
        setDemocrats(response.data);
      })
      .catch(error => {
        console.error('Error fetching Democrats:', error);
      });
  };

  const fetchIndependents = (currentRace, party, raceType, userId) => {
    axios.get(`http://localhost:6565/api/data/results/${currentRace}/${party}/${raceType}/${userId}`)
      .then(response => {
        setIndependents(response.data);
      })
      .catch(error => {
        console.error('Error fetching Independents:', error);
      });
  };

  const sum = arr => arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  // Get index of max value
  const getMaxIndex = arr => {
    const maxValue = Math.max(...arr);
    const maxIndices = arr.filter(value => value === maxValue);
    return maxIndices.length > 1 ? -1 : arr.indexOf(maxValue);
  };

  const fetchPercentages = () => {
    axios.get(`http://localhost:6565/api/data/results_state`)
      .then(response => {
        // Add in percentages
        var tempPercentages = [];
        response.data.map(item => (
          tempPercentages.push([
            item.stateID, 
            [item.state, item.stateName], 
            [
              parseInt(item.R_votes) + parseInt(item.D_votes) + parseInt(item.I_votes) == 0 ? 0 : Math.max(0, (parseInt(item.R_votes) / (parseInt(item.R_votes) + parseInt(item.D_votes) + parseInt(item.I_votes)) * 100)),
              parseInt(item.R_votes) + parseInt(item.D_votes) + parseInt(item.I_votes) == 0 ? 0 : Math.max(0, (parseInt(item.D_votes) / (parseInt(item.R_votes) + parseInt(item.D_votes) + parseInt(item.I_votes)) * 100)),
              parseInt(item.R_votes) + parseInt(item.D_votes) + parseInt(item.I_votes) == 0 ? 0 : Math.max(0, (parseInt(item.I_votes) / (parseInt(item.R_votes) + parseInt(item.D_votes) + parseInt(item.I_votes)) * 100))
            ],
            item.electoralVotes
          ])
        ));
        // Now calculate electoral votes
        var tempElectoralVotes = [0, 0, 0];
        tempPercentages.filter(item => getMaxIndex(item[2]) !== -1)
        .map(item => {
          tempElectoralVotes[getMaxIndex(item[2])] += item[3];
        });
        setElectoralVotes(tempElectoralVotes);
        setPercentages(tempPercentages);
      })
      .catch(error => {
        console.error('Error fetching States:', error);
      });
  };

  useEffect(() => {
    fetchRaces();
    fetchPerson();
    fetchRepublicans(currentRace, 'R', races.find((race) => race.id === currentRace)?.raceType, userId);
    fetchDemocrats(currentRace, 'D', races.find((race) => race.id === currentRace)?.raceType, userId);
    fetchIndependents(currentRace, 'I', races.find((race) => race.id === currentRace)?.raceType, userId);
    fetchPercentages();
    setIsPresidential(races.find((race) => race.id === currentRace)?.raceType === 1);
  }, [races, currentRace]);

  // Calculating % of votes
  const totalVotes = republicans.length + democrats.length + independents.length;

  const republicanWidth = totalVotes ? (republicans.length / totalVotes) * 100 : 0;
  const democratWidth = totalVotes ? (democrats.length / totalVotes) * 100 : 0;
  const independentWidth = totalVotes ? (independents.length / totalVotes) * 100 : 0;

  function backgroundColor(redPercent, bluePercent, greenPercent) {
    return `linear-gradient(90deg, red ${parseFloat(redPercent)}%, blue ${parseFloat(redPercent)}% ${parseFloat(redPercent) + parseFloat(bluePercent)}%, green ${100 - parseFloat(greenPercent)}%)`
  }

  return (
    <div>
      <h1>Results</h1>
      <h2>
        Current Race: {races.find((race) => race.id === currentRace)?.raceName || 'None'}
      </h2>

      <div className="race-navigation">
        <button
          onClick={() => {
            if (currentRace > 2) setCurrentRace(currentRace - 1);
            else setCurrentRace(races.length);
          }}
          className="button2"
        >
          Prev Race
        </button>
        <button
          onClick={() => {
            if (currentRace < races.length) setCurrentRace(currentRace + 1);
            else setCurrentRace(2);
          }}
          className="button2"
        >
          Next Race
        </button>
      </div>
      
      {isActive && !isAdmin ? (
        <div>
          <h2>Results for this race are not available while the race is active.</h2>
        </div>
      ) : (
        <div>
          {/* NOTE that we are only going to show results for the presidential election! */}
          <div className='listing'>
            <h2>Total Votes In: {totalVotes}</h2>
            <div className='data-container' style={{ textAlign: 'center' }}>
              <div className='display-data' style={{ display: 'flex', justifyContent: 'center', gap: '2px', height: '50px', width: '100%' }}>  {/* justifyContent: 'space-around' */}
                <div className='display-r' style={{ width: `${republicanWidth}%`, outline: '3px solid #000', backgroundColor: 'red', padding: '15px', minWidth: '150px', border: 'none' }}>
                  {"Republicans: " + republicanWidth.toFixed(2) + "%"}
                </div>

                <div className='display-r' style={{ width: `${democratWidth}%`, outline: '3px solid #000', backgroundColor: 'blue', padding: '15px', minWidth: '150px', border: 'none' }}>
                  {"Democrats: " + democratWidth.toFixed(2) + "%"}
                </div>

                <div className='display-r' style={{ width: `${independentWidth}%`, outline: '3px solid #000', backgroundColor: 'green', padding: '15px', minWidth: '150px', border: 'none' }}>
                  {"Independent: " + independentWidth.toFixed(2) + "%"}
                </div>
              </div>
            </div>
          </div>
          
          {/* This informaiton will only be displayed to Presidential Election! */}
          {isPresidential &&
            <div>
              <div className='listing'>
                <h1>Results: Electoral Votes</h1>
                <div className='data-container' style={{ textAlign: 'center' }}>
                  <div className='display-data' style={{ display: 'flex', justifyContent: 'center', gap: '2px', height: '50px', width: '100%' }}>  {/* justifyContent: 'space-around' */}
                    <div className='display-r' style={{ width: `${electoralVotes[0] / sum(electoralVotes) * 100}%`, outline: '3px solid #000', backgroundColor: 'red', padding: '15px', minWidth: '150px', border: 'none' }}>
                      {"Republicans: " + electoralVotes[0]}
                    </div>

                    <div className='display-r' style={{ width: `${electoralVotes[1] / sum(electoralVotes) * 100}%`, outline: '3px solid #000', backgroundColor: 'blue', padding: '15px', minWidth: '150px', border: 'none' }}>
                      {"Democrats: " + electoralVotes[1]}
                    </div>

                    <div className='display-r' style={{ width: `${electoralVotes[2] / sum(electoralVotes) * 100}%`, outline: '3px solid #000', backgroundColor: 'green', padding: '15px', minWidth: '150px', border: 'none' }}>
                      {"Independent: " + electoralVotes[2]}
                    </div>
                  </div>
                </div>
              </div>
              <br/>

              <div>
                <h2>Percentage Votes for All Parties</h2>
                {stateInformation !== -1 &&
                <div className="bulletin-board">
                  <h2>{stateInformation[1][1]} Outcome</h2>
                  <ul>
                    <li><strong>{stateInformation[2][0].toFixed(2)}%</strong> Voted Republican</li>
                    <li><strong>{stateInformation[2][1].toFixed(2)}%</strong> Voted Democrat</li>
                    <li><strong>{stateInformation[2][2].toFixed(2)}%</strong> Voted Independent</li>
                  </ul>
                </div>
                }
                <div className='candidate-container'>
                  {percentages.map((item, index) => (
                    <span key={index}>
                        <button className='state-outcome' onClick={() => setStateInformation(item)} style={{ background: backgroundColor(parseFloat(item[2][0]).toFixed(2), parseFloat(item[2][1]).toFixed(2), parseFloat(item[2][2]).toFixed(2)) }}>
                          {item[1][0]} {/*: {parseFloat(item[1][0]).toFixed(2)} Republican, {parseFloat(item[1][1]).toFixed(2)} Democrat, {parseFloat(item[1][2]).toFixed(2)} Independent*/}
                        </button>
                    </span>
                  ))}
                </div>
                <div>
                  {/*
                  {USMap(percentages, stateInformation)}
                  <br /><br /><br /><br />
                  <br /><br /><br /><br />
                  */}
                </div>
              </div>
            </div>
          }
        </div>
      )}

      {false &&
      <div>
        <h2>Republican Voters:</h2>
        <div className="card-container">
            {republicans.map(person => (
              <div className="card-item2" key={person.id}>
                {person.firstName} {person.lastName}
              </div>
            ))}
        </div>

        <h2>Democrat Voters:</h2>
        <div className="card-container">
            {democrats.map(person => (
              <div className="card-item2" key={person.id}>
                {person.firstName} {person.lastName}
              </div>
            ))}
        </div>

        <h2>Independent Voters:</h2>
        <div className="card-container">
            {independents.map(person => (
              <div className="card-item2" key={person.id}>
                {person.firstName} {person.lastName}
              </div>
            ))}
        </div>
      </div>
      }
      <div>
        <button className='button' onClick={() => navigate('/')}>Return to Home</button>
        <button className='button' onClick={() => window.location.reload()}>Update Status</button>
      </div>
    <br/>
    </div>
  );
}

export default Results;