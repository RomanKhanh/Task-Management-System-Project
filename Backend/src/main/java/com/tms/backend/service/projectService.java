package com.tms.backend.service;

import com.tms.backend.dao.projectDAO;
import com.tms.backend.entity.Project;
import com.tms.backend.plugin.Event;
import com.tms.backend.plugin.EventType;
import com.tms.backend.plugin.notificationPlugin.PluginLoader;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class projectService {

    private final projectDAO projectDAO;
    private final PluginLoader pluginLoader = new PluginLoader();

    public projectService(projectDAO projectDAO) {
        this.projectDAO = projectDAO;
    }

    public String CreateProject(String name, String manager, String status){

        boolean success = projectDAO.insert(name,manager,status);

        if(success){

            // Lấy project vừa tạo (ví dụ lấy theo name)
            Project project = com.tms.backend.dao.projectDAO.findByName(name);

            Event event = new Event(EventType.PROJECT_CREATED, project);

            pluginLoader.run(event);

            return "Tạo Project thành công";
        }
        else {
            return "Tạo Project thất bại";
        }
    }

    public String EditProject(int id, String name, String manager, String status){

        boolean success = projectDAO.edit(id,name,manager,status);

        if(success){

            Project project = projectDAO.findById(id);

            Event event = new Event(EventType.PROJECT_UPDATED, project);

            pluginLoader.run(event);

            return "Chỉnh sửa Project thành công";
        }
        else {
            return "Chỉnh sửa thất bại";
        }
    }

    public String DeleteProject(int id){

        boolean success = projectDAO.delete(id);

        if(success){

            Event event = new Event(EventType.PROJECT_DELETED, id);

            pluginLoader.run(event);

            return "Xoá Project thành công";
        }
        else{
            return "Xoá Project thất bại";
        }
    }

    public List<Project> getAllProjects(){
        return projectDAO.getAllProjects();
    }

    // 🔥 KHÔNG ĐỂ STATIC
    public void updateStatus(int projectId, String newStatus) {

        Project project = projectDAO.findById(projectId);
        if (project == null) return;

        project.setStatus(newStatus);
        projectDAO.update(project);

        Event event = new Event(EventType.PROJECT_STATUS_CHANGED, project);

        pluginLoader.run(event);
        System.out.println(NotificationService.getAll());
    }
}