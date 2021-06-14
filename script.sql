CREATE TABLE USER (
    userId int AUTO_INCREMENT PRIMARY KEY,
    username varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    PASSWORD text NOT NULL,
    forename text NOT NULL,
    surname text NOT NULL,
    birthday date NOT NULL,
    salt text NOT NULL,
    userCreated timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    resetPasswordKey text NULL,
    resetPasswordDate timestamp NULL,
    CONSTRAINT User_email_uindex UNIQUE (email),
    CONSTRAINT User_username_uindex UNIQUE (username)
);

CREATE TABLE Plant (
    plantId int AUTO_INCREMENT PRIMARY KEY,
    plantName varchar(255) NOT NULL,
    wateringInterval int NULL,
    fertilizingInterval int NULL,
    plantBirthday date NULL,
    plantDeathday date NULL,
    family text NULL,
    TYPE text NULL,
    species text NULL,
    image text NULL,
    lux int NULL,
    userId int NULL,
    favourite tinyint (1) DEFAULT 0 NULL,
    lastTimeWater date NULL,
    lastTimeFertilize date NULL,
    active tinyint (1) DEFAULT 1 NOT NULL,
    CONSTRAINT Plant_User_userId_fk FOREIGN KEY (userId) REFERENCES USER (userId) ON DELETE CASCADE
);

CREATE TABLE PlantDiary (
    plantDiaryId int AUTO_INCREMENT PRIMARY KEY,
    plantId int NULL,
    watered tinyint (1) DEFAULT 0 NULL,
    fertilized tinyint (1) DEFAULT 0 NULL,
    image text NULL,
    date date NOT NULL,
    note text NULL,
    size float NULL,
    health text NULL,
    CONSTRAINT PlantDiary_Plant_plantId_fk FOREIGN KEY (plantId) REFERENCES Plant (plantId) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE Session (
    sessionId int AUTO_INCREMENT PRIMARY KEY,
    userId int NOT NULL,
    sessionHash text NOT NULL,
    sessionCreated timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    CONSTRAINT Session_User_userId FOREIGN KEY (userId) REFERENCES USER (userId) ON DELETE CASCADE
);
