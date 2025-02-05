drop database if exists health_system;
create database health_system;
use health_system;

-- Creating Tables
create table hospital (
	id int primary key auto_increment,
    hospital_name varchar(30) not null,
    city varchar(40) not null,
    max_capacity int not null
);

create table employee_status (
	id int primary key auto_increment,
    curr_status varchar(20) not null
);

create table employee_role (
	id int primary key auto_increment,
    role_name varchar(20) not null
);

create table employee_permission (
	id int primary key auto_increment,
    permission varchar(30) not null,
    role_id int not null,
	constraint fk_permission_role_id
		foreign key (role_id)
		references employee_role(id)
);

create table SOAP (
	id int primary key auto_increment,
    subjective longtext not null,
    objective longtext not null,
    assessment longtext not null,
    plan longtext not null
);

create table employee (
	id int primary key auto_increment,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    email varchar(40) not null,
    username varchar(40) not null,
    pass_word varchar(40) not null,
    age int not null,
    date_of_birth date not null,
    phone_number varchar(11) not null,
    status_id int not null,
    hospital_id int not null,
    role_id int not null,
	constraint fk_employee_status_id
		foreign key (status_id)
		references employee_status(id),
	constraint fk_employee_hospital_id
		foreign key (hospital_id)
		references hospital(id),
	constraint fk_employee_role_id
		foreign key (role_id)
		references employee_role(id)
);

create table patient (
	id int primary key auto_increment,
    first_name varchar(20) not null,
    last_name varchar(30) not null,
    email varchar(40) not null,
    username varchar(40) null,
    pass_word varchar(40) null,
    age int not null,
    date_of_birth date not null,
    contact_number varchar(11) not null,
    hospital_id int not null,
    physician_id int not null,
	constraint fk_patient_hospital_id
		foreign key (hospital_id)
		references hospital(id),
	constraint fk_patient_employee_id
		foreign key (physician_id)
		references employee(id)
);

create table insurance (
	id int primary key auto_increment,
    insurance_number varchar(20) not null,
    provider varchar(30) not null,
    coverage varchar(30) not null,
    start_date date not null,
    expiration_date date not null,
    patient_id int not null,
	constraint fk_insurance_patient_id
		foreign key (patient_id)
		references patient(id)
);

create table claim (
	id int primary key auto_increment,
    amount decimal(10, 2) not null,
    claim_date date not null,
    insurance_id int not null,
	constraint fk_claim_insurance_id
		foreign key (insurance_id)
		references insurance(id)
);

create table billing (
	id int primary key auto_increment,
    amount_due decimal(10, 2) not null,
    amount_paid decimal(10, 2) not null,
    due_date date not null,
    claim_id int not null,
	constraint fk_billing_claim_id
		foreign key (claim_id)
		references claim(id)
);

create table appointment (
	id int primary key auto_increment,
    appt_date date not null,
    reason mediumtext not null,
    patient_id int not null,
    SOAP_id int not null,
	constraint fk_appointment_patient_id
		foreign key (patient_id)
		references patient(id),
	constraint fk_appointment_SOAP_id
		foreign key (SOAP_id)
		references SOAP(id)
);

create table employee_schedule (
	id int primary key auto_increment,
    schedule_date datetime not null,
    available bool not null,
    employee_id int not null,
	constraint fk_schedule_employee_id
		foreign key (employee_id)
		references employee(id)
);

-- Inseting Information into Tables
insert into hospital (hospital_name, city, max_capacity) values
	('General Hospital', 'New York', 500),
	('City Medical Center', 'Los Angeles', 350),
	('Valley Healthcare', 'San Francisco', 200);
    
insert into employee_status (curr_status) values
	('Active'),
	('On Leave'),
	('In Meeting'),
	('On Call'),
	('In Surgery'),
	('Training'),
	('Unavailable'),
	('Working Remotely'),
	('Vacation'),
	('Under Review');

insert into employee_role (role_name) values
	('Doctor'),
	('Nurse'),
	('Surgeon'),
	('Receptionist'),
	('Pharmacist'),
	('Radiologist'),
	('Lab Technician'),
	('Physician Assistant'),
	('Therapist'),
	('Paramedic');

insert into employee_permission (permission, role_id) values
	('View Medical Records', 1),         -- Doctor
	('Edit Medical Records', 1),         -- Doctor
	('View Patient Schedules', 2),       -- Nurse
	('Administer Medication', 2),        -- Nurse
	('Schedule Appointments', 4),        -- Receptionist
	('Manage Inventory', 5),             -- Pharmacist
	('Access Operating Room', 3),        -- Surgeon
    ('Conduct Lab Tests', 7),              -- Lab Technician
	('Operate Imaging Equipment', 6),      -- Radiologist
	('Assist in Surgery', 8),              -- Physician Assistant
	('Handle Patient Discharges', 4),      -- Receptionist
	('Manage Patient Intake', 4),          -- Receptionist
	('Monitor Vital Signs', 2),            -- Nurse
	('Provide Physical Therapy', 9),       -- Therapist
	('Dispense Medication', 5),            -- Pharmacist
	('Prepare Medical Reports', 7);        -- Lab Technician
    
insert into SOAP (subjective, objective, assessment, plan) values
	('Patient reports severe headache', 'Blood pressure elevated', 'Possible migraine', 'Prescribe pain medication, follow-up in 1 week'),
	('Patient complains of chest pain', 'ECG shows irregular rhythm', 'Potential heart arrhythmia', 'Schedule cardiology consultation, order blood tests'),
	('Patient reports persistent cough', 'Chest X-ray reveals congestion', 'Suspected pneumonia', 'Start antibiotics, hydration advice'),
	('Patient feels fatigued', 'Blood tests indicate anemia', 'Iron deficiency anemia', 'Prescribe iron supplements, dietary changes'),
	('Patient has sore throat', 'Throat appears red and swollen', 'Possible strep throat', 'Administer rapid strep test, start antibiotics if positive'),
	('Patient reports joint pain', 'Swelling in knees', 'Suspected arthritis', 'Recommend anti-inflammatory medication and physiotherapy'),
	('Patient feels shortness of breath', 'Oxygen saturation slightly low', 'Asthma exacerbation', 'Prescribe inhaler, advise on asthma triggers'),
	('Patient complains of abdominal pain', 'Tenderness in lower abdomen', 'Possible appendicitis', 'Order ultrasound, consult surgery'),
	('Patient reports dizziness', 'Normal neurological exam', 'Likely vertigo', 'Prescribe anti-vertigo medication, recommend follow-up if symptoms persist'),
	('Patient feels chest tightness', 'Mild wheezing on auscultation', 'Possible bronchitis', 'Prescribe bronchodilator, advise rest and fluids'),
	('Patient has frequent urination', 'Urinalysis positive for bacteria', 'Urinary tract infection', 'Start antibiotics, hydration advice'),
	('Patient reports back pain', 'Limited range of motion', 'Muscular strain', 'Recommend rest, physical therapy'),
	('Patient complains of skin rash', 'Red, itchy patches on arms', 'Possible eczema', 'Prescribe topical cream, recommend avoiding irritants'),
	('Patient reports leg swelling', 'Blood tests normal, no DVT detected', 'Likely edema', 'Advise compression stockings, reduce salt intake'),
	('Patient feels nauseous and dizzy', 'Normal vitals', 'Possible food poisoning', 'Prescribe anti-nausea medication, recommend hydration'),
	('Patient has severe lower back pain', 'MRI shows a herniated disc', 'Disc herniation', 'Refer to orthopedic specialist, prescribe pain relief'),
	('Patient reports insomnia', 'No abnormalities on physical exam', 'Sleep disorder', 'Suggest sleep hygiene techniques, consider melatonin supplements'),
	('Patient complains of blurred vision', 'Eye exam shows retinal changes', 'Diabetic retinopathy', 'Refer to ophthalmologist, monitor blood glucose levels'),
	('Patient reports frequent nosebleeds', 'Blood pressure slightly elevated', 'Hypertension', 'Prescribe antihypertensive, follow up in 2 weeks'),
	('Patient feels abdominal bloating', 'Palpable mass in lower abdomen', 'Possible ovarian cyst', 'Schedule ultrasound, consult gynecology'),
	('Patient has high fever and chills', 'Throat and lymph nodes swollen', 'Mononucleosis', 'Advise rest, hydration, and pain relief'),
	('Patient feels tingling in hands', 'EMG shows nerve compression', 'Carpal tunnel syndrome', 'Recommend wrist brace, consider physical therapy'),
	('Patient reports loss of appetite', 'Weight loss noted', 'Possible depression', 'Refer to mental health services, schedule follow-up'),
	('Patient complains of difficulty swallowing', 'Redness in throat', 'Possible esophagitis', 'Prescribe antacid, advise dietary changes'),
	('Patient has persistent sinus pain', 'Sinuses tender to touch', 'Chronic sinusitis', 'Prescribe decongestants, recommend steam inhalation'),
    ('Patient complains of severe fatigue', 'Low blood iron levels', 'Anemia', 'Prescribe iron supplements, follow-up in 3 months'),
    ('Patient reports chronic headaches', 'CT scan shows no abnormalities', 'Chronic tension headaches', 'Prescribe muscle relaxants, refer to physiotherapy'),
    ('Patient complains of itchy eyes', 'Redness and swelling observed', 'Allergic conjunctivitis', 'Prescribe antihistamine eye drops, advise avoiding allergens'),
    ('Patient has a sore neck', 'Limited range of motion', 'Cervical strain', 'Recommend hot/cold therapy and stretching exercises'),
    ('Patient reports pain in shoulder', 'X-ray shows minor joint inflammation', 'Bursitis', 'Recommend anti-inflammatory medication and rest'),
    ('Patient reports stomach cramps', 'Tender abdomen', 'Irritable bowel syndrome', 'Advise dietary changes, prescribe antispasmodics'),
    ('Patient experiences frequent urination', 'Normal glucose levels', 'Overactive bladder', 'Prescribe bladder control medication, recommend exercises'),
    ('Patient complains of difficulty sleeping', 'Blood pressure normal', 'Insomnia', 'Recommend sleep hygiene practices, consider melatonin'),
    ('Patient has joint stiffness', 'Swelling in hands and fingers', 'Early-stage arthritis', 'Recommend physical therapy and anti-inflammatory meds'),
    ('Patient feels shortness of breath during exercise', 'Normal oxygen saturation', 'Exercise-induced asthma', 'Prescribe inhaler, advise warm-up exercises'),
    ('Patient reports severe menstrual cramps', 'Normal pelvic exam', 'Primary dysmenorrhea', 'Prescribe pain relief, consider hormonal therapy'),
    ('Patient reports loss of hearing in left ear', 'Ear canal shows wax buildup', 'Impacted cerumen', 'Schedule ear irrigation procedure'),
    ('Patient experiences sudden chest pain', 'ECG normal, vitals stable', 'Musculoskeletal chest pain', 'Advise rest and prescribe pain relief'),
    ('Patient complains of burning sensation while urinating', 'Urinalysis positive for bacteria', 'Urinary tract infection', 'Prescribe antibiotics and advise hydration'),
    ('Patient has tingling sensation in hands', 'Reflexes normal, no signs of neuropathy', 'Likely carpal tunnel syndrome', 'Recommend wrist brace and physiotherapy');


insert into employee (first_name, last_name, email, username, pass_word, age, date_of_birth, phone_number, status_id, hospital_id, role_id) values
	('John', 'Doe', 'john.doe@healthnet.com', 'john_doe_92', 'Passw0rd@1', 32, '1992-03-15', '5551234567', 1, 2, 1),
	('Jane', 'Smith', 'jane.smith@medicentral.com', 'jane_smith_96', 'Sm1th!Jane', 28, '1996-06-10', '5559876543', 2, 2, 2),
	('Alice', 'Brown', 'alice.brown@careplus.com', 'alice_b_83', 'Br0wn@123', 41, '1983-07-21', '5552345678', 3, 2, 3),
	('Bob', 'Johnson', 'bob.johnson@healthpro.com', 'bob_j_88', 'J0hns0n#Bob', 36, '1988-02-19', '5558765432', 4, 2, 4),
	('Clara', 'Wilson', 'clara.wilson@clinicare.com', 'wilson_clara95', 'C1ara!95', 29, '1995-11-08', '5553456789', 5, 2, 5),
	('David', 'Lee', 'david.lee@medifast.com', 'dlee_79', 'Le3@David', 45, '1979-04-30', '5554567890', 6, 2, 6),
	('Emma', 'Thomas', 'emma.thomas@wellness.com', 'emma_t_90', 'Th0mas@Emma', 34, '1990-09-12', '5555678901', 1, 2, 7),
	('Liam', 'White', 'liam.white@doclink.com', 'liam_w_93', 'Wh!t3Liam', 31, '1993-08-25', '5556789012', 2, 2, 8),
	('Sophia', 'King', 'sophia.king@healthhub.com', 'sophie_king88', 'K1ngSoph!a', 36, '1988-05-19', '5557890123', 3, 2, 9),
	('James', 'Scott', 'james.scott@medicall.com', 'j_scott84', 'Sc0tt@James', 40, '1984-12-07', '5558901234', 4, 2, 1),
	('Olivia', 'Clark', 'olivia.clark@patientcare.com', 'olivia_c89', 'Clark!0liv', 35, '1989-11-02', '5559012345', 5, 2, 2),
	('Ethan', 'Lewis', 'ethan.lewis@healthworks.com', 'e_lewis92', 'L3wis@Ethan', 32, '1992-04-23', '5551234568', 1, 2, 3),
	('Mia', 'Walker', 'mia.walker@medisys.com', 'mwalker90', 'W@lkerMia', 34, '1990-06-15', '5552345679', 2, 2, 4),
	('Noah', 'Hill', 'noah.hill@docservices.com', 'noahhill_91', 'H1llNo@h', 33, '1991-10-30', '5553456780', 3, 2, 5),
	('Charlotte', 'Green', 'charlotte.green@quickmed.com', 'char_green87', 'Gre3n@Char', 37, '1987-07-12', '5554567891', 4, 2, 6),
	('Aiden', 'Young', 'aiden.young@medix.com', 'a_young90', 'YoungAid@en', 34, '1990-02-05', '5555678902', 5, 2, 7),
	('Harper', 'Allen', 'harper.allen@healthfirst.com', 'h_allen94', 'All3n!Harp', 30, '1994-03-20', '5556789013', 6, 2, 8),
	('Elijah', 'Perez', 'elijah.perez@medcare.com', 'eperez91', 'P3rez@El!jah', 33, '1991-09-10', '5557890124', 1, 2, 9),
	('Amelia', 'Cook', 'amelia.cook@careplus.com', 'acook_89', 'CookAm3l!a', 35, '1989-01-25', '5558901235', 2, 2, 1),
	('Oliver', 'Brooks', 'oliver.brooks@wellness.com', 'obrooks90', 'Br00ks@Ol', 34, '1990-04-16', '5559012346', 3, 2, 2),
	('Ava', 'Gray', 'ava.gray@docconnect.com', 'gray_ava87', 'Gr@yAv4', 37, '1987-11-08', '5551234569', 4, 2, 3),
	('Lucas', 'Reed', 'lucas.reed@medicentral.com', 'lreed93', 'Re3d@Lucas', 31, '1993-05-18', '5552345670', 5, 2, 4),
	('Ella', 'Bennett', 'ella.bennett@healthpro.com', 'ebennett88', 'Ben3tt!Ella', 36, '1988-09-11', '5553456781', 6, 2, 5),
	('Benjamin', 'Bailey', 'benjamin.bailey@medifast.com', 'bbailey92', 'Ba!l3yBen', 32, '1992-07-04', '5554567892', 1, 2, 6),
	('Isabella', 'Mitchell', 'isabella.mitchell@healthservices.com', 'imitchell90', 'Mit!ch3llI', 34, '1990-05-25', '5555678903', 2, 2, 7),
	('Henry', 'Carter', 'henry.carter@carehub.com', 'hcarter91', 'C@rt3rHen', 33, '1991-10-12', '5556789014', 3, 2, 8),
	('Emily', 'Rogers', 'emily.rogers@healthlink.com', 'rogers_emily', 'Rog3rs!Em', 38, '1986-06-30', '5557890125', 4, 2, 9),
	('Jack', 'Ramirez', 'jack.ramirez@medix.com', 'j_ramirez', 'Ram!rezJ@ck', 29, '1995-03-28', '5558901236', 5, 2, 1),
	('Sophie', 'Powell', 'sophie.powell@medisys.com', 'spowell87', 'Pow3ll@Soph', 37, '1987-09-09', '5559012347', 6, 2, 2),
	('Daniel', 'Cooper', 'daniel.cooper@healthworks.com', 'dcooper93', 'C00p3r@D', 31, '1993-02-14', '5551234570', 1, 2, 3),
	('Abigail', 'Flores', 'abigail.flores@medifast.com', 'flores_abby', 'Fl0res@A', 35, '1989-08-03', '5552345671', 2, 2, 4),
	('Michael', 'Butler', 'michael.butler@healthpro.com', 'mbutler90', 'Butl3r@M!', 34, '1990-01-19', '5553456782', 3, 2, 5),
	('Scarlett', 'Jenkins', 'scarlett.jenkins@careplus.com', 'sjenkins_88', 'J3nk!nsScar', 36, '1988-04-05', '5554567893', 4, 2, 6),
	('Alexander', 'Murphy', 'alexander.murphy@healthservices.com', 'alex_murphy', 'M!urphyA1', 30, '1994-11-23', '5555678904', 5, 2, 7),
	('Zoey', 'Rivera', 'zoey.rivera@healthnet.com', 'zoey_riv', 'R!ver4Z', 28, '1996-06-12', '5556789015', 6, 2, 8),
	('Sebastian', 'Ross', 'sebastian.ross@medisys.com', 'sross92', 'Ross@Seb!', 32, '1992-05-22', '5557890126', 1, 2, 9),
	('Mila', 'Diaz', 'mila.diaz@medicall.com', 'mdiaz91', 'Di@zMila', 33, '1991-10-19', '5558901237', 2, 2, 1),
	('Leo', 'Gonzalez', 'leo.gonzalez@healthlink.com', 'leo_gon_90', 'Gonz@l3o', 34, '1990-03-15', '5559012348', 3, 2, 2),
	('Grace', 'Peterson', 'grace.peterson@medifast.com', 'gpeterson89', 'P3terson@G', 35, '1989-07-26', '5551234571', 4, 2, 3),
	('Luke', 'Howard', 'luke.howard@healthfirst.com', 'lhoward92', 'How@rdL92', 32, '1992-02-08', '5552345672', 5, 2, 4),
	('Hannah', 'Ward', 'hannah.ward@healthpro.com', 'hward88', 'W@rdHan', 36, '1988-09-24', '5553456783', 6, 2, 5),
	('Matthew', 'Morgan', 'matthew.morgan@medicentral.com', 'mmorgan91', 'M@ttMorgan', 33, '1991-05-18', '5554567894', 1, 2, 6),
	('Ellie', 'Long', 'ellie.long@carehub.com', 'elong90', 'L0ng@El', 34, '1990-12-06', '5555678905', 2, 2, 7),
	('Nathan', 'Ross', 'nathan.ross@healthservices.com', 'nross87', 'R@ssNate', 37, '1987-03-02', '5556789016', 3, 2, 8),
	('Madison', 'Griffin', 'madison.griffin@doclink.com', 'mgriffin89', 'Griff!nMad', 35, '1989-07-09', '5557890127', 4, 2, 9),
	('Lily', 'James', 'lily.james@medix.com', 'ljames95', 'J@m3sLily', 29, '1995-11-05', '5558901238', 5, 1, 1),
	('Aaron', 'Turner', 'aaron.turner@wellness.com', 'aturner88', 'Turner@Ar', 36, '1988-12-11', '5559012349', 6, 1, 2),
	('Victoria', 'Collins', 'victoria.collins@medicall.com', 'vcollins86', 'C0llinsVic', 38, '1986-10-07', '5551234572', 1, 1, 3),
	('Jason', 'Stewart', 'jason.stewart@quickmed.com', 'jstewart84', 'St3w@rtJ', 40, '1984-06-30', '5552345673', 2, 1, 4),
	('Natalie', 'Hughes', 'natalie.hughes@healthlink.com', 'nhughes93', 'Hugh3sNat', 31, '1993-09-03', '5553456784', 3, 1, 5);

insert into patient (first_name, last_name, email, username, pass_word, age, date_of_birth, contact_number, hospital_id, physician_id) values
	('Emma', 'Johnson', 'emma.johnson@medicentral.com', 'emma_j_94', 'J0hns0n@Emma', 30, '1994-01-15', '5551239870', 2, 1),
	('Liam', 'Smith', 'liam.smith@healthpro.com', 'liam_smith92', 'Sm1thL!am', 32, '1992-06-20', '5552345670', 2, 2),
	('Olivia', 'Williams', 'olivia.williams@medifast.com', 'olivia_w_93', 'W!lliamOliv', 31, '1993-03-10', '5553456780', 2, 3),
	('Noah', 'Brown', 'noah.brown@wellness.com', 'noah_b_90', 'Br@wnNo@h', 34, '1990-08-15', '5554567890', 2, 4),
	('Ava', 'Jones', 'ava.jones@carehub.com', 'ava_j_89', 'J0n3s@Av4', 35, '1989-02-25', '5555678900', 2, 5),
	('Sophia', 'Garcia', 'sophia.garcia@doclink.com', 'sophie_g_91', 'G@rciaSoph', 33, '1991-11-12', '5556789010', 2, 6),
	('William', 'Martinez', 'william.martinez@medicall.com', 'wmartinez88', 'Mart!nezW', 36, '1988-09-17', '5557890120', 2, 7),
	('Isabella', 'Lopez', 'isabella.lopez@healthnet.com', 'ilopez92', 'Lop3zIsa!', 32, '1992-07-23', '5558901230', 2, 8),
	('James', 'Hernandez', 'james.hernandez@healthlink.com', 'jamesh87', 'H3rn@ndezJ', 37, '1987-12-05', '5559012340', 2, 9),
	('Mia', 'Gonzalez', 'mia.gonzalez@medix.com', 'm_gonza91', 'Gonz@lezM!', 33, '1991-10-30', '5551122334', 2, 10),
	('Alexander', 'Moore', 'alexander.moore@healthworks.com', 'amoore93', 'M00reAlex@', 31, '1993-05-22', '5552233445', 2, 11),
	('Charlotte', 'Clark', 'charlotte.clark@medifast.com', 'clark_c87', 'Cl@rkChar', 37, '1987-06-17', '5553344556', 2, 12),
	('Lucas', 'Walker', 'lucas.walker@careplus.com', 'lucas_w90', 'W@lk3rLucas', 34, '1990-09-19', '5554455667', 2, 13),
	('Amelia', 'Rodriguez', 'amelia.rodriguez@medisys.com', 'arodriguez88', 'Rodr!guezA', 36, '1988-11-21', '5555566778', 2, 14),
	('Ethan', 'Lewis', 'ethan.lewis@quickmed.com', 'ethan_l94', 'Lew!sEth', 30, '1994-01-08', '5556677889', 2, 15),
	('Harper', 'Lee', 'harper.lee@medicentral.com', 'hlee93', 'L33Harp@r', 31, '1993-04-05', '5557788990', 2, 16),
	('Henry', 'Perez', 'henry.perez@docservices.com', 'henry_p88', 'P3r3zH', 36, '1988-08-16', '5558899001', 2, 17),
	('Sophie', 'White', 'sophie.white@carehub.com', 'swhite89', 'Wh!t3Soph', 35, '1989-03-29', '5559900011', 2, 18),
	('Jack', 'Harris', 'jack.harris@medisys.com', 'jharris91', 'H@rr1sJack', 33, '1991-10-12', '5551011121', 2, 19),
	('Ella', 'Davis', 'ella.davis@medicall.com', 'ella_davis90', 'Dav!sE', 34, '1990-06-18', '5551212132', 2, 20),
	('Sebastian', 'Anderson', 'sebastian.anderson@doclink.com', 'sanderson92', 'And3rs0nS', 32, '1992-02-02', '5551231234', 2, 21),
	('Zoe', 'Martinez', 'zoe.martinez@medicentral.com', 'zmartinez87', 'Mart!nezZ', 37, '1987-11-27', '5552342345', 2, 22),
	('Samuel', 'Thomas', 'samuel.thomas@healthlink.com', 'sam_thomas93', 'Th0m@sSam', 31, '1993-08-03', '5553453456', 2, 23),
	('Emily', 'Wilson', 'emily.wilson@wellness.com', 'ewilson88', 'Wils0n@E', 36, '1988-05-25', '5554564567', 2, 24),
	('Madison', 'Taylor', 'madison.taylor@medicall.com', 'mad_taylor91', 'Tay!lorM', 33, '1991-12-10', '5555675678', 2, 25),
	('Joseph', 'Jackson', 'joseph.jackson@medicentral.com', 'jjackson90', 'J@cks0nJos', 34, '1990-09-29', '5556786789', 2, 26),
	('Abigail', 'Martinez', 'abigail.martinez@healthworks.com', 'amartinez94', 'Mart!nezAbi', 30, '1994-04-15', '5557897890', 2, 27),
	('David', 'Gomez', 'david.gomez@medisys.com', 'dgomez92', 'GomezD@vid', 32, '1992-06-03', '5558908901', 2, 28),
	('Grace', 'Green', 'grace.green@quickmed.com', 'graceg_90', 'Gr33n@Gr', 34, '1990-02-28', '5559019012', 2, 29),
	('Mason', 'Young', 'mason.young@docservices.com', 'm_young91', 'Y0ungMas@', 33, '1991-05-20', '5551122123', 2, 30),
	('Evelyn', 'Wright', 'evelyn.wright@careplus.com', 'ewright93', 'Wr1ghtEv3', 31, '1993-03-04', '5551233124', 2, 31),
	('Dylan', 'Carter', 'dylan.carter@healthnet.com', 'dcarter87', 'C@rt3rDy', 37, '1987-08-30', '5552344125', 2, 32),
	('Aiden', 'Phillips', 'aiden.phillips@healthpro.com', 'aphillips89', 'Phil!psA', 35, '1989-09-16', '5553455126', 2, 33),
	('Victoria', 'Evans', 'victoria.evans@healthservices.com', 'vevans92', 'Ev@nsV!ct', 32, '1992-01-29', '5554566127', 2, 34),
	('Wyatt', 'Collins', 'wyatt.collins@medifast.com', 'wcollins90', 'C0ll!nsWy', 34, '1990-07-11', '5555677128', 2, 35),
	('Natalie', 'Hill', 'natalie.hill@docconnect.com', 'nhill88', 'H!llNat', 36, '1988-11-23', '5556788129', 2, 36),
	('Owen', 'Scott', 'owen.scott@medisys.com', 'oscott89', 'Sc0ttO@wen', 35, '1989-12-14', '5557899130', 2, 37),
	('Lillian', 'Rogers', 'lillian.rogers@carehub.com', 'lrogers94', 'R0gersLil', 30, '1994-04-30', '5558900131', 2, 38),
	('Isaac', 'Parker', 'isaac.parker@medifast.com', 'iparker91', 'Park3rIsa', 33, '1991-09-01', '5559011132', 2, 39),
	('Mila', 'Price', 'mila.price@wellness.com', 'mprice88', 'Pric3Mil@', 36, '1988-05-19', '5551232133', 2, 40),
	('Adam', 'Bennett', 'adam.bennett@medicentral.com', 'abennett93', 'Benn3tAd@m', 31, '1993-08-09', '5552343234', 2, 41),
	('Aria', 'King', 'aria.king@doclink.com', 'ariaking87', 'K!ngAria', 37, '1987-02-21', '5553454335', 2, 42),
	('Caleb', 'Sanders', 'caleb.sanders@careplus.com', 'csanders90', 'S@ndersCale', 34, '1990-10-05', '5554565436', 2, 43),
	('Layla', 'Edwards', 'layla.edwards@healthworks.com', 'ledwards91', 'Edw@rdsLayl', 33, '1991-12-30', '5555676537', 2, 44),
	('Gabriel', 'Long', 'gabriel.long@healthservices.com', 'glong94', 'L0ngGab!', 30, '1994-06-25', '5556787638', 2, 45),
	('Chloe', 'Morgan', 'chloe.morgan@medix.com', 'cmorgan92', 'M0rganC@h', 32, '1992-03-07', '5557898739', 2, 46),
	('Levi', 'Sanders', 'levi.sanders@quickmed.com', 'lsanders95', 'S@ndersL3vi', 29, '1995-01-04', '5558909839', 1, 47),
	('Hazel', 'James', 'hazel.james@medifast.com', 'hjames89', 'J@m3sHaze', 35, '1989-07-15', '5559010949', 1, 48),
	('Julian', 'Powell', 'julian.powell@docconnect.com', 'jpowell88', 'Pow3llJul!', 36, '1988-09-28', '5551234059', 1, 49),
	('Eliana', 'Cook', 'eliana.cook@medicentral.com', 'ecook93', 'CookE!ana', 31, '1993-11-14', '5552345069', 1, 50),
    ('Abigail', 'Sanders', 'abigail.sanders@medicentral.com', 'asanders93', 'S@ndersAbi', 31, '1993-09-10', '5555671234', 1, 2),
    ('Evelyn', 'Brooks', 'evelyn.brooks@healthpro.com', 'ebrooks90', 'Br00ks@Ev', 34, '1990-03-15', '5556782345', 2, 3),
    ('Logan', 'Perry', 'logan.perry@doclink.com', 'lperry88', 'PerrY!Logan', 36, '1988-12-23', '5557893456', 3, 4),
    ('Grace', 'Hughes', 'grace.hughes@wellness.com', 'ghughes94', 'HuGh3sGrace', 30, '1994-04-08', '5558904567', 1, 5),
    ('Matthew', 'Reed', 'matthew.reed@healthlink.com', 'mreed89', 'Re3D@Mat', 35, '1989-06-14', '5559015678', 2, 6),
    ('Sophia', 'Foster', 'sophia.foster@careplus.com', 'sfoster87', 'Fo$t3rSoph', 37, '1987-02-25', '5551126789', 3, 7),
    ('Mason', 'Owens', 'mason.owens@medicall.com', 'mowens92', 'Ow3nMas0n', 32, '1992-08-17', '5552237890', 1, 8),
    ('Zoey', 'Morgan', 'zoey.morgan@docservices.com', 'zmorgan95', 'M0rganZ0ey', 29, '1995-10-01', '5553348901', 2, 9),
    ('Henry', 'Turner', 'henry.turner@healthnet.com', 'hturner93', 'T#rn3rHen', 31, '1993-12-06', '5554459012', 3, 10),
    ('Olivia', 'Jenkins', 'olivia.jenkins@medfast.com', 'o_jenkins91', 'JenKin$Ol', 33, '1991-05-23', '5555560123', 1, 11),
    ('Harper', 'Bell', 'harper.bell@doclink.com', 'hbell90', 'BellHarp3r', 34, '1990-01-19', '5556671234', 2, 12),
    ('Wyatt', 'Gray', 'wyatt.gray@medicall.com', 'wgray88', 'Gra!Wy@tt', 36, '1988-03-07', '5557782345', 3, 13),
    ('Ella', 'Myers', 'ella.myers@medisys.com', 'emyers94', 'M#yer$Ella', 30, '1994-08-14', '5558893456', 1, 14),
    ('Daniel', 'Warren', 'daniel.warren@healthlink.com', 'dwarren93', 'W@rrenDan', 31, '1993-09-02', '5559904567', 2, 15),
    ('Stella', 'Cole', 'stella.cole@docconnect.com', 'scole92', 'C0leSt3ll@', 32, '1992-12-20', '5551235678', 3, 16),
    ('Isaac', 'Jordan', 'isaac.jordan@medcentral.com', 'ijordan95', 'JordanI$@ac', 29, '1995-06-10', '5552346789', 1, 17),
    ('Chloe', 'Hayes', 'chloe.hayes@healthfirst.com', 'chayes87', 'H@yEsChl03', 37, '1987-07-08', '5553457890', 2, 18),
    ('James', 'Gomez', 'james.gomez@carehub.com', 'jgomez90', 'Gom3ZJ@m3', 34, '1990-01-15', '5554568901', 3, 19),
    ('Scarlett', 'Long', 'scarlett.long@medfast.com', 'slong91', 'L0ngSc@rl3t', 33, '1991-02-04', '5555679012', 1, 20),
    ('Adrian', 'Carroll', 'adrian.carroll@doclink.com', 'acarroll88', 'CarrollAdr1', 36, '1988-09-27', '5556780123', 2, 21),
    ('Zoe', 'Page', 'zoe.page@medcentral.com', 'zpage92', 'PageZoe$', 32, '1992-10-30', '5557891234', 3, 22),
    ('Nathan', 'Murray', 'nathan.murray@carehub.com', 'nmurray89', 'Murr@Nathan', 35, '1989-08-18', '5558902345', 1, 23),
    ('Brooklyn', 'Parker', 'brooklyn.parker@healthnet.com', 'bparker90', 'ParK3rB@ok', 34, '1990-05-26', '5559013456', 2, 24),
    ('Sebastian', 'Kelley', 'sebastian.kelley@doclink.com', 'skelley91', 'Ke!!eySe8t', 33, '1991-11-05', '5551124567', 3, 25),
    ('Mila', 'Marshall', 'mila.marshall@medicentral.com', 'mmarshall93', 'MarshallMila', 31, '1993-04-17', '5552235678', 1, 26),
    ('Eli', 'Lambert', 'eli.lambert@medfast.com', 'elambert88', 'Lamb3rEli@', 36, '1988-12-22', '5553346789', 2, 27),
    ('Aurora', 'Reeves', 'aurora.reeves@docservices.com', 'areeves90', 'Reev3$Auror', 34, '1990-01-12', '5554457890', 3, 28),
    ('Hunter', 'Goodman', 'hunter.goodman@carehub.com', 'hgoodman89', 'Goodm@nHunt', 35, '1989-05-15', '5555568901', 1, 29),
    ('Lucy', 'Grant', 'lucy.grant@medfast.com', 'lgrant95', 'Gr@ntLuc#95', 29, '1995-07-29', '5556679012', 2, 30),
    ('Christian', 'Porter', 'christian.porter@medfast.com', 'cporter94', 'Port3rChr!', 30, '1994-09-07', '5557780123', 3, 31),
    ('Gabriel', 'Wells', 'gabriel.wells@docconnect.com', 'gwells92', 'W3llsGab3r', 32, '1992-04-02', '5558891234', 1, 32),
    ('Lucy', 'Hale', 'lucy.hale@medfast.com', 'lhale87', 'Hal3L!cy', 37, '1987-08-11', '5559902345', 2, 33),
    ('Austin', 'Harmon', 'austin.harmon@healthlink.com', 'aharmon90', 'H@rm0nAustin', 34, '1990-06-03', '5551233456', 3, 34),
    ('Penelope', 'Vasquez', 'penelope.vasquez@medisys.com', 'pvasquez88', 'VasqPeneLop', 36, '1988-03-10', '5552344567', 1, 35),
    ('Sadie', 'Reid', 'sadie.reid@carehub.com', 'sreid92', 'R3!dSadiE', 32, '1992-10-08', '5553455678', 2, 36),
    ('Maxwell', 'Hale', 'maxwell.hale@docservices.com', 'm_hale95', 'MaxH@leW#ll', 29, '1995-12-18', '5554566789', 3, 37);

insert into insurance (insurance_number, provider, coverage, start_date, expiration_date, patient_id) values
	('INS1234567890', 'Blue Shield', 'Full Coverage', '2022-01-01', '2023-12-31', 1),
	('INS0987654321', 'Aetna', 'Dental Only', '2022-05-15', '2023-05-14', 2),
	('INS1122334455', 'United Health', 'Basic Health', '2023-02-20', '2024-02-19', 3),
	('INS5566778899', 'Cigna', 'Full Coverage', '2023-03-01', '2024-02-29', 4),
	('INS6677889900', 'Humana', 'Vision & Dental', '2022-07-07', '2023-07-06', 5),
	('INS2233445566', 'Blue Cross', 'Premium Coverage', '2022-08-01', '2023-07-31', 6),
	('INS3344556677', 'Kaiser', 'Full Coverage', '2023-04-05', '2024-04-04', 7),
	('INS7788990011', 'Medicare', 'Supplemental', '2022-06-06', '2023-06-05', 8),
	('INS4455667788', 'Tricare', 'Basic Health', '2023-10-01', '2024-09-30', 9),
	('INS5566778890', 'Blue Shield', 'Dental Only', '2023-01-15', '2024-01-14', 10),
	('INS6677889901', 'Aetna', 'Full Coverage', '2023-03-10', '2024-03-09', 11),
	('INS7788990012', 'United Health', 'Premium Coverage', '2022-11-15', '2023-11-14', 12),
	('INS8899001122', 'Cigna', 'Vision & Dental', '2023-05-20', '2024-05-19', 13),
	('INS9900112233', 'Humana', 'Basic Health', '2023-07-01', '2024-06-30', 14),
	('INS1111222333', 'Blue Cross', 'Full Coverage', '2022-04-01', '2023-03-31', 15),
	('INS2233445567', 'Kaiser', 'Supplemental', '2023-02-01', '2024-01-31', 16),
	('INS3344556678', 'Medicare', 'Dental Only', '2022-12-01', '2023-11-30', 17),
	('INS4455667789', 'Tricare', 'Vision & Dental', '2022-03-01', '2023-02-28', 18),
	('INS5566778891', 'Blue Shield', 'Full Coverage', '2023-01-01', '2023-12-31', 19),
	('INS6677889902', 'Aetna', 'Basic Health', '2022-09-15', '2023-09-14', 20);

insert into claim (amount, claim_date, insurance_id) values
	(1200.50, '2023-01-20', 1),
	(300.75, '2023-02-15', 2),
	(2500.00, '2023-03-18', 3),
	(420.00, '2023-01-25', 4),
	(110.20, '2023-02-05', 5),
	(1550.00, '2023-03-22', 6),
	(220.50, '2023-01-30', 7),
	(800.00, '2023-02-18', 8),
	(1000.00, '2023-03-05', 9),
	(980.00, '2023-01-12', 10),
	(145.35, '2023-02-10', 11),
	(3500.00, '2023-03-29', 12),
	(475.25, '2023-01-15', 13),
	(560.40, '2023-02-28', 14),
	(200.00, '2023-03-02', 15),
	(875.75, '2023-01-25', 16),
	(950.60, '2023-02-22', 17),
	(123.45, '2023-03-15', 18),
	(780.00, '2023-01-10', 19),
	(250.00, '2023-02-27', 20);

insert into billing (amount_due, amount_paid, due_date, claim_id) values
	(1200.50, 1200.50, '2023-02-20', 1),
	(300.75, 150.00, '2023-03-15', 2),
	(2500.00, 1250.00, '2023-04-18', 3),
	(420.00, 420.00, '2023-02-25', 4),
	(110.20, 110.20, '2023-03-05', 5),
	(1550.00, 775.00, '2023-04-22', 6),
	(220.50, 220.50, '2023-02-28', 7),
	(800.00, 400.00, '2023-03-18', 8),
	(1000.00, 500.00, '2023-04-05', 9),
	(980.00, 980.00, '2023-02-12', 10),
	(145.35, 145.35, '2023-03-10', 11),
	(3500.00, 1750.00, '2023-04-29', 12),
	(475.25, 475.25, '2023-02-15', 13),
	(560.40, 280.20, '2023-03-28', 14),
	(200.00, 200.00, '2023-04-02', 15),
	(875.75, 437.87, '2023-03-25', 16),
	(950.60, 475.30, '2023-04-22', 17),
	(123.45, 123.45, '2023-03-15', 18),
	(780.00, 780.00, '2023-02-10', 19),
	(250.00, 125.00, '2023-03-27', 20);

insert into appointment (appt_date, reason, patient_id, SOAP_id) values
	('2023-02-14', 'Routine check-up', 3, 7),
	('2023-03-05', 'Flu symptoms', 8, 12),
	('2023-01-20', 'Follow-up on surgery', 15, 3),
	('2023-04-11', 'Blood pressure check', 22, 14),
	('2023-03-28', 'Physical therapy', 30, 21),
	('2023-05-01', 'Allergy consultation', 45, 6),
	('2023-01-07', 'Headache evaluation', 12, 18),
	('2023-06-15', 'Diabetes management', 27, 25),
	('2023-02-09', 'Heart palpitation symptoms', 6, 19),
	('2023-03-18', 'Sprained ankle', 19, 22),
	('2023-02-27', 'Mental health follow-up', 41, 5),
	('2023-04-20', 'Routine immunization', 25, 11),
	('2023-06-10', 'Pre-surgery assessment', 2, 4),
	('2023-01-30', 'Post-surgery follow-up', 3, 10),
	('2023-05-22', 'Pediatric consultation', 12, 9),
	('2023-06-03', 'Fever evaluation', 18, 2),
	('2023-04-08', 'Nutritional counseling', 5, 13),
	('2023-04-08', 'Nutritional counseling', 18, 13),
	('2023-03-11', 'Skin rash treatment', 37, 17),
	('2023-01-25', 'Gastrointestinal issue', 3, 8),
	('2023-04-14', 'Back pain management', 16, 1),
	('2023-05-27', 'Hearing test', 40, 15),
	('2023-06-02', 'Heart palpitations', 23, 20),
	('2023-02-15', 'Pre-surgery assessment', 6, 16),
	('2023-03-01', 'Annual physical', 1, 7),
	('2023-01-29', 'Ultrasound follow-up', 14, 10),
	('2023-05-13', 'Arthritis check-up', 44, 23),
	('2023-06-07', 'Eye infection', 9, 11),
	('2023-04-29', 'Foot pain assessment', 47, 3),
	('2023-02-05', 'Headache evaluation', 33, 18),
	('2023-01-17', 'Weight management', 21, 12),
	('2023-03-09', 'Chronic pain management', 28, 25),
	('2023-02-11', 'Infection treatment', 5, 24),
	('2023-05-30', 'Sinus infection', 34, 20),
	('2023-01-21', 'Hearing test', 43, 27),
	('2023-06-15', 'Vaccination', 17, 14),
	('2023-04-06', 'Chest pain', 39, 8),
	('2023-03-27', 'Lung function test', 32, 21),
	('2023-05-16', 'MRI consultation', 26, 11),
	('2023-02-26', 'Sleep study', 24, 3),
	('2023-01-11', 'Kidney function test', 20, 10),
	('2023-06-21', 'Blood test review', 4, 15),
	('2023-02-03', 'Respiratory infection', 11, 19),
	('2023-03-23', 'Nutritional counseling', 13, 16),
	('2023-06-26', 'Pediatric consultation', 50, 9),
	('2023-01-19', 'Eye infection', 7, 22),
	('2023-02-20', 'Heart palpitation symptoms', 38, 6),
	('2023-03-17', 'Gastrointestinal issue', 36, 13),
	('2023-05-03', 'Hearing test', 42, 4),
	('2023-04-12', 'Blood sugar test', 10, 26),
	('2023-02-24', 'Physical exam', 35, 14);

insert into employee_schedule (schedule_date, available, employee_id) values
	('2023-01-15 09:30:00', true, 8),
	('2023-02-18 13:00:00', false, 17),
	('2023-01-07 08:15:00', true, 23),
	('2023-03-12 12:45:00', true, 4),
	('2023-04-05 10:30:00', false, 19),
	('2023-03-07 14:00:00', true, 6),
	('2023-02-22 15:45:00', true, 25),
	('2023-06-01 09:00:00', false, 3),
	('2023-01-28 10:15:00', true, 14),
	('2023-03-30 07:45:00', true, 16),
	('2023-04-15 13:30:00', true, 12),
	('2023-06-08 14:45:00', false, 5),
	('2023-01-24 12:00:00', true, 9),
	('2023-05-03 08:30:00', true, 26),
	('2023-02-19 11:15:00', false, 28),
	('2023-06-17 16:00:00', true, 11),
	('2023-03-22 07:00:00', true, 13),
	('2023-02-13 15:30:00', false, 10),
	('2023-05-10 09:15:00', true, 2),
	('2023-04-28 08:00:00', true, 22),
	('2023-01-10 12:45:00', true, 18),
	('2023-05-25 07:15:00', false, 20),
	('2023-02-11 10:30:00', true, 21),
	('2023-03-05 11:00:00', true, 29),
	('2023-06-06 14:30:00', false, 15),
	('2023-01-29 08:45:00', true, 24),
	('2023-04-16 13:15:00', true, 27),
	('2023-03-10 09:30:00', false, 1),
	('2023-06-02 15:45:00', true, 7),
	('2023-02-14 16:15:00', true, 30),
	('2023-05-27 10:15:00', true, 31),
	('2023-04-02 13:45:00', true, 32),
	('2023-02-09 09:00:00', false, 34),
	('2023-06-05 12:00:00', true, 33),
	('2023-03-27 10:45:00', true, 35),
	('2023-04-08 11:30:00', false, 36),
	('2023-01-23 15:00:00', true, 37),
	('2023-02-25 08:30:00', true, 38),
	('2023-05-15 07:45:00', true, 39),
	('2023-04-20 10:00:00', false, 40),
	('2023-01-12 09:15:00', true, 41),
	('2023-06-12 12:30:00', true, 42),
	('2023-05-22 15:45:00', false, 43),
	('2023-02-06 08:45:00', true, 44),
	('2023-01-16 14:15:00', true, 45),
	('2023-04-23 11:00:00', true, 46),
	('2023-06-15 10:30:00', false, 47),
	('2023-03-19 13:45:00', true, 48),
	('2023-05-19 14:30:00', true, 49),
	('2023-02-03 16:00:00', false, 50);

-- Create Triggers and Stored Procedures: (should before the select statements)
-- Trigger to update billing information after a claim is updated (INSERT INTO)
DELIMITER //
CREATE TRIGGER update_billing_after_claim_update
AFTER UPDATE ON claim
FOR EACH ROW
BEGIN
    UPDATE billing
    SET amount_due = NEW.amount,
        due_date = DATE_ADD(NEW.claim_date, INTERVAL 30 DAY)
    WHERE claim_id = NEW.id;
END //
DELIMITER ;

-- Procedure to view patient billing information
DROP PROCEDURE IF EXISTS ViewPatientBilling;

DELIMITER //
CREATE PROCEDURE ViewPatientBilling(IN patientID INT)
BEGIN
    SELECT 
        b.id AS BillID,
		p.first_name AS PatientFirstName,
        p.last_name AS PatientLastName,
        i.insurance_number AS InsuranceNumber,
        b.amount_due AS AmountDue,
        b.amount_paid AS AmountPaid,
        (b.amount_due - b.amount_paid) AS AmountOwed, -- Calculate Amount Owed
        b.due_date AS BillingDueDate
    FROM patient p
    INNER JOIN insurance i ON p.id = i.patient_id
    INNER JOIN claim c ON i.id = c.insurance_id
    INNER JOIN billing b ON c.id = b.claim_id
    WHERE p.id = patientID;
END //
DELIMITER ;

-- Test the Stored Procedure:
CALL ViewPatientBilling(1);


-- select * from patient;
SELECT * FROM patient;
SELECT * FROM employee;
SELECT * FROM insurance;
SELECT * FROM claim;
SELECT * FROM billing;
SELECT * FROM appointment;
SELECT * FROM employee_schedule;


-- TODO: Create calls for other information

select 
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
where p.id = 1;

/*
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
where p.id = 1;

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
    b.due_date as "billing_due_date"
from patient p
inner join insurance i on p.id = i.patient_id
inner join claim c on i.id = c.insurance_id
inner join billing b on c.id = b.claim_id
where p.id = 1;

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
where p.id = 1;
*/