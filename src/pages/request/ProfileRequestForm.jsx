import React, { useState } from 'react';
import axios from 'axios';

function ProfileRequestForm() {
  const [formData, setFormData] = useState({ document1: '', document2: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (doc1, doc2) => {
    // First make sure that all information is filled out
    if (doc1 === '' || doc2 === '') {
      setError("Make sure all information is filled out!");
    } else {
      axios.post('http://localhost:6565/api/user_requests', {
        user_id: localStorage.getItem('userId'),
        document_type_1: formData.document1,
        document_type_2: formData.document2,
      })
      .then(() => {
        console.log('Request submitted successfully.');
        // Reset form data and set submission state
        setFormData({ document1: '', document2: '' });
        setSubmitted(true); // Show confirmation message
      })
      .catch((error) => console.error('Error submitting request:', error));
    }
  };

  // Logout functionality
  const LogOut = () => {
    localStorage.removeItem('userId');
    navigate('/');
    window.location.reload();
  };

  return (
    <div>
      {!submitted ? (
        <h3>Request Profile Approval</h3>
      ) : (
        <h3>Your submission has been accepted!</h3>
      )}
      <input
        type="text"
        name="document1"
        placeholder="Document Type 1"
        value={formData.document1}
        onChange={handleChange}
      />
      <input
        type="text"
        name="document2"
        placeholder="Document Type 2"
        value={formData.document2}
        onChange={handleChange}
      />
      <button className='button2' onClick={() => handleSubmit(formData.document1, formData.document2)}>Submit</button>
    </div>
  );
}

export default ProfileRequestForm;
