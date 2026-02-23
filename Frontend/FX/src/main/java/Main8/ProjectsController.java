package Main8;

import javafx.application.Platform;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.StackPane;
import org.json.JSONArray;
import org.json.JSONObject;

import java.net.URI;
import java.net.URL;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class ProjectsController {

    private ObservableList<User> userList = FXCollections.observableArrayList();
    @FXML
    private TableView<Project> projectTable;
    @FXML
    private TableColumn<Project, Integer> colId;
    @FXML
    private TableColumn<Project,String> colName;
    @FXML
    private TableColumn<Project,String> colManager;
    @FXML
    private TableColumn<Project,String> colStatus;
    @FXML
    public void initialize(){
        colId.setCellValueFactory((new PropertyValueFactory<>("id")));
        colName.setCellValueFactory((new PropertyValueFactory<>("name")));
        colManager.setCellValueFactory((new PropertyValueFactory<>("manager")));
        colStatus.setCellValueFactory((new PropertyValueFactory<>("status")));
        projectTable.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY);
    loadProjects();
    loadUser();

    }

    public void handleCreateProject(){
        Dialog<Project> dialog = new Dialog<>();
        dialog.setTitle("Create Project");
        dialog.setHeaderText("Create New Project");

        ButtonType Createbuttontype = new ButtonType("Create", ButtonBar.ButtonData.OK_DONE);
        dialog.getDialogPane().getButtonTypes().addAll(Createbuttontype,ButtonType.CANCEL);

        TextField nameField = new TextField();
        nameField.setPromptText("Name");

        ComboBox<User> ManagerBox = new ComboBox<>();
        ManagerBox.setItems(userList);

        ComboBox<String> statusbox = new ComboBox<>();
        statusbox.getItems().addAll("Draft", "Planned", "Active", "On Hold");

        statusbox.setValue("Planned");

        GridPane grid = new GridPane();
        grid.setHgap(10);
        grid.setVgap(10);
        grid.add(new Label("Project Name: "), 0, 0);
        grid.add(nameField, 1, 0);
        grid.add(new Label("Manager: "), 0, 1);
        grid.add(ManagerBox,1,1);
        grid.add(new Label("Status"),0,2);
        grid.add(statusbox,1,2);
        dialog.getDialogPane().setContent(grid);

        dialog.setResultConverter(dialogButton -> {
            if(dialogButton == Createbuttontype){
                return new Project(
                        nameField.getText(),
                        ManagerBox.getValue().getName(),
                        statusbox.getValue()
                );
            }
            return null;
        });
        dialog.showAndWait().ifPresent(project -> {
            System.out.println("Create" + project.getName());
            String body = String.format(
                    "name=%s&manager=%s&status=%s",
                    project.getName(),
                    project.getManager(),
                    project.getStatus()
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://localhost:8080/api/project/insert"))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpClient.newHttpClient()
                    .sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenAccept(res -> {
                        Platform.runLater(() -> {
                            if (res.statusCode() == 200) {
                                showAlert("OK", res.body());
                                loadProjects();
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

    public void handleEditProject(){
        Dialog<Project> dialog = new Dialog<>();
        dialog.setTitle("Edit Project");
        dialog.setHeaderText("Edit Project");

        ButtonType Createbuttontype = new ButtonType("Edit", ButtonBar.ButtonData.OK_DONE);
        dialog.getDialogPane().getButtonTypes().addAll(Createbuttontype,ButtonType.CANCEL);

        TextField idField = new TextField();
        idField.setPromptText("id");

        TextField nameField = new TextField();
        nameField.setPromptText("Name");

        ComboBox<User> ManagerBox = new ComboBox<>();
        ManagerBox.setItems(userList);

        ComboBox<String> statusbox = new ComboBox<>();
        statusbox.getItems().addAll("Draft", "Planned", "Active", "On Hold");

        statusbox.setValue("Planned");

        GridPane grid = new GridPane();
        grid.setHgap(10);
        grid.setVgap(10);
        grid.add(new Label("Project ID: "), 0, 0);
        grid.add(idField, 1, 0);
        grid.add(new Label("Project Name: "), 0, 1);
        grid.add(nameField, 1, 1);
        grid.add(new Label("Manager: "), 0, 2);
        grid.add(ManagerBox,1,2);
        grid.add(new Label("Status"),0,3);
        grid.add(statusbox,1,3);
        dialog.getDialogPane().setContent(grid);

        dialog.setResultConverter(dialogButton -> {
            if(dialogButton == Createbuttontype){
                try {
                    int id = Integer.parseInt(idField.getText());

                    return new Project(
                            id,
                            nameField.getText(),
                            ManagerBox.getValue().getName(),
                            statusbox.getValue()
                    );

                } catch (NumberFormatException e) {
                    showAlert("Lỗi", "ID phải là số");
                    return null;
                }
            }
            return null;
        });
        dialog.showAndWait().ifPresent(project -> {
            System.out.println("Edit" + project.getName());
            String body = String.format(
                    "id=%d&name=%s&manager=%s&status=%s",
                    project.getId(),
                    project.getName(),
                    project.getManager(),
                    project.getStatus()
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://localhost:8080/api/project/edit"))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpClient.newHttpClient()
                    .sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenAccept(res -> {
                        Platform.runLater(() -> {
                            if (res.statusCode() == 200) {
                                showAlert("OK", res.body());
                                loadProjects();
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
    public void handleDeleteProject(){
        Dialog<Integer> dialog = new Dialog<>();
        dialog.setTitle("Delete Project");
        dialog.setHeaderText("Delete Project");

        ButtonType Createbuttontype = new ButtonType("Delete", ButtonBar.ButtonData.OK_DONE);
        dialog.getDialogPane().getButtonTypes().addAll(Createbuttontype,ButtonType.CANCEL);

        TextField idField = new TextField();

        idField.setPromptText("id");


        GridPane grid = new GridPane();
        grid.setHgap(10);
        grid.setVgap(10);
        grid.add(new Label("Project ID: "), 0, 0);
        grid.add(idField, 1, 0);
        dialog.getDialogPane().setContent(grid);

        dialog.setResultConverter(dialogButton -> {
            if(dialogButton == Createbuttontype){
                try{
                    return Integer.parseInt(idField.getText());
                }catch (NumberFormatException e){
                    showAlert("Lỗi","ID phải là số");
                    return null;
                }
            }
            return null;
        });
        dialog.showAndWait().ifPresent(project -> {
            String body = "id=" + project;

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://localhost:8080/api/project/delete"))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpClient.newHttpClient()
                    .sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenAccept(res -> {
                        Platform.runLater(() -> {
                            if (res.statusCode() == 200) {
                                showAlert("OK", res.body());
                                loadProjects();
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
    public void loadProjects(){

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:8080/api/project/all"))
                .GET()
                .build();

        HttpClient.newHttpClient()
                .sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenAccept(res -> {

                    String json = res.body();

                    Platform.runLater(() -> {

                        projectTable.getItems().clear();

                        try{

                            org.json.JSONArray array = new org.json.JSONArray(json);

                            for(int i=0;i<array.length();i++){

                                org.json.JSONObject obj = array.getJSONObject(i);

                                Project p = new Project(
                                        obj.getInt("id"),
                                        obj.getString("name"),
                                        obj.getString("manager"),
                                        obj.getString("status")
                                );

                                projectTable.getItems().add(p);
                            }

                        }catch(Exception e){
                            e.printStackTrace();
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
                        userList.clear();
                        JSONArray array = new JSONArray(res.body());

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

}

