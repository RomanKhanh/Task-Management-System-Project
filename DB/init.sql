-- IF DB_ID('TaskManagement') IS NULL
--     CREATE DATABASE TaskManagement;
-- GO
-- USE [TaskManagement]
-- GO
-- IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
-- ALTER TABLE [dbo].[Users] DROP CONSTRAINT IF EXISTS [CK__Users__role__5DCAEF64]
-- GO
-- IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Tasks]') AND type in (N'U'))
-- ALTER TABLE [dbo].[Tasks] DROP CONSTRAINT IF EXISTS [CK__Tasks__status__6383C8BA]
-- GO
-- IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Tasks]') AND type in (N'U'))
-- ALTER TABLE [dbo].[Tasks] DROP CONSTRAINT IF EXISTS [FK_Task_Project]
-- GO
-- IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Tasks]') AND type in (N'U'))
-- ALTER TABLE [dbo].[Tasks] DROP CONSTRAINT IF EXISTS [FK_Task_Assignee]
-- GO
-- IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Projects]') AND type in (N'U'))
-- ALTER TABLE [dbo].[Projects] DROP CONSTRAINT IF EXISTS [FK_Project_Manager]
-- GO
-- /****** Object:  Index [UQ__Users__F3DBC5724DC15713]    Script Date: 2/10/2026 9:38:29 PM ******/
-- IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
-- ALTER TABLE [dbo].[Users] DROP CONSTRAINT IF EXISTS [UQ__Users__F3DBC5724DC15713]
-- GO
-- /****** Object:  Table [dbo].[Users]    Script Date: 2/10/2026 9:38:29 PM ******/
-- DROP TABLE IF EXISTS [dbo].[Users]
-- GO
-- /****** Object:  Table [dbo].[Tasks]    Script Date: 2/10/2026 9:38:29 PM ******/
-- DROP TABLE IF EXISTS [dbo].[Tasks]
-- GO
-- /****** Object:  Table [dbo].[Projects]    Script Date: 2/10/2026 9:38:29 PM ******/
-- DROP TABLE IF EXISTS [dbo].[Projects]
-- GO
-- USE [master]
-- GO
-- /****** Object:  Database [TaskManagement]    Script Date: 2/10/2026 9:38:29 PM ******/
-- DROP DATABASE IF EXISTS [TaskManagement]
-- GO
-- /****** Object:  Database [TaskManagement]    Script Date: 2/10/2026 9:38:29 PM ******/
-- CREATE DATABASE [TaskManagement]
--  CONTAINMENT = NONE
--  ON  PRIMARY
-- ( NAME = N'TaskManagement', FILENAME = N'D:\lackiu\MSSQL17.SQLEXPRESS\MSSQL\DATA\TaskManagement.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
--  LOG ON
-- ( NAME = N'TaskManagement_log', FILENAME = N'D:\lackiu\MSSQL17.SQLEXPRESS\MSSQL\DATA\TaskManagement_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
--  WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
-- GO
-- ALTER DATABASE [TaskManagement] SET COMPATIBILITY_LEVEL = 170
-- GO
-- IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
-- begin
-- EXEC [TaskManagement].[dbo].[sp_fulltext_database] @action = 'enable'
-- end
-- GO
-- ALTER DATABASE [TaskManagement] SET ANSI_NULL_DEFAULT OFF
-- GO
-- ALTER DATABASE [TaskManagement] SET ANSI_NULLS OFF
-- GO
-- ALTER DATABASE [TaskManagement] SET ANSI_PADDING OFF
-- GO
-- ALTER DATABASE [TaskManagement] SET ANSI_WARNINGS OFF
-- GO
-- ALTER DATABASE [TaskManagement] SET ARITHABORT OFF
-- GO
-- ALTER DATABASE [TaskManagement] SET AUTO_CLOSE ON
-- GO
-- ALTER DATABASE [TaskManagement] SET AUTO_SHRINK OFF
-- GO
-- ALTER DATABASE [TaskManagement] SET AUTO_UPDATE_STATISTICS ON
-- GO
-- ALTER DATABASE [TaskManagement] SET CURSOR_CLOSE_ON_COMMIT OFF
-- GO
-- ALTER DATABASE [TaskManagement] SET CURSOR_DEFAULT  GLOBAL
-- GO
-- ALTER DATABASE [TaskManagement] SET CONCAT_NULL_YIELDS_NULL OFF
-- GO
-- ALTER DATABASE [TaskManagement] SET NUMERIC_ROUNDABORT OFF
-- GO
-- ALTER DATABASE [TaskManagement] SET QUOTED_IDENTIFIER OFF
-- GO
-- ALTER DATABASE [TaskManagement] SET RECURSIVE_TRIGGERS OFF
-- GO
-- ALTER DATABASE [TaskManagement] SET  ENABLE_BROKER
-- GO
-- ALTER DATABASE [TaskManagement] SET AUTO_UPDATE_STATISTICS_ASYNC OFF
-- GO
-- ALTER DATABASE [TaskManagement] SET DATE_CORRELATION_OPTIMIZATION OFF
-- GO
-- ALTER DATABASE [TaskManagement] SET TRUSTWORTHY OFF
-- GO
-- ALTER DATABASE [TaskManagement] SET ALLOW_SNAPSHOT_ISOLATION OFF
-- GO
-- ALTER DATABASE [TaskManagement] SET PARAMETERIZATION SIMPLE
-- GO
-- ALTER DATABASE [TaskManagement] SET READ_COMMITTED_SNAPSHOT OFF
-- GO
-- ALTER DATABASE [TaskManagement] SET HONOR_BROKER_PRIORITY OFF
-- GO
-- ALTER DATABASE [TaskManagement] SET RECOVERY SIMPLE
-- GO
-- ALTER DATABASE [TaskManagement] SET  MULTI_USER
-- GO
-- ALTER DATABASE [TaskManagement] SET PAGE_VERIFY CHECKSUM
-- GO
-- ALTER DATABASE [TaskManagement] SET DB_CHAINING OFF
-- GO
-- ALTER DATABASE [TaskManagement] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF )
-- GO
-- ALTER DATABASE [TaskManagement] SET TARGET_RECOVERY_TIME = 60 SECONDS
-- GO
-- ALTER DATABASE [TaskManagement] SET DELAYED_DURABILITY = DISABLED
-- GO
-- ALTER DATABASE [TaskManagement] SET ACCELERATED_DATABASE_RECOVERY = OFF
-- GO
-- ALTER DATABASE [TaskManagement] SET OPTIMIZED_LOCKING = OFF
-- GO
-- ALTER DATABASE [TaskManagement] SET QUERY_STORE = ON
-- GO
-- ALTER DATABASE [TaskManagement] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
-- GO
-- USE [TaskManagement]
-- GO
-- /****** Object:  Table [dbo].[Projects]    Script Date: 2/10/2026 9:38:29 PM ******/
-- SET ANSI_NULLS ON
-- GO
-- SET QUOTED_IDENTIFIER ON
-- GO
-- CREATE TABLE [dbo].[Projects](
-- 	[project_id] [int] IDENTITY(1,1) NOT NULL,
-- 	[projectname] [nvarchar](100) NULL,
-- 	[desciption] [nvarchar](255) NULL,
-- 	[manager_id] [int] NULL,
-- PRIMARY KEY CLUSTERED
-- (
-- 	[project_id] ASC
-- )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
-- ) ON [PRIMARY]
-- GO
-- /****** Object:  Table [dbo].[Tasks]    Script Date: 2/10/2026 9:38:29 PM ******/
-- SET ANSI_NULLS ON
-- GO
-- SET QUOTED_IDENTIFIER ON
-- GO
-- CREATE TABLE [dbo].[Tasks](
-- 	[task_id] [int] IDENTITY(1,1) NOT NULL,
-- 	[title] [nvarchar](100) NULL,
-- 	[status] [varchar](20) NULL,
-- 	[deadline] [date] NULL,
-- 	[project_id] [int] NULL,
-- 	[assignee_id] [int] NULL,
-- PRIMARY KEY CLUSTERED
-- (
-- 	[task_id] ASC
-- )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
-- ) ON [PRIMARY]
-- GO
-- /****** Object:  Table [dbo].[Users]    Script Date: 2/10/2026 9:38:29 PM ******/
-- SET ANSI_NULLS ON
-- GO
-- SET QUOTED_IDENTIFIER ON
-- GO
-- CREATE TABLE [dbo].[Users](
-- 	[user_id] [int] IDENTITY(1,1) NOT NULL,
-- 	[username] [varchar](40) NOT NULL,
-- 	[password] [varchar](40) NOT NULL,
-- 	[role] [varchar](20) NULL,
-- PRIMARY KEY CLUSTERED
-- (
-- 	[user_id] ASC
-- )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
-- ) ON [PRIMARY]
-- GO
-- SET IDENTITY_INSERT [dbo].[Projects] ON
--
-- INSERT [dbo].[Projects] ([project_id], [projectname], [desciption], [manager_id]) VALUES (1, N'Demo Project', N'Test project', 1)
-- SET IDENTITY_INSERT [dbo].[Projects] OFF
-- GO
-- SET IDENTITY_INSERT [dbo].[Tasks] ON
--
-- INSERT [dbo].[Tasks] ([task_id], [title], [status], [deadline], [project_id], [assignee_id]) VALUES (1, N'Task 1', N'To Do', CAST(N'2026-02-15' AS Date), 1, 1)
-- SET IDENTITY_INSERT [dbo].[Tasks] OFF
-- GO
-- SET IDENTITY_INSERT [dbo].[Users] ON
--
-- INSERT [dbo].[Users] ([user_id], [username], [password], [role]) VALUES (1, N'admin', N'123', N'Admin')
-- INSERT [dbo].[Users] ([user_id], [username], [password], [role]) VALUES (3, N'a', N'a', N'Member')
-- INSERT [dbo].[Users] ([user_id], [username], [password], [role]) VALUES (5, N'g', N'g', N'Member')
-- INSERT [dbo].[Users] ([user_id], [username], [password], [role]) VALUES (7, N'f', N'f', N'Member')
-- SET IDENTITY_INSERT [dbo].[Users] OFF
-- GO
-- SET ANSI_PADDING ON
-- GO
-- /****** Object:  Index [UQ__Users__F3DBC5724DC15713]    Script Date: 2/10/2026 9:38:29 PM ******/
-- ALTER TABLE [dbo].[Users] ADD UNIQUE NONCLUSTERED
-- (
-- 	[username] ASC
-- )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
-- GO
-- ALTER TABLE [dbo].[Projects]  WITH CHECK ADD  CONSTRAINT [FK_Project_Manager] FOREIGN KEY([manager_id])
-- REFERENCES [dbo].[Users] ([user_id])
-- GO
-- ALTER TABLE [dbo].[Projects] CHECK CONSTRAINT [FK_Project_Manager]
-- GO
-- ALTER TABLE [dbo].[Tasks]  WITH CHECK ADD  CONSTRAINT [FK_Task_Assignee] FOREIGN KEY([assignee_id])
-- REFERENCES [dbo].[Users] ([user_id])
-- GO
-- ALTER TABLE [dbo].[Tasks] CHECK CONSTRAINT [FK_Task_Assignee]
-- GO
-- ALTER TABLE [dbo].[Tasks]  WITH CHECK ADD  CONSTRAINT [FK_Task_Project] FOREIGN KEY([project_id])
-- REFERENCES [dbo].[Projects] ([project_id])
-- GO
-- ALTER TABLE [dbo].[Tasks] CHECK CONSTRAINT [FK_Task_Project]
-- GO
-- ALTER TABLE [dbo].[Tasks]  WITH CHECK ADD CHECK  (([status]='Cancel' OR [status]='Done' OR [status]='In Progress' OR [status]='To Do'))
-- GO
-- ALTER TABLE [dbo].[Users]  WITH CHECK ADD CHECK  (([role]='Member' OR [role]='Manager' OR [role]='Admin'))
-- GO
-- USE [master]
-- GO
-- ALTER DATABASE [TaskManagement] SET  READ_WRITE
-- GO
--
/* ===============================
   DROP DATABASE NẾU ĐÃ TỒN TẠI
================================= */
USE master;
GO

IF DB_ID('TaskManagement') IS NOT NULL
BEGIN
    ALTER DATABASE TaskManagement SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE TaskManagement;
END
GO

/* ===============================
   CREATE DATABASE
================================= */
CREATE DATABASE TaskManagement;
GO

USE TaskManagement;
GO

/* ===============================
   USERS TABLE
================================= */
CREATE TABLE Users (
                       user_id INT IDENTITY(1,1) PRIMARY KEY,
                       username VARCHAR(50) NOT NULL UNIQUE,
                       password VARCHAR(100) NOT NULL,
                       role VARCHAR(20) NOT NULL
                           CHECK (role IN ('Admin','Manager','Member'))
);
GO

/* ===============================
   PROJECTS TABLE
================================= */
CREATE TABLE Projects (
                          project_id INT IDENTITY(1,1) PRIMARY KEY,
                          name NVARCHAR(100) NOT NULL,
                          description NVARCHAR(255),
                          manager_id INT,
                          status VARCHAR(20) DEFAULT 'Active',

                          CONSTRAINT FK_Project_Manager
                              FOREIGN KEY (manager_id)
                                  REFERENCES Users(user_id)
);
GO

/* ===============================
   TASKS TABLE
================================= */
CREATE TABLE Tasks (
                       task_id INT IDENTITY(1,1) PRIMARY KEY,
                       title NVARCHAR(150) NOT NULL,
                       description NVARCHAR(255),
                       status VARCHAR(20) NOT NULL
                           CHECK (status IN ('To Do','In Progress','Done','Cancel')),
                       deadline DATE,
                       project_id INT,
                       assignee_id INT,

                       CONSTRAINT FK_Task_Project
                           FOREIGN KEY (project_id)
                               REFERENCES Projects(project_id),

                       CONSTRAINT FK_Task_Assignee
                           FOREIGN KEY (assignee_id)
                               REFERENCES Users(user_id)
);
GO

/* ===============================
   INSERT SAMPLE DATA
================================= */

-- Users
INSERT INTO Users(username,password,role) VALUES
('admin','123','Admin'),
('manager1','123','Manager'),
('member1','123','Member'),
('member2','123','Member');

-- Projects
INSERT INTO Projects(name,description,manager_id,status) VALUES
    ('Demo Project','Project test hệ thống',2,'Active');

-- Tasks
INSERT INTO Tasks(title,description,status,deadline,project_id,assignee_id) VALUES
                                                                                ('Thiết kế UI','Làm giao diện JavaFX','To Do','2026-02-25',1,3),
                                                                                ('Viết backend','Xử lý database','In Progress','2026-02-28',1,4),
                                                                                ('Test hệ thống','Kiểm thử toàn bộ','Done','2026-02-20',1,3);
GO
