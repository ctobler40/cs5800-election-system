use election_system;

-- Selecting all states that have a Cook county
select 
	s.stateName
from state s
inner join county c on c.state_id = s.id
where c.countyName = 'Cook';