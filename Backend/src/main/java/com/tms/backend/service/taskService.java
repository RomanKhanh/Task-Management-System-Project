package com.tms.backend.service;

import com.tms.backend.dao.taskDAO;
import com.tms.backend.entity.Task;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;

@Service
public class taskService {
    private final taskDAO TaskDAO;
    public taskService(taskDAO TaskDAO){
        this.TaskDAO=TaskDAO;
    }

    public String CreateTask(String name, String project, String assignee, LocalDate dealine, String status) throws SQLException {
        boolean success = TaskDAO.insert(name, project, assignee, dealine, status);
        if(success){
            return "Tạo Task thành công!!!!";
        }
        else{
            return "Tạo Task thất bại" ;
        }
    }
    public List<Task> getAllTask(){
        List<Task> task = TaskDAO.getAllTask();
        return task;
        }

}
