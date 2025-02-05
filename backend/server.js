const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',                  // Or your database host
  user: 'root',                       // Your MySQL username
  password: 'Could*Wrong*48',         // Your MySQL password
  database: 'health_system'         // Name of the database
});

// Test the connection
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

//#region GET
app.get('/api/data/patient', (req, res) => {
  const query = 'SELECT * FROM patient';   // Customize your query
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

app.get('/api/data/patient-info/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    select 
        p.id,
        p.first_name,
        p.last_name,
        p.email,
        p.username,
        p.pass_word as "password",
        p.age, 
        p.date_of_birth,
        p.contact_number,
        e.first_name as "physician_first_name",
        e.last_name as "physician_last_name",
        e.email as "physician_email",
        e.age as "physician_age", 
        e.date_of_birth as "physician_dob",
        h.hospital_name,
        h.city
    from patient p
    inner join employee e on p.physician_id = e.id
    inner join hospital h on p.hospital_id = h.id
    where p.id = ?;
  `;   // Customize your query
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

app.get('/api/data/physician', (req, res) => {
  const query = 'SELECT * FROM employee';   // Customize your query
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

app.get('/api/data/physician-info/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    select 
        p.id,
        p.first_name,
        p.last_name,
        p.email,
        p.username,
        p.pass_word as "password",
        p.age, 
        p.date_of_birth,
        p.contact_number,
        e.first_name as "physician_first_name",
        e.last_name as "physician_last_name",
        e.email as "physician_email",
        e.age as "physician_age", 
        e.date_of_birth as "physician_dob",
        h.hospital_name,
        h.city
    from patient p
    inner join employee e on p.physician_id = e.id
    inner join hospital h on p.hospital_id = h.id
    where e.id = ?;
  `;   // Customize your query
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

app.get('/api/data/physician-info/patients/:id', (req, res) => {
  const { id } = req.params;
  const query = ```select *,
	e.first_name as "phys_first",
	e.last_name as "phys_last"
from patient p
inner join employee e on p.physician_id = e.id
where e.id = ?;```;   // Customize your query
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

app.get('/api/data/insurance-info/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    select 
        p.id,
        p.first_name,
        p.last_name,
        i.insurance_number,
        i.provider as "insurance_provider",
        i.coverage as "insurance_coverage",
        i.start_date as "insurance_start_date",
        i.expiration_date as "insurance_expiration_date",
        c.amount as "claim_amount",
        c.claim_date,
        b.amount_due as "billing_amount_due",
        b.amount_paid as "billing_amount_paid",
        (b.amount_due - b.amount_paid) AS billing_amount_owed, -- Calculate Amount Owed
        b.due_date as "billing_due_date"
    from patient p
    inner join insurance i on p.id = i.patient_id
    inner join claim c on i.id = c.insurance_id
    inner join billing b on c.id = b.claim_id
    where p.id = ?;
  `;   // Customize your query
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// Billing details via stored procedure
// app.get('/api/data/billing/:patientId', (req, res) => {
//   const { patientId } = req.params;
//   const query = 'CALL ViewPatientBilling(?)';
  
//   db.query(query, [patientId], (err, results) => {
//       if (err) {
//           console.error('Error executing query:', err);
//           return res.status(500).json({ error: err.message });
//       }
//       res.status(200).json(results[0]);
//   });
// });

app.get('/api/data/billing/:patientName', (req, res) => {
  const { patientName } = req.params;

  // Split the name back into first and last name
  const [firstName, lastName] = patientName.split('_');

  // Query to fetch patientID by name
  const getIdQuery = `
      SELECT id FROM patient 
      WHERE first_name = ? AND last_name = ?
  `;

  db.query(getIdQuery, [firstName, lastName], (err, results) => {
      if (err) {
          console.error('Error fetching patient ID:', err);
          return res.status(500).json({ error: err.message });
      }

      if (results.length === 0) {
          return res.status(404).json({ error: 'Patient not found' });
      }

      const patientID = results[0].id;

      // Now call the billing stored procedure with the patient ID
      const billingQuery = 'CALL ViewPatientBilling(?)';
      db.query(billingQuery, [patientID], (err, results) => {
          if (err) {
              console.error('Error executing billing query:', err);
              return res.status(500).json({ error: err.message });
          }
          console.log('Billing Query Results:', results[0]); // Log the results for debugging

          // Verify if BillID exists in the response
          if (!results[0].some((entry) => entry.BillID)) {
              console.error('BillID is missing in the billing query results.');
          }
          
          res.status(200).json(results[0]);
      });
  });
});


// Update payment
app.put('/api/data/updatePayment/:billId', (req, res) => {
  const { billId } = req.params;
  const { amountPaid } = req.body;

  // Debug logs to check input values
  console.log("Update Payment Request - Bill ID:", billId);
  console.log("Update Payment Request - Amount Paid:", amountPaid);

  // Validate input
  if (!billId || isNaN(billId)) {
      console.error('Invalid bill ID:', billId);
      return res.status(400).json({ error: 'Invalid bill ID.' });
  }
  if (!amountPaid || isNaN(amountPaid) || amountPaid <= 0) {
      console.error('Invalid amount paid:', amountPaid);
      return res.status(400).json({ error: 'Invalid payment amount.' });
  }

  const query = `
      UPDATE billing
      SET amount_paid = amount_paid + ?
  `;

  db.query(query, [amountPaid, amountPaid, billId], (err, result) => {
      if (err) {
          console.error('Error updating payment:', err);
          return res.status(500).json({ error: 'Failed to update payment.' });
      }

      console.log("Payment Update Query Result:", result);

      const checkStatusQuery = `
          UPDATE billing
          SET amount_due = 0
          WHERE id = ? AND amount_due <= 0
      `;
      
      db.query(checkStatusQuery, [billId], (statusErr, statusResult) => {
          if (statusErr) {
              console.error('Error updating billing status:', statusErr);
              return res.status(500).json({ error: 'Failed to update billing status.' });
          }

          console.log("Billing Status Check Query Result:", statusResult);
          res.status(200).json({ message: 'Payment updated successfully', result });
      });
  });
});



app.get('/api/data/appointment-info/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    select 
        p.id,
        p.first_name,
        p.last_name,
        a.appt_date,
        a.reason as "quick_summary",
        s.subjective,
        s.objective,
        s.assessment,
        s.plan
    from patient p
    inner join appointment a on p.id = a.patient_id
    inner join SOAP s on a.SOAP_id = s.id
    where p.id = ?;
  `;   // Customize your query
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

app.get('/api/data/employee', (req, res) => {
    const query = 'SELECT * FROM employee';   // Customize your query
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json(results);
    });
  });

app.get('/api/data/hospital', (req, res) => {
    const query = 'SELECT * FROM hospital';   // Customize your query
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json(results);
    });
  });
//#endregion

//#region ADD
app.post('/api/addPatient', (req, res) => {
  const {
    firstName,
    lastName,
    email,
    username,
    password, // Corrected name
    age,
    date_of_birth,
    contact_number,
    hospital_id,
    physician_id,
  } = req.body;

  const query = `
    INSERT INTO patient 
      (first_name, last_name, email, username, pass_word, age, date_of_birth, contact_number, hospital_id, physician_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [firstName, lastName, email, username, password, age, date_of_birth, contact_number, hospital_id, physician_id],
    (err, result) => {
      if (err) {
        console.error('Error executing query:', err); // Log the full error object for more detail
        return res.status(500).json({ error: err });
      }
      res.status(200).json({ message: 'Patient added successfully', result });
    }
  );
});

app.post('/api/addAppointment/:id', (req, res) => {
  const { id } = req.params;
  const { appt_date, reason, SOAP_id } = req.body;
  const query = 'INSERT INTO appointment (appt_date, reason, patient_id, SOAP_id) VALUES (?, ?, ?, ?)';
  
  db.query(query, [appt_date, reason, id, SOAP_id], (err, result) => {
    if (err) {
      console.error('Error executing query:', err); // Log the full error object for more detail
      return res.status(500).json({ error: err });
    }
    res.status(200).json({ message: 'Patient added successfully', result });
  });
});

app.post('/api/addSOAP', (req, res) => {
  const { subjective, objective, assessment, plan } = req.body;
  const query = 'INSERT INTO SOAP (subjective, objective, assessment, plan) VALUES (?, ?, ?, ?)';

  db.query(query, [subjective, objective, assessment, plan], (err, result) => {
    if (err) {
      console.error('Error executing query:', err); // Log the full error
      return res.status(500).json({ error: err });
    }
    res.status(200).json({ message: 'SOAP added successfully', result });
  });
});
//#endregion

//#region UPDATE
app.put('/api/updatePatient/:id', (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, age, admission_date, physician_id, hospital_id } = req.body;
  const query = 'UPDATE patient SET firstName = ?, lastName = ?, age = ?, admission_date = ?, physician_id = ?, hospital_id WHERE id = ?';
  db.query(query, [firstName, lastName, age, admission_date, physician_id, hospital_id, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.status(200).json({ message: 'Patient updated successfully', result });
  });
});
//#endregion

//#region DELETE
app.delete('/api/deletePatient/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM patient WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.status(200).json({ message: 'Patient deleted successfully', result });
  });
});
//#endregion

const PORT = process.env.PORT || 6500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));