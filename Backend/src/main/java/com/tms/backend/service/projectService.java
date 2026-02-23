package com.tms.backend.service;

import com.tms.backend.dao.projectDAO;
import com.tms.backend.entity.Project;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class projectService {
    private final projectDAO ProjectDAO;

    public projectService(projectDAO projectDAO) {
        ProjectDAO = projectDAO;
    }

    public String CreateProject(String name, String manager, String status){
        boolean success = ProjectDAO.insert(name,manager,status);
        if(success){
            return "Tạo Project thành công";
        }
        else {
            return "Tạo Project thất bại";
        }
    }

    public String EditProject(int id, String name, String manager, String status){
        boolean success = ProjectDAO.edit(id,name,manager,status);
        if(success){
            return "Chỉnh sửa Project thành công";
        }
        else {
            return "Chỉnh sửa thất bại";
        }
    }

    public String DeleteProject(int id){
        boolean success = ProjectDAO.delete(id);
        if(success){
            return "Xoá Project thành công";
        }
        else{
            return "Xoá Project thất bại";
        }
    }

    public List<Project> getAllProjects(){
        List<Project> list = ProjectDAO.getAllProjects();
        return list;
    }
}
