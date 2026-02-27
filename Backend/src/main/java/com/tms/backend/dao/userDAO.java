package com.tms.backend.dao;


import com.tms.backend.DB.DBConnection;
import com.tms.backend.entity.User;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class userDAO {
    public boolean insert(String username, String password){
        String sql = "INSERT INTO Users (username, password, role) VALUES (?, ?, ?)";
        try(Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)){

            ps.setString(1, username);
            ps.setString(2, password);
            ps.setString(3, "Member");
            ps.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public User finduser(String username, String password){
        String sql = "SELECT * FROM Users WHERE username = ? and password = ?";

        try (Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);) {
            ps.setString(1, username);
            ps.setString(2, password);

            ResultSet rs = ps.executeQuery();
            if(rs.next()){
                User user = new User();
                user.setUsername(rs.getString("username"));
                user.setPassword(rs.getString("password"));
                user.setRole(rs.getString("role"));
                return user;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<User> getAllUsers(){
        List<User> list = new ArrayList<>();
        String sql = "SELECT id, username FROM Users";
        try(Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);) {

            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                User u = new User(
                        rs.getInt("id"),
                        rs.getString("username")
                );
                list.add(u);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }
    public boolean changePassword(String username,
                                  String oldPassword,
                                  String newPassword) {

        try(Connection conn = DBConnection.getConnection()){

            String sql = "UPDATE Users SET password=? WHERE username=? AND password=?";

            PreparedStatement stmt = conn.prepareStatement(sql);

            stmt.setString(1, newPassword);
            stmt.setString(2, username);
            stmt.setString(3, oldPassword);

            int rows = stmt.executeUpdate();

            return rows > 0;

        }catch(Exception e){
            e.printStackTrace();
            return false;
        }
    }
}


