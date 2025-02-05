-- Step 1: Use the correct database
USE election_system;

-- Step 2: Confirm the active database (Optional, for verification)
SELECT DATABASE();

-- Step 3: Disable safe update mode
SET SQL_SAFE_UPDATES = 0;

-- Step 4: Insert data (Optional, only if needed to test duplicates)
INSERT INTO ElectionResults (participants, votes, outcome, date)
VALUES
(100, 5000, 'Candidate A Wins', '2024-11-01'),
(120, 6000, 'Candidate B Wins', '2024-11-02');

-- Step 5: Remove duplicate rows
WITH CTE AS (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY participants, votes, outcome, date ORDER BY id) AS row_num
    FROM ElectionResults
)
DELETE FROM ElectionResults
WHERE id IN (SELECT id FROM CTE WHERE row_num > 1);

-- Step 6: Re-enable safe update mode
SET SQL_SAFE_UPDATES = 1;

-- Optional: View the updated table
SELECT * FROM ElectionResults;
