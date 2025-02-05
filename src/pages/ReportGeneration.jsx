  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import { useNavigate } from 'react-router-dom';
  import jsPDF from 'jspdf';
  import 'jspdf-autotable';
  import * as XLSX from 'xlsx'; // Import XLSX, high risk library reported "npm audit"
  import '../App.css';

  function ReportGeneration() {
    const [reportData, setReportData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportType, setReportType] = useState('electionResults'); // Default report type
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const userId = localStorage.getItem('userId');

    useEffect(() => {
      if (!userId) {
        navigate('/login');
      }
    }, [userId, navigate]);

    const fetchReportData = async () => {
      if (!startDate || !endDate) {
        setError("Please select both start and end dates.");
        return;
      }
    
      try {
        console.log("Fetching report data...");
        const response = await axios.get("http://localhost:6565/api/reports", {
          params: { reportType, startDate, endDate, userId },
        });
        console.log("Report data received:", response.data);
    
        if (response.data.length === 0) {
          setError("No data found for the selected date range.");
          setReportData([]);
        } else {
          setReportData(response.data);
          setError('');
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError("No data found for the selected date range.");
          setReportData([]); // Clear report data
        } else {
          console.error("Error fetching report data:", error);
          setError("Failed to fetch report data. Please try again.");
        }
      }
    };
    

    const exportToPDF = () => {
      const doc = new jsPDF();
      doc.text("Election Report", 20, 10);
      const tableBody = reportData.map(item => 
        reportType === 'electionResults'
          ? [item.State, item.Candidate_FirstName, item.Candidate_LastName, item.Total_Votes, item.Outcome, item.Election_Date]
          : [item.State, item.County, item.Total_Voters, item.Voted_Count]
      );

      doc.autoTable({
        head: reportType === 'electionResults'
          ? [['State', 'Candidate First Name', 'Candidate Last Name', 'Total Votes', 'Outcome', 'Election Date']]
          : [['State', 'County', 'Total Voters', 'Voted Count']],
        body: tableBody,
      });
      doc.save(`${reportType}_report.pdf`);
    };

    const exportToExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(reportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, `${reportType} Report`);
      XLSX.writeFile(workbook, `${reportType}_report.xlsx`);
    };

    return (
      <div className="report-generation">
        <h1>Election Report Generation</h1>
        <div>
          <label>Report Type:</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="electionResults">Election Results</option>
            <option value="voterParticipation">Voter Participation</option>
          </select>
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button className="button" onClick={fetchReportData}>
            Generate Report
          </button>
        </div>
        {error && <p className="error">{error}</p>}
        {reportData.length > 0 && (
          <div>
            <h2>Report Summary</h2>
            <table className="report-table">
              <thead>
                <tr>
                  {reportType === 'electionResults' ? (
                    <>
                      <th>State</th>
                      <th>Candidate First Name</th>
                      <th>Candidate Last Name</th>
                      <th>Total Votes</th>
                      <th>Outcome</th>
                      <th>Election Date</th>
                    </>
                  ) : (
                    <>
                      <th>State</th>
                      <th>County</th>
                      <th>Total Voters</th>
                      <th>Voted Count</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {reportData.map((item, index) => (
                  <tr key={index}>
                    {reportType === 'electionResults' ? (
                      <>
                        <td>{item.State}</td>
                        <td>{item.Candidate_FirstName}</td>
                        <td>{item.Candidate_LastName}</td>
                        <td>{item.Total_Votes}</td>
                        <td>{item.Outcome}</td>
                        <td>{item.Election_Date}</td>
                      </>
                    ) : (
                      <>
                        <td>{item.State}</td>
                        <td>{item.County}</td>
                        <td>{item.Total_Voters}</td>
                        <td>{item.Voted_Count}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="button" onClick={exportToPDF}>
              Export to PDF
            </button>
            <button className="button" onClick={exportToExcel}>
              Export to Excel
            </button>
          </div>
        )}
      </div>
    );
  }

  export default ReportGeneration;
