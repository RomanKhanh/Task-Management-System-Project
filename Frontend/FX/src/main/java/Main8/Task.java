package Main8;

import java.time.LocalDate;

public class Task {

    private String name;
    private Project project;
    private User assignee;
    private LocalDate deadline;
    private String status;

    public Task(String name,
                Project project,
                User assignee,
                LocalDate deadline,
                String status) {

        this.name = name;
        this.project = project;
        this.assignee = assignee;
        this.deadline = deadline;
        this.status = status;
    }

    public String getName() {
        return name;
    }

    public User getAssignee() {
        return assignee;
    }

    public void setAssignee(User assignee) {
        this.assignee = assignee;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public String getStatus() {
        return status;
    }
}

