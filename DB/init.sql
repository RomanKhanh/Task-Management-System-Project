IF DB_ID('TaskManagement') IS NOT NULL
    DROP DATABASE TaskManagement;
GO

CREATE DATABASE TaskManagement;
GO

USE TaskManagement;
GO
CREATE TABLE Users (
                       id INT IDENTITY(1,1) PRIMARY KEY,
                       username NVARCHAR(50) NOT NULL UNIQUE,
                       password NVARCHAR(50) NOT NULL,
                       role NVARCHAR(20)
);

CREATE TABLE Projects (
                          id INT IDENTITY(1,1) PRIMARY KEY,
                          name NVARCHAR(255) NOT NULL,
                          description NVARCHAR(500),
                          manager NVARCHAR(100) NOT NULL,
                          status NVARCHAR(50) NOT NULL
);

CREATE TABLE Tasks (
                       id INT IDENTITY(1,1) PRIMARY KEY,
                       name NVARCHAR(100) NOT NULL,
                       project NVARCHAR(100),
                       assignee NVARCHAR(100),
                       deadline DATE,
                       status NVARCHAR(20)
);

CREATE TABLE Notifications (
                               id INT IDENTITY(1,1) PRIMARY KEY,
                               project_id INT NOT NULL,
                               receiver NVARCHAR(100) NOT NULL,
                               message NVARCHAR(255) NOT NULL,
                               is_read BIT DEFAULT 0,
                               created_at DATETIME DEFAULT GETDATE()
);
INSERT INTO Users(username,password,role) VALUES
                                              ('admin','123','Admin'),
                                              ('manager1','123','Manager'),
                                              ('member1','123','Member');

INSERT INTO Projects(name,description,manager,status) VALUES
    ('Demo Project',NULL,'admin','On Hold');

INSERT INTO Tasks(name,project,assignee,deadline,status) VALUES
    ('Thiết kế UI','Demo Project','member1','2026-02-25','To Do');