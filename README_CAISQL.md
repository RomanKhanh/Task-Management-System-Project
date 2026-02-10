HUONG DAN CAI DAT SQL SERVER
1. Cai SQL Server
- Cai SQL Server Express
- Chon instance: SQLEXPRESS
- Authentication: Mixed Mode (SQL Server and Windows)
- Dat mat khau cho user sa
- Hoan tat cai dat

2. Mo SQL Server Configuration Manager
- Vao: SQL Server Network Configuration
- Chon: Protocols for SQLEXPRESS
- Enable TCP/IP

3. Cau hinh TCP/IP
- Chuot phai TCP/IP -> Properties
- Tab IP Addresses
- IPAll:
  + TCP Dynamic Ports: de trong
  + TCP Port: 1433
- OK

4. Khoi dong lai SQL Server
- Mo SQL Server Services
- Restart:
  + SQL Server (SQLEXPRESS)
  + SQL Server Browser

5. Mo SQL Server Management Studio (SSMS)
- Dang nhap bang Windows Authentication
- Chuot phai server -> Properties -> Security
- Chon: SQL Server and Windows Authentication mode
- OK
- Restart lai SQL Server (SQLEXPRESS)

6. Bat login sa
- Security -> Logins -> sa
- Properties
- Status:
  + Login: Enabled
- Dat mat khau cho sa
- OK

7. Tao database
- Chuot phai Databases -> New Database
- Ten: TaskManagement
- OK

8. Test dang nhap bang sa
- Disconnect
- Login lai:
  + Login: sa
  + Password: (mat khau da dat)
- Thanh cong la dung

9. Chuoi ket noi JDBC dung
jdbc:sqlserver://localhost:1433;databaseName=TaskManagement;encrypt=true;trustServerCertificate=true

10. Thuong gap loi
- Loi 1433: chua mo TCP/IP hoac chua restart SQL Server
- Loi Login failed for user sa: chua bat sa hoac sai mat khau
- Loi No suitable driver: chua them mssql-jdbc vao pom.xml

==== HET ====
