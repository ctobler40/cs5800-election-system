import React from 'react';
import { render, screen, act } from '@testing-library/react';  // <--- Import act here
import axios from 'axios';
import App from './App';
import '@testing-library/jest-dom';

// Mock the axios get method
jest.mock('axios');

describe('App component', () => {
  test('handles API error', async () => {
    // Mock Axios to return an error
    axios.get.mockRejectedValue(new Error('API Error'));

    await act(async () => {
      render(<App />);
    });

    // You can add assertions here if you handle errors in the UI
    // For example, check for an error message or specific behavior
  });
});


// Test case 2 for ReportGeneration.jsx additional test (if needed)
// import React from 'react';
// import { render, screen, act } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom';
// import axios from 'axios';
// import App from './App';
// import '@testing-library/jest-dom/extend-expect';

// // Mock the axios get method
// jest.mock('axios');

// describe('App component', () => {
//   test('handles API error', async () => {
//     // Mock Axios to return an error
//     axios.get.mockRejectedValue(new Error('API Error'));

//     await act(async () => {
//       render(
//         <MemoryRouter>
//           <App />
//         </MemoryRouter>
//       );
//     });

//     // You can add assertions here if you handle errors in the UI
//     // For example, check for an error message or specific behavior
//   });

//   // Additional test for ReportGeneration route
//   test('renders ReportGeneration page when visiting /report-generation', async () => {
//     axios.get.mockResolvedValue({ data: [] }); // Mock axios response if needed

//     await act(async () => {
//       render(
//         <MemoryRouter initialEntries={['/report-generation']}>
//           <App />
//         </MemoryRouter>
//       );
//     });

//     // Check if the ReportGeneration page content is present
//     expect(screen.getByText('Election Report Generation')).toBeInTheDocument();
//   });
// });
