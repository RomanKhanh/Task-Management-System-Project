package com.tms.backend.entity;

import java.time.LocalDateTime;

public class Notification {
    private int id;
    private int projectId;
    private String message;
    private boolean seen;
    private LocalDateTime createdAt;

    public Notification() {}

    public Notification(int projectId, String message) {
        this.projectId = projectId;
        this.message = message;
        this.seen = false;
        this.createdAt = LocalDateTime.now();
    }

    public int getId() {
        return id;
    }

    public int getProjectId() {
        return projectId;
    }

    public String getMessage() {
        return message;
    }

    public boolean isSeen() {
        return seen;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setSeen(boolean seen) {
        this.seen = seen;
    }
}