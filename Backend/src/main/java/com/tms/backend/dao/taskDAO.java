package com.tms.backend.dao;

import com.tms.backend.DB.TaskConnection;
import com.tms.backend.entity.Project;
import com.tms.backend.entity.Task;
import org.springframework.stereotype.Repository;

import javax.xml.crypto.Data;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Repository
public class taskDAO {
    public boolean insert(String nametask, String projectname, String assignee, LocalDate deadline, String status) throws SQLException {
        String sql = "INSERT INTO tasks (name, project, assignee, deadline, status) VALUES (?, ?, ?, ?, ?)";
        try(Connection conn = TaskConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql))
        {
            ps.setString(1,nametask);
            ps.setString(2,projectname);
            ps.setString(3,assignee);
            ps.setDate(4, java.sql.Date.valueOf(deadline));
            ps.setString(5,status);
            ps.executeUpdate();
            return true;
        }catch (SQLException e){
            e.printStackTrace();
            return false;
        }
    }
    public List<Task> getAllTask(){
        List<Task> task = new ArrayList<>();
        String sql = "SELECT id, name, project, assignee, deadline, status FROM tasks";
        try(Connection conn = TaskConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);) {
            ResultSet rs = ps.executeQuery();
            while(rs.next()){
                Task p = new Task(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getString("project"),
                        rs.getString("assignee"),
                        rs.getDate("deadline").toLocalDate(),
                        rs.getString("status")
                );
                task.add(p);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return task;
    }
}
