import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';

function PendingRequests() {
  const [requests, setRequests] = useState([]);
  const [searchRequest, setSearchRequest] = useState('');
  const [route, setRoute] = useState('http://localhost:6565/api/user_requests/pending');

  useEffect(() => {
    fetchPendingRequests();
  }, [route]);

  const fetchPendingRequests = () => {
    axios
      .get(route)
      .then((response) => {
        setRequests(response.data);
      })
      .catch((error) => console.error('Error fetching requests:', error));
  };

  const setIsAdmin = (id) => {
    axios.put(`http://localhost:6565/api/setIsAdmin/${id}`, {
      // Updating person by calling this
    }).then(response => {
      // Anything to run after updating person?
    }).catch(error => {
      console.error('Error updating admin permission:', error);
    });
  };

  const handleAction = (id, user_id, status) => {
    if (status === "Admin") {
      status = "Approved";
      {/* Assign admin to the person */}
      setIsAdmin(user_id);
    }
    axios
      .put(`http://localhost:6565/api/user_requests/update/${id}`, { request_status: status })
      .then(() => {
        alert(`Request ${status}.`);
        fetchPendingRequests(); // Refresh list
      })
      .catch((error) => console.error('Error updating request status:', error));
  };

  return (
    <div>
      <h1 style={{ color: 'white' }}>Pending User Profile Requests</h1>
      {/* Search Requests */}
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent default form submission
            setRoute(
              searchRequest === ''
                ? 'http://localhost:6565/api/user_requests/pending'
                : `http://localhost:6565/api/user_requests/${searchRequest}`
            );
          }}
        >
          <input
            className="input"
            type="text"
            name="search_request"
            placeholder="Email"
            value={searchRequest}
            onChange={(e) => setSearchRequest(e.target.value)} // Update searchRequest state
          />
          <button className="button2">Search</button>
        </form>
      </div>
      <br />

      {/* Request List */}
      <div>
        <table className="info-table">
          <thead>
            <tr>
              <th>Request #</th>
              <th>Email</th>
              <th>Document 1</th>
              <th>Document 2</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? (
              requests.map((req) => (
                <tr key={req.id}>
                  <td>{req.id}</td>
                  <td>{req.email}</td>
                  <td>{req.document_type_1}</td>
                  <td>{req.document_type_2}</td>
                  <td>{req.request_status}</td>
                  <td>
                    <button
                      className="button2"
                      onClick={() => handleAction(req.id, req.user_id, 'Approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="button2"
                      onClick={() => handleAction(req.id, req.user_id, 'Admin')}
                    >
                      Admin
                    </button>
                    <button
                      className="button2"
                      onClick={() => handleAction(req.id, req.user_id, 'Denied')}
                    >
                      Deny
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  No pending requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PendingRequests;
