package com.tms.backend.entity;

public class Project {
    private int id;
    private String name;
    private String manager;
    private String status;

    public Project(int id, String name, String manager, String status) {
        this.id=id;
        this.name = name;
        this.manager = manager;
        this.status = status;
    }
    public Project( String name, String manager, String status) {

        this.name = name;
        this.manager = manager;
        this.status = status;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Project(String text) {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getManager() {
        return manager;
    }

    public void setManager(String manager) {
        this.manager = manager;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
