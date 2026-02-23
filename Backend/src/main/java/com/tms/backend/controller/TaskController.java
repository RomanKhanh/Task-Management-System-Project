package com.tms.backend.controller;

import com.tms.backend.entity.Task;
import com.tms.backend.service.taskService;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/task")
public class TaskController {
    private final taskService TaskService;

    public TaskController(taskService taskService) {
        TaskService = taskService;
    }

    @PostMapping("/insert")
    public String insert(@RequestParam String name,
                         @RequestParam String project,
                         @RequestParam String assignee,
                         @RequestParam String deadline,
                         @RequestParam String status) throws SQLException {
        LocalDate date = LocalDate.parse(deadline);
        return TaskService.CreateTask(name, project, assignee, date, status);
    }

    @GetMapping("/all")
    public List<Task> getAllTask(){
        return TaskService.getAllTask();
    }
}
