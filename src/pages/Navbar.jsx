import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import axios from 'axios';

function Navbar() {
    const [data, setData] = useState(null); // Initialize as null instead of an array
    const [userId, setUserId] = useState(localStorage.getItem('userId')); // Store userId in state
    const [requests, setRequests] = useState(false); // Whether the user has approved requests

    // Fetch user data based on accountID (userId)
    const fetchPerson = (accountID) => {
        if (!accountID) return; // If no accountID, don't fetch data
        
        axios.get(`http://localhost:6565/api/data/person/${accountID}`) // Backend API route
            .then(response => {
                setData(response.data[0]);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };
    const fetchRequests = (accountID) => {
        if (!accountID) return; // If no accountID, don't fetch data
        
        axios.get(`http://localhost:6565/api/data/request_form/number_approved/${accountID}`) // Backend API route
            .then(response => {
                setRequests(response.data.length > 0);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    useEffect(() => {
        fetchPerson(userId); // Fetch data when userId changes
        fetchRequests(userId);
    }, [userId]);

    // Update userId from localStorage whenever it changes
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId !== userId) {
            setUserId(storedUserId);
        }
    }, [userId]);

    return (
        <>
            <nav className='navbar'>
                <div className='navbar-container'>
                    <Link to='/' className='navbar-logo'>
                        2024 Elections
                    </Link>
                    <ul className='nav-menu'> 
                        {userId !== null && data !== undefined && data !== null && requests && (
                            <>
                                <li className='nav-item'>
                                    <Link to='/my-vote' className='nav-links'>
                                        Vote Now!
                                    </Link>
                                </li>
                                <li className='nav-item'>
                                    <Link to='/candidates' className='nav-links'>
                                        Races
                                    </Link>
                                </li>
                                <li className='nav-item'>
                                    <Link to='/results' className='nav-links'>
                                        Results
                                    </Link>
                                </li>
                            </>
                        )}
                        <li className='nav-item'>
                            <Link to='/account' className='nav-links'>
                                Account
                            </Link>
                        </li>
                        {/* Admin-only links */}
                        {userId !== null && data !== undefined && data !== null && data.admin ? (
                            <>
                                <li className='nav-item'>
                                    <Link to='/votes' className='nav-links'>
                                        (Admin) Votes
                                    </Link>
                                </li>
                                <li className='nav-item'>
                                    <Link to='/report-generation' className='nav-links'>
                                        (Admin) Report Generation
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <div></div>
                          )}
                    </ul>
                </div>
            </nav>
        </>
    );
}

export default Navbar;
