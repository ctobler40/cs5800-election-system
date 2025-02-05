const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
// const bodyParser = require('body-parser');
// const userRequestsRoutes = require('./userRequestsRoutes'); 

const app = express();
app.use(cors());
app.use(express.json());
// app.use(bodyParser.json());
// app.use(userRequestsRoutes);

// Create a MySQL connection
const db = mysql.createConnection({
  host: '127.0.0.1',                  // Or your database host
  user: 'root',                       // Your MySQL username
  password: 'Could*Wrong*48',         // Your MySQL password
  database: 'election_system'         // Name of the database
});

// Test the connection
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Use the report routes
const reportRoutes = require('./routes/reportRoutes')(db); // Pass db instance
app.use('/api/report', reportRoutes); // Use the routes

// Middleware for checking admin permissions
function checkAdmin(req, res, next) {
  const userId = req.query.userId;
  console.log("CheckAdmin Middleware: Received userId =", userId); // Add this log

  if (!userId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const query = 'SELECT is_admin FROM person WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err || results.length === 0 || !results[0].is_admin) {
      console.log("Access denied for userId:", userId); // Log denied access
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  });
}


//#region GET
app.get('/api/data/person', (req, res) => {
  const query = 'SELECT * FROM person';   // Customize your query
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

app.get('/api/data/person/age', (req, res) => {
  const query = 'SELECT * FROM person order by age desc';   // Customize your query
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

app.get('/api/data/person/firstName', (req, res) => {
  const query = 'SELECT * FROM person order by firstName asc';   // Customize your query
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

app.get('/api/data/person/lastName', (req, res) => {
  const query = 'SELECT * FROM person order by lastName asc';   // Customize your query
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

app.get('/api/data/person/email/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM person WHERE email LIKE ?;'; // Use LIKE for partial match
  const searchPattern = `%${id}%`; // Add wildcards around the search term

  db.query(query, [searchPattern], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

app.get('/api/data/person/:id', (req, res) => {
  const { id } = req.params;
  const query = `select
                  p.id,
                  p.firstName as 'firstName',
                  p.lastName as 'lastName',
                  p.email,
                  p.password,
                  p.age,
                  p.is_admin as 'admin',
                  p.poll_station as 'station',
                  a.streetName,
                  a.townName,
                  a.zipCode,
                  c.countyName,
                  s.stateName,
                  s.abbr,
                  ca.firstName as 'candidateFirstName',
                  ca.lastName as 'candidateFirstName',
                  ca.party,
                  r.raceName
                from person p
                inner join address a on p.address_id = a.id
                inner join county c on a.county_id = c.id
                inner join state s on c.state_id = s.id
                inner join vote v on p.id = v.user_id
                inner join candidate ca on v.candidate_id = ca.id
                inner join race r on v.race_id = r.id
                where p.id = ?;`;   // Customize your query
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// GETTING ALL RESULTS
app.get('/api/data/results/:id/:party/:type/:user', (req, res) => {
  const { id, party, type, user } = req.params;
  const query = `
  WITH main_user_info AS (
    SELECT 
        p.id AS main_user_id,
        a.county_id AS main_county_id,
        c.state_id AS main_state_id
    FROM person p
    JOIN address a ON p.address_id = a.id
    JOIN county c ON a.county_id = c.id
    WHERE p.id = ? -- Main user ID
)
SELECT DISTINCT
    p.id,
    p.firstName,
    p.lastName,
    p.email,
    p.password,
    p.age,
    p.address_id,
    s.abbr,
    r.raceType,
    CONCAT(c.firstName, ' ', c.lastName) AS "Voted For"
FROM person p
JOIN vote v ON p.id = v.user_id
JOIN candidate c ON v.candidate_id = c.id
JOIN race r ON v.race_id = r.id
JOIN main_user_info mu ON 1=1 -- Cross join for access to main user data
JOIN address a ON p.address_id = a.id
JOIN county co ON a.county_id = co.id
JOIN state s ON co.state_id = s.id
WHERE c.party = ? -- Republican candidate
AND r.raceType = ? and v.race_id = ?
AND (
    r.raceType = 1 -- Presidential race
    OR (r.raceType = 2 AND co.state_id = mu.main_state_id) -- Government race, same state
    OR (r.raceType = 3 AND co.state_id = mu.main_state_id AND co.id = mu.main_county_id) -- House race, same state and county
);
  `;
  db.query(query, [user, party, type, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// Getting all who voted Republican
app.get('/api/data/party/republican/:id', (req, res) => {
  const { id } = req.params;
  const query = `
  select 
      p.id,
      p.firstName,
      p.lastName,
      p.email,
      p.password,
      p.age,
      p.address_id
  from person p
  left outer join vote v on p.id = v.user_id
  left outer join candidate c on v.candidate_id = c.id
  where c.party = 'R' and v.race_id = ?;
  `;
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// Getting all vote parties from each state
app.get('/api/data/results_state', (req, res) => {
  const query = `
      select 
          s.id as 'stateID',
          s.abbr as 'state',
          s.stateName,
          s.electoralVotes,
          SUM(case when ca.party = 'R' then 1 else 0 end) as 'R_votes',
          SUM(case when ca.party = 'D' then 1 else 0 end) as 'D_votes',
          SUM(case when ca.party = 'I' then 1 else 0 end) as 'I_votes'
      from person p
      inner join address a on p.address_id = a.id
      inner join county c on a.county_id = c.id
      inner join state s on c.state_id = s.id
      inner join vote v on p.id = v.user_id
      inner join candidate ca on v.candidate_id = ca.id
      where v.candidate_id != 1
      group by s.id, s.abbr, s.stateName, s.electoralVotes
      order by s.abbr asc;
  `;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// Get address
app.get('/api/data/address', (req, res) => {
  const query = 'SELECT * FROM address';   // Customize your query
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// Get specific address
app.get('/api/data/address/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM address WHERE id = ?';   // Customize your query
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// Get all races
app.get('/api/data/races', (req, res) => {
  const query = 'SELECT * FROM race';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// Get all admins
app.get('/api/data/admins', (req, res) => {
  const query = 'SELECT * FROM person where is_admin and poll_station = 1;';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// Get all presidents
app.get('/api/data/candidate/president', (req, res) => {
  const query = `SELECT 
                    c.id,
                    c.firstName,
                    c.lastName,
                    c.information,
                    c.party,
                    c.race_id,
                    c.state_running,
                    c.county_running
                  from candidate c
                  inner join race r on c.race_id = r.id
                  where r.raceType = 1;`;   // Customize your query
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// Get all governers
app.get('/api/data/candidate/governer', (req, res) => {
  const query = `SELECT 
                    c.id,
                    c.firstName,
                    c.lastName,
                    c.information,
                    c.party,
                    c.race_id,
                    c.state_running,
                    c.county_running
                  from candidate c
                  inner join race r on c.race_id = r.id
                  where r.raceType = 2;`;   // Customize your query
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// Get all house of reps
app.get('/api/data/candidate/house', (req, res) => {
  const query = `SELECT 
                    c.id,
                    c.firstName,
                    c.lastName,
                    c.information,
                    c.party,
                    c.race_id,
                    c.state_running,
                    c.county_running
                  from candidate c
                  inner join race r on c.race_id = r.id
                  where r.raceType = 3;`;   // Customize your query
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// Getting all governers based on state
app.get('/api/data/candidate/governer/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    select distinct
      c.id,
      c.firstName,
      c.lastName,
      c.information,
      c.party,
      c.race_id,
      c.state_running,
      c.county_running
    from candidate c
    inner join state s on c.state_running = s.id
    inner join county co on s.id = co.state_id
    inner join address a on co.id = a.county_id
    inner join person p on a.id = p.address_id
    where p.id = ?;
  `;
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// Getting all HOR people based on county
app.get('/api/data/candidate/house/:id', (req, res) => {
  const { id } = req.params;
  const query = `select distinct
      c.id,
      c.firstName,
      c.lastName,
      c.information,
      c.party,
      c.race_id,
      c.state_running,
      c.county_running
    from candidate c
    inner join county co on c.county_running = co.id
    inner join address a on co.id = a.county_id
    inner join person p on a.id = p.address_id
    where p.id = ?;`;   // Customize your query
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// Getting our race type
app.get('/api/race_type/:id', (req, res) => {
  const { id } = req.params;
  const query = `select
                   raceType,
                   isActive
                 from race
                 where id = ?;`;   // Customize your query
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// Getting the state based on the address
app.get('/api/data/address/get-state/:id', (req, res) => {
  const { id } = req.params;
  const query = `select * from state s
                inner join county c on c.state_id = s.id
                inner join address a on a.county_id = c.id
                where a.id = ?;`;   // Customize your query
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// Getting the state based on the address
app.get('/api/data/address/get-state/:id', (req, res) => {
  const { id } = req.params;
  const query = `select * from state s
                inner join county c on c.state_id = s.id
                inner join address a on a.county_id = c.id
                where a.id = ?;`;   // Customize your query
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// Getting the state based on the county name
app.get('/api/data/address/get-county/:name/:state_id', (req, res) => {
  const { name, state_id } = req.params;
  const query = `select 
                  c.id
                from county c
                inner join state s on c.state_id = s.id
                where c.countyName = ? and s.id = ?;`;   // Customize your query
  db.query(query, [name, state_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// Getting the state based on the county name
app.get('/api/data/address/get-state-county/:name', (req, res) => {
  const { name } = req.params;
  const query = `select 
                    s.id,
                    s.stateName
                from state s
                inner join county c on c.state_id = s.id
                where c.countyName = ?;`;   // Customize your query
  db.query(query, [name], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// Getting the earliest date to vote depending on the state
app.get('/api/data/person/can-vote/:id', (req, res) => {
  const { id } = req.params;
  const query = `select 
                  p.id,
                  v.candidate_id as 'vote_id',
                  v.race_id,
                  p.firstName,
                  p.lastName,
                  s.voteDay
                from person p
                inner join vote v on p.id = v.user_id
                inner join address a on p.address_id = a.id
                inner join county c on a.county_id = c.id
                inner join state s on c.state_id = s.id
                where p.id = ?;`;   // Customize your query
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// Getting Admin-only Voter Participation Report Generation Route Endpoint
// Admin-only Report Generation Route
app.get('/api/reports', checkAdmin, (req, res) => {
  const { reportType, startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'Start date and end date are required' });
  }

  let query = '';
  switch (reportType) {
    case 'electionResults':
    query = `
        SELECT 
            s.stateName AS State,
            c.firstName AS Candidate_FirstName,
            c.lastName AS Candidate_LastName,
            er.votes AS Total_Votes,
            CONCAT(c.firstName, ' ', c.lastName) AS Outcome,  -- Dynamically create Outcome
            er.date AS Election_Date
        FROM 
            ElectionResults er
        JOIN 
            state s ON er.id = s.id  -- Make sure this maps correctly (e.g., er.state_id if that's the right column)
        JOIN 
            candidate c ON er.participants = c.id
        WHERE 
            er.date BETWEEN ? AND ?  -- Filter by date range
        ORDER BY 
            er.date DESC;
    `;
    break;


      case 'voterParticipation':
        query = `
          SELECT 
              s.stateName AS State,
              co.countyName AS County,
              COUNT(p.id) AS Total_Voters,
              SUM(CASE WHEN p.vote_id != 1 THEN 1 ELSE 0 END) AS Voted_Count
          FROM 
              person p
          JOIN 
              address a ON p.address_id = a.id
          JOIN 
              county co ON a.county_id = co.id
          JOIN 
              state s ON co.state_id = s.id
          GROUP BY 
              s.stateName, co.countyName
          ORDER BY 
              Total_Voters DESC;
        `;
        break;

    default:
      return res.status(400).json({ error: 'Invalid report type' });
  }

  console.log("Executing query:", query);
  console.log("Query parameters:", [startDate, endDate]); // Log query parameters

  // Execute the query with parameters
  db.query(query, [startDate, endDate], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Failed to fetch report data' });
    }
  
    if (results.length === 0) {
      console.log('No results found for the selected date range.');
      return res.status(404).json({ error: 'No results found for the selected date range.' });
    }
  
    console.log('Query results:', results);
    res.json(results);
  });
  
  
});

app.get('/api/user_requests/pending', (req, res) => {
  const query = `
    SELECT ur.id, ur.user_id, p.email, ur.document_type_1, ur.document_type_2, ur.request_status
    FROM user_requests ur
    JOIN person p ON ur.user_id = p.id
    WHERE ur.request_status = 'Pending'
  `;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

app.get('/api/user_requests/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT ur.id, ur.user_id, p.email, ur.document_type_1, ur.document_type_2, ur.request_status
    FROM user_requests ur
    JOIN person p ON ur.user_id = p.id
    WHERE p.email LIKE ?;
  `;
  const searchPattern = `%${id}%`; // Add wildcards around the search term

  db.query(query, [searchPattern], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

app.get('/api/user_requests/id/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT ur.id, ur.user_id, p.email, ur.document_type_1, ur.document_type_2, ur.request_status
    FROM user_requests ur
    JOIN person p ON ur.user_id = p.id
    WHERE p.id = ?;
  `;
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

app.get('/api/user_requests/approved/:id', (req, res) => {
  const { email } = req.params;
  const query = `
    SELECT ur.id, ur.user_id, p.email, ur.document_type_1, ur.document_type_2, ur.request_status
    FROM user_requests ur
    JOIN person p ON ur.user_id = p.id
    WHERE ur.request_status = 'Approved' and p.id = ?;
  `;
  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

//#endregion

//#region ADD
app.post('/api/addPerson', (req, res) => {
  const { firstName, lastName, age, email, password, address_id } = req.body;
  const query = 'INSERT INTO person (firstName, lastName, email, password, age, address_id) VALUES (?, ?, ?, ?, ?, ?)';
  
  db.query(query, [firstName, lastName, email, password, age, address_id], (err, result) => {
    if (err) {
      console.error('Error executing query:', err); // Log the full error object for more detail
      return res.status(500).json({ error: err });
    }
    res.status(200).json({ message: 'Person added successfully', result });
  });
});

app.post('/api/addAddress', (req, res) => {
  const { streetName, townName, zipCode, county_id } = req.body;
  const query = 'INSERT INTO address (streetName, townName, zipCode, county_id) VALUES (?, ?, ?, ?)';
  
  db.query(query, [streetName, townName, zipCode, county_id], (err, result) => {
    if (err) {
      console.error('Error executing query:', err); // Log the full error object for more detail
      return res.status(500).json({ error: err });
    }
    res.status(200).json({ message: 'Address added successfully', result });
  });
});

app.post('/api/addCandidate', (req, res) => {
  const { firstName, lastName, party, race_id, information } = req.body;
  const query = 'INSERT INTO candidate (firstName, lastName, party, race_id, information) VALUES (?, ?, ?, ?, ?)';
  
  db.query(query, [firstName, lastName, party, race_id, information], (err, result) => {
    if (err) {
      console.error('Error executing query:', err); // Log the full error object for more detail
      return res.status(500).json({ error: err });
    }
    res.status(200).json({ message: 'Candidate added successfully', result });
  });
});

app.post('/api/user_requests', (req, res) => {
  const { user_id, document_type_1, document_type_2 } = req.body;

  const query = `
    INSERT INTO user_requests (user_id, document_type_1, document_type_2, request_status) VALUES (?, ?, ?, 'Pending')
  `;
  db.query(query, [user_id, document_type_1, document_type_2], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.status(201).json({ message: 'Request submitted successfully.', requestId: result.insertId });
  });
});

app.post('/api/race', (req, res) => {
  const { race_name, race_type, election_date } = req.body;

  const query = `
    INSERT INTO race (raceName, raceType, electionDate, isActive) VALUES (?, ?, ?, true);
  `;
  db.query(query, [race_name, race_type, election_date], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.status(201).json({ message: 'Request submitted successfully.', requestId: result.insertId });
  });
});

// This will add in votes for the newly created user
app.post('/api/votes/newUser/:id', (req, res) => {
  const { id } = req.params;

  const query = `
    INSERT INTO vote (user_id, race_id, candidate_id)
    SELECT 
        p.id AS user_id,
        r.id AS race_id,
        1 AS candidate_id
    FROM 
        person p
    CROSS JOIN 
        (SELECT id FROM race WHERE id > 1) as r
    WHERE 
        p.id = ?;
  `;
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.status(201).json({ message: 'Request submitted successfully.', requestId: result.insertId });
  });
});

// This will add in votes for the newly created poll
app.post('/api/votes/newPoll/:id', (req, res) => {
  const { id } = req.params;

  const query = `
    INSERT INTO vote (user_id, race_id, candidate_id)
    SELECT 
        p.id AS user_id,
        ? AS race_id,
        1 AS candidate_id 
    FROM 
        person p;
  `;
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.status(201).json({ message: 'Request submitted successfully.', requestId: result.insertId });
  });
});

//#endregion

//#region UPDATE
app.put('/api/updatePerson/:id', (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, age, email, password } = req.body;
  const query = 'UPDATE person SET firstName = ?, lastName = ?, age = ?, email = ?, password = ? WHERE id = ?';
  db.query(query, [firstName, lastName, age, email, password, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.status(200).json({ message: 'Person updated successfully', result });
  });
});

app.put('/api/updatePerson/poll/:id', (req, res) => {
  const { id } = req.params;
  const { poll_station } = req.body;

  // Validate poll_station
  if (!poll_station) {
    return res.status(400).json({ error: 'poll_station is required' });
  }

  const query = 'UPDATE person SET poll_station = ? WHERE id = ?';

  db.query(query, [poll_station, id], (err, result) => {
    if (err) {
      console.error('Error updating poll_station:', err);
      return res.status(500).json({ error: err });
    }
    res.status(200).json({ message: 'Poll station updated successfully', result });
  });
});

app.put('/api/setIsAdmin/:id', (req, res) => {
  const { id } = req.params;
  const query = 'UPDATE person SET is_admin = 1 WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.status(200).json({ message: 'Person updated successfully', result });
  });
});

app.put('/api/updateVote/:id', (req, res) => {
  const { id } = req.params;
  const { vote_id, race_id } = req.body;
  const query = `update vote 
                   set candidate_id = ?
                 where user_id = ? and race_id = ?;`;
  db.query(query, [vote_id, id, race_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.status(200).json({ message: 'Person updated successfully', result });
  });
});

app.put('/api/updatePassword/:id', (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  const query = 'UPDATE person SET password = ? WHERE id = ?';
  db.query(query, [password, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.status(200).json({ message: 'Person updated successfully', result });
  });
});

app.put('/api/updateCandidate/:id', (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, party, information } = req.body;
  const query = 'UPDATE candidate SET firstName = ?, lastName = ?, party = ?, information = ? WHERE id = ?';
  
  db.query(query, [firstName, lastName, party, information, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.status(200).json({ message: 'Person updated successfully', result });
  });
});

app.put('/api/updateRace/:id', (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  const query = 'UPDATE race SET isActive = ? WHERE id = ?';
  
  db.query(query, [isActive, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.status(200).json({ message: 'Person updated successfully', result });
  });
});

app.put('/api/user_requests/update/:id', (req, res) => {
  const { id } = req.params;
  const { request_status } = req.body; // 'Approved' or 'Denied'

  const query = `
    UPDATE user_requests
    SET request_status = ?, updated_at = NOW()
    WHERE id = ?
  `;
  db.query(query, [request_status, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ message: `Request ${request_status} successfully.` });
  });
});

//#endregion

//#region DELETE
app.delete('/api/deletePerson/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM person WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.status(200).json({ message: 'Person deleted successfully', result });
  });
});

app.delete('/api/deleteCandidate/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM candidate WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.status(200).json({ message: 'Candidate deleted successfully', result });
  });
});

// This will remove all votes from recently deleted polls
app.delete('/api/deleteVotes/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM vote WHERE race_id = ?;';
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.status(200).json({ message: 'Candidate deleted successfully', result });
  });
});

//#endregion

//#region MISC

// Getting the number of approved documents
app.get('/api/data/request_form/number_approved/:id', (req, res) => {
  const { id } = req.params;
  const query = `SELECT * 
            FROM user_requests u
            JOIN person p ON u.user_id = p.id
            WHERE (u.request_status = 'approved' AND u.user_id = ?) 
            OR (p.is_admin = 1 AND p.id = ?);
          `;   // Customize your query
  db.query(query, [id, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});


//#endregion

const PORT = process.env.PORT || 6565;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));