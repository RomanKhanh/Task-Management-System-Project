package com.tms.backend.controller;

import com.tms.backend.entity.Project;
import com.tms.backend.service.projectService;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/project")
public class ProjectController {
    private final projectService ProjectService;

    public ProjectController(projectService projectService) {
        ProjectService = projectService;
    }
    @PostMapping("/insert")
    public String insert(@RequestParam String name,
                         @RequestParam String manager,
                         @RequestParam String status){
        return ProjectService.CreateProject(name, manager, status);
    }

    @PostMapping("/edit")
    public String edit(@RequestParam int id,
                       @RequestParam String name,
                       @RequestParam String manager,
                       @RequestParam String status){
        return ProjectService.EditProject(id,name, manager, status);
    }

    @PostMapping("/delete")
    public String delete(@RequestParam int id){
        return ProjectService.DeleteProject(id);
    }

    @GetMapping("/all")
    public List<Project> getAllProjects(){return ProjectService.getAllProjects();}
}


