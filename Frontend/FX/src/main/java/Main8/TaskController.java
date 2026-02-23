package Main8;


import javafx.application.Platform;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.VBox;
import org.json.JSONArray;
import org.json.JSONObject;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.sql.Connection;
import java.time.LocalDate;

public class TaskController {

    private ObservableList<Project> projectList = FXCollections.observableArrayList();
    private ObservableList<User> userList = FXCollections.observableArrayList();
    @FXML
    private TitledPane todayPane;
    @FXML
    private TitledPane overduePane;
    @FXML
    private   TitledPane nextPane;
    @FXML
    private TitledPane unscheduledPane;


    @FXML
    private VBox doneContainer;
    @FXML
    private VBox cancelContainer;

    @FXML
    private TitledPane assignPane;
    @FXML
    private VBox assignContainer;
    @FXML
    public void initialize(){
        loadProject();
        loadUser();
        loadTask();

    }
    @FXML
    public void handleCreateTask(){
        Dialog<Task> dialog = new Dialog<>();
        dialog.setTitle("Create Task");
        dialog.setHeaderText("Create New Task");

        ButtonType Createbuttontype = new ButtonType("Create", ButtonBar.ButtonData.OK_DONE);
        dialog.getDialogPane().getButtonTypes().addAll(Createbuttontype,ButtonType.CANCEL);

        TextField nameField = new TextField();
        nameField.setPromptText("Task name");

        ComboBox<Project> projectBox = new ComboBox<>();
        projectBox.setItems(projectList);


        ComboBox<User> assigneeBox = new ComboBox<>();
        assigneeBox.setItems(userList);

        DatePicker deadlinePicker = new DatePicker();

        ComboBox<String> statusbox = new ComboBox<>();
        statusbox.getItems().addAll("To Do", "In progress", "Done", "Cancel");

        statusbox.setValue("To Do");

        GridPane grid = new GridPane();
        grid.setHgap(10);
        grid.setVgap(10);
        grid.add(new Label("Task Name: "), 0, 0);
        grid.add(nameField, 1, 0);
        grid.add(new Label("Project: "), 0, 1);
        grid.add(projectBox,1,1);
        grid.add(new Label("Assignee: "),0,2);
        grid.add(assigneeBox,1,2);
        grid.add(new Label("Deadline"),0,3);
        grid.add(deadlinePicker,1,3);
        grid.add(new Label("Status"),0,4);
        grid.add(statusbox,1,4);
        dialog.getDialogPane().setContent(grid);

        dialog.setResultConverter(dialogButton -> {
            if(dialogButton == Createbuttontype){
                return new Task(
                        nameField.getText(),
                        projectBox.getValue(),
                        assigneeBox.getValue(),
                        deadlinePicker.getValue(),
                        statusbox.getValue()
                );
                }
            return null;
            });
        dialog.showAndWait().ifPresent(task -> {
            System.out.println("Create" + task.getName());
            String body = String.format(
                    "name=%s&project=%s&assignee=%s&deadline=%s&status=%s",
                    task.getName(),
                    task.getProject().getName(),
                    task.getAssignee().getName(),
                    task.getDeadline().toString(),
                    task.getStatus()
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://localhost:8080/api/task/insert"))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpClient.newHttpClient()
                    .sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenAccept(res -> {
                        Platform.runLater(() -> {
                            if (res.statusCode() == 200) {
                                showAlert("OK", res.body());
                            } else {
                                showAlert("Lỗi", res.body());
                            }
                        });
                    })
                    .exceptionally(ex -> {
                        Platform.runLater(() ->
                                showAlert("Lỗi", "Không kết nối được Backend")
                        );
                        return null;
                    });
        });

    }
    private void showAlert(String title, String message) {

        Alert alert = new Alert(Alert.AlertType.INFORMATION);

        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(message);

        alert.showAndWait();
    }

    public void loadProject(){

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:8080/api/project/all"))
                .GET()
                .build();

        HttpClient.newHttpClient()
                .sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenAccept(res -> {

                    String json = res.body();

                    Platform.runLater(() -> {




                            org.json.JSONArray array = new org.json.JSONArray(json);
                            projectList.clear();
                            for(int i=0;i<array.length();i++){

                                org.json.JSONObject obj = array.getJSONObject(i);

                                projectList.add(new Project(
                                        obj.getInt("id"),
                                        obj.getString("name")
                                ));
                            }



                    });

                });

    }

    public void loadUser(){

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:8080/api/auth/all"))
                .GET()
                .build();

        HttpClient.newHttpClient()
                .sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenAccept(res -> {

                    Platform.runLater(() -> {

                        JSONArray array = new JSONArray(res.body());
                        userList.clear();

                        for (int i = 0; i < array.length(); i++) {

                            JSONObject obj = array.getJSONObject(i);

                            userList.add(new User(
                                    obj.getInt("id"),
                                    obj.getString("username")
                            ));
                        }



                    });

                });

    }
    public void loadTask(){
        System.out.println("User đang login: " + Session.getCurrentUsername());

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:8080/api/task/all"))
                .GET()
                .build();

        HttpClient.newHttpClient()
                .sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenAccept(res -> {

                    String json = res.body();
                    System.out.println("STATUS CODE: " + res.statusCode());
                    System.out.println("JSON nhận được: " + json);
                    Platform.runLater(() -> {



                        try {

                            todayPane.setContent( new VBox(10));
                            nextPane.setContent(new VBox(10));
                            overduePane.setContent(new VBox(10));
                            unscheduledPane.setContent(new VBox(10));
                            doneContainer.getChildren().clear();
                            cancelContainer.getChildren().clear();
                            assignContainer.getChildren().clear();
                            assignPane.setContent(assignContainer);

                            VBox todayBox = (VBox) todayPane.getContent();
                            VBox overdueBox =  (VBox) overduePane.getContent();
                            VBox nextBox = (VBox) nextPane.getContent();
                            VBox unscheduledBox  = (VBox) unscheduledPane.getContent();


                            LocalDate today = LocalDate.now();
                            String username = Session.getCurrentUsername();

                            org.json.JSONArray array = new org.json.JSONArray(json);

                            for (int i = 0; i < array.length(); i++) {

                                org.json.JSONObject obj = array.getJSONObject(i);

                                String name = obj.getString("name");
                                String status = obj.getString("status");
                                String assignee = obj.getString("assignee");

                                System.out.println("----");
                                System.out.println("Assignee từ JSON: [" + assignee + "]");
                                System.out.println("Username session: [" + username + "]");
                                System.out.println("So sánh: " + assignee.equalsIgnoreCase(username));



                                Label taskLabel = new Label(name);
                                taskLabel.getStyleClass().add("task-item");



                                if(status.equalsIgnoreCase("Done")){
                                    doneContainer.getChildren().add(taskLabel);
                                    continue;
                                }

                                if(status.equalsIgnoreCase("Cancel")){
                                    cancelContainer.getChildren().add(taskLabel);
                                    continue;
                                }
                                if(assignee.equalsIgnoreCase(username)){
                                    Label assignLabel = new Label(name);
                                    assignLabel.getStyleClass().add("task-item");
                                    assignContainer.getChildren().add(assignLabel);

                                }

                                if(obj.isNull("deadline")){
                                    unscheduledBox.getChildren().add(taskLabel);
                                }
                                else {
                                    LocalDate deadline = LocalDate.parse(obj.getString("deadline"));
                                    if(deadline.isEqual(today)){
                                        todayBox.getChildren().add(taskLabel);
                                    }
                                    else if(deadline.isBefore(today)){
                                        overdueBox.getChildren().add(taskLabel);
                                    }
                                    else {
                                        nextBox.getChildren().add(taskLabel);
                                    }
                                }



                            }
                            System.out.println("SỐ TASK TRONG ASSIGN: " + assignContainer.getChildren().size());




                        } catch (Exception e) {
                            e.printStackTrace();
                        }

                    });

                });
    }




}
