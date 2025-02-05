drop database if exists cs_5800_test;
create database cs_5800_test;
use cs_5800_test;

create table person (
	id int primary key auto_increment,
	firstName varchar(100) not null,
	lastName varchar(100) not null,
	age int not null
);

insert into person(firstName, lastName, age)
	values
	('Anna', 'O`Neal', 43),
	('Bill', 'Johnson', 24),
	('Partrick', 'Cauliflower', 38),
    ('James', 'Jones', 81),
    ('Allison', 'Gates', 56);

SELECT * FROM person;