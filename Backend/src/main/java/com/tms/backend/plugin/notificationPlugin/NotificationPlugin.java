package com.tms.backend.plugin.notificationPlugin;

import com.tms.backend.DB.DBConnection;
import com.tms.backend.entity.Project;
import com.tms.backend.plugin.ProjectPlugin;

import java.sql.Connection;
import java.sql.PreparedStatement;

public class NotificationPlugin implements ProjectPlugin {

    @Override
    public void onStatusChange(Project project) {

        System.out.println("NotificationPlugin triggered");

        String sql = """
        INSERT INTO notifications (project_id, receiver, message)
        VALUES (?, ?, ?)
    """;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, project.getId());
            ps.setString(2, project.getManager());
            ps.setString(3,
                    "Project " + project.getName()
                            + " changed status to " + project.getStatus()
            );
            ps.executeUpdate();
            System.out.println("Notification saved to DB");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}