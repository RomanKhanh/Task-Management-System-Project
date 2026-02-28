package com.tms.backend.dao;

import com.tms.backend.DB.DBConnection;
import com.tms.backend.entity.Notification;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class NotificationDAO {

    public void insert(Notification n) {
        String sql = """
            INSERT INTO Notifications(project_id, message, seen, created_at)
            VALUES (?, ?, ?, ?)
        """;

        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {

            ps.setInt(1, n.getProjectId());
            ps.setString(2, n.getMessage());
            ps.setBoolean(3, n.isSeen());
            ps.setTimestamp(4, Timestamp.valueOf(n.getCreatedAt()));
            ps.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public List<Notification> getAll() {
        List<Notification> list = new ArrayList<>();
        String sql = "SELECT * FROM Notifications ORDER BY created_at DESC";

        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Notification n = new Notification(
                        rs.getInt("project_id"),
                        rs.getString("message")
                );
                list.add(n);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }
}