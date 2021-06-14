create table User
(
    userId            int auto_increment
        primary key,
    username          varchar(255)                        not null,
    email             varchar(255)                        not null,
    password          text                                not null,
    forename          text                                not null,
    surname           text                                not null,
    birthday          date                                not null,
    salt              text                                not null,
    userCreated       timestamp default CURRENT_TIMESTAMP not null,
    resetPasswordKey  text                                null,
    resetPasswordDate timestamp                           null,
    constraint User_email_uindex
        unique (email),
    constraint User_username_uindex
        unique (username)
);

create table Plant
(
    plantId             int auto_increment
        primary key,
    plantName           varchar(255)         not null,
    wateringInterval    int                  null,
    fertilizingInterval int                  null,
    plantBirthday       date                 null,
    plantDeathday       date                 null,
    family              text                 null,
    type                text                 null,
    species             text                 null,
    image               text                 null,
    lux                 int                  null,
    userId              int                  null,
    favourite           tinyint(1) default 0 null,
    lastTimeWater       date                 null,
    lastTimeFertilize   date                 null,
    active              tinyint(1) default 1 not null,
    constraint Plant_User_userId_fk
        foreign key (userId) references User (userId)
            on delete cascade
);

create table PlantDiary
(
    plantDiaryId int auto_increment
        primary key,
    plantId      int                  null,
    watered      tinyint(1) default 0 null,
    fertilized   tinyint(1) default 0 null,
    image        text                 null,
    date         date                 not null,
    note         text                 null,
    size         float                null,
    health       text                 null,
    constraint PlantDiary_Plant_plantId_fk
        foreign key (plantId) references Plant (plantId)
            on update cascade on delete cascade
);

create table Session
(
    sessionId      int auto_increment
        primary key,
    userId         int                                 not null,
    sessionHash    text                                not null,
    sessionCreated timestamp default CURRENT_TIMESTAMP null,
    constraint Session_User_userId
        foreign key (userId) references User (userId)
            on delete cascade
);

