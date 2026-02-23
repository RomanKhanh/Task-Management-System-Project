package com.tms.backend.entity;

import java.time.LocalDate;

public class Task {
    private int id;
    private String name;
    private String project;
    private String assignee;
    private LocalDate deadline;
    private String status;

    public Task(int id, String name, String project, String assignee, LocalDate deadline, String status) {
        this.id = id;
        this.name = name;
        this.project = project;
        this.assignee = assignee;
        this.deadline = deadline;
        this.status = status;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProject() {
        return project;
    }

    public void setProject(String project) {
        this.project = project;
    }

    public String getAssignee() {
        return assignee;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
