package com.tms.backend.plugin.notificationPlugin;

import com.tms.backend.DB.DBConnection;
import com.tms.backend.entity.Project;
import com.tms.backend.entity.Task;
import com.tms.backend.plugin.Event;
import com.tms.backend.plugin.EventType;
import com.tms.backend.plugin.Plugin;
import com.tms.backend.plugin.ProjectPlugin;
import com.tms.backend.service.NotificationService;

import java.sql.Connection;
import java.sql.PreparedStatement;

public class NotificationPlugin implements Plugin {

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

    @Override
    public void execute(Event event) {
        if(event.getType() == EventType.TASK_CREATED){
            Task task  = (Task) event.getData();
            NotificationService.add("Task mới đã được tạo: "+ task.getName());
        }
        if (event.getType() == EventType.PROJECT_CREATED){
            Project project = (Project) event.getData();
            NotificationService.add(("Project mới đã được tạo: "+ project.getName()));        }
        if (event.getType() == EventType.PROJECT_DONE){
            Project project = (Project) event.getData();
            NotificationService.add(("Project "+ project.getName()+" đã hoàn thành"));        }
        if (event.getType() == EventType.PROJECT_UPDATED){
            Project project = (Project) event.getData();
            NotificationService.add(("Project "+ project.getName()+" vừa cập nhật"));        }
        if (event.getType() == EventType.PROJECT_DELETED){
            Project project = (Project) event.getData();
            NotificationService.add(("Project "+ project.getName()+" đã bị xóa"));        }
        if (event.getType() == EventType.PROJECT_STATUS_CHANGED){
            Project project = (Project) event.getData();
            NotificationService.add(("Project "+ project.getName()+" vừa thay đổi trạng thái"));        }


    }




}