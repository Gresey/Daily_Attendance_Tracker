CREATE TABLE IF NOT EXISTS student_attendance (
    id INT AUTO_INCREMENT ,
    date DATE NOT NULL,
    enrollment VARCHAR(255) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subject1 VARCHAR(3) ,
    subject2 VARCHAR(3) ,
    subject3 VARCHAR(3) ,
    year VARCHAR(255),
    section VARCHAR(255),
    CONSTRAINT unique_enrollment_date UNIQUE (enrollment, date),
    INDEX (year, section, date)
  
  
);