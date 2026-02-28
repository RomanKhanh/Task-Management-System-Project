package com.tms.backend.dao;

import com.tms.backend.DB.DBConnection;
import com.tms.backend.DB.ProjectConnection;
import com.tms.backend.entity.Project;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class projectDAO {
    public boolean insert(String name, String manager, String status){
        String sql = "INSERT INTO Projects (name, manager, status) VALUES (?, ?, ?)";
        try(Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);
        ) {
            ps.setString(1,name);
            ps.setString(2,manager);
            ps.setString(3,status);
            ps.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    public boolean edit(int id, String name, String manager, String status){
        String sql = "UPDATE Projects SET name=?, manager=?, status=? WHERE id=?";
        try(Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);){


            ps.setString(1,name);
            ps.setString(2,manager);
            ps.setString(3,status);
            ps.setInt(4,id);
            int rows = ps.executeUpdate();
            return rows >0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean delete(int id){
        String sql = "DELETE FROM Projects WHERE id=?";
        try(Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);
            ) {
            ps.setInt(1,id);
            int rows = ps.executeUpdate();
            return rows >0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<Project> getAllProjects(){
        List<Project> list = new ArrayList<>();
        String sql = "SELECT id, name, manager, status FROM Projects";
        try(Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);) {
            ResultSet rs = ps.executeQuery();
            while(rs.next()) {

                    Project p = new Project(
                            rs.getInt("id"),
                            rs.getString("name"),
                            rs.getString("manager"),
                            rs.getString("status")
                    );
                    list.add(p);

            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }
    public static Project findById(int id) {
        String sql = "SELECT * FROM Projects WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                return new Project(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getString("manager"),
                        rs.getString("status")
                );
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static void update(Project project) {
        String sql = "UPDATE Projects SET status=? WHERE id=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, project.getStatus());
            ps.setInt(2, project.getId());
            ps.executeUpdate();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
