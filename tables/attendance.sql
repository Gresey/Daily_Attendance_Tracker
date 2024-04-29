CREATE TABLE IF NOT EXISTS student_attendance (
    id INT AUTO_INCREMENT Primary key,
    date DATE NOT NULL,
    enrollment VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    year VARCHAR(255),
    section VARCHAR(255),
    CSIT601 VARCHAR(3) ,
    CSIT602 VARCHAR(3) ,
    CSIT603 VARCHAR(3) ,
    CONSTRAINT unique_date_enrollment UNIQUE (date, enrollment),
    INDEX (year, section, date)
);