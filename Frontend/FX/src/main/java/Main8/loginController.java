package Main8;

import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.stage.Stage;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import javafx.scene.control.TextField;
import javafx.scene.control.PasswordField;
import javafx.application.Platform;

import java.net.URI;
public class loginController {

    @FXML
    private TextField txtUser;

    @FXML
    private PasswordField txtPass;

    @FXML
    private Label lblRegister;

    @FXML
    public Button lblHome;

    @FXML
    public void initialize() {
        limitInput(txtUser, 30);
        limitInput(txtPass, 16);

        lblRegister.setOnMouseClicked(event -> openRegisterForm());


    }

    private void limitInput(TextField field, int maxLength) {
        field.setTextFormatter(new TextFormatter<String>(change -> {
            if (change.getControlNewText().length() <= maxLength) {
                return change;
            }
            return null;
        }));
    }

    private void openRegisterForm() {
        try {

            FXMLLoader loader = new FXMLLoader(getClass().getResource("/FXML/Register.fxml"));
            Parent root = loader.load();
            Stage current = (Stage) lblRegister.getScene().getWindow();
            current.close();

            Stage stage = new Stage();
            stage.setTitle("Đăng ký tài khoản");
            stage.setScene(new Scene(root));
            stage.setMaximized(true);
            stage.show();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void openHomeForm() {
        try {

            FXMLLoader loader = new FXMLLoader(getClass().getResource("/FXML/Home.fxml"));
            Parent root = loader.load();
            Stage current = (Stage) lblHome.getScene().getWindow();
            current.close();

            Stage stage = new Stage();
            stage.setTitle("Trang Chủ");
            stage.setScene(new Scene(root));
            stage.setMaximized(true);
            stage.show();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }



    private void showAlert(String title, String message) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }

    @FXML
    private void handleLogin() {
        String user = txtUser.getText();
        String pass = txtPass.getText();

        if (user.isEmpty() || pass.isEmpty()) {
            showAlert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
            return;
        }

        String json = String.format(
                "{\"username\":\"%s\",\"password\":\"%s\"}", user, pass
        );

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:8080/api/auth/login"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        HttpClient.newHttpClient()
                .sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenAccept(res -> {
                    Platform.runLater(() -> {
                        if (res.statusCode() == 200) {
                            showAlert("OK", "Đăng nhập thành công");
                            openHomeForm();
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
    }



}
