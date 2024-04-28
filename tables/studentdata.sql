
  CREATE TABLE IF NOT EXISTS entries (
    id INT AUTO_INCREMENT  KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL ,
    enrollment VARCHAR(255) NOT NULL UNIQUE,
    department VARCHAR(255) NOT NULL,
    year VARCHAR(255) NOT NULL,
    section VARCHAR(255) NOT NULL
  );