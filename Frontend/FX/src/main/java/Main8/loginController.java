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


    @FXML
    private void handleLogin() {
        String username = txtUser.getText();
        String password = txtPass.getText();

        try {
            String url = "http://localhost:8080/api/login"
                    + "?username=" + username
                    + "&password=" + password;

            HttpClient client = HttpClient.newHttpClient();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .build();

            HttpResponse<String> response =
                    client.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("RESPONSE = [" + response.body() + "]");

            if (response.body().toLowerCase().contains("thành công")) {
                openHomeForm();
            } else {
                Alert alert = new Alert(Alert.AlertType.ERROR);
                alert.setTitle("Lỗi đăng nhập");
                alert.setHeaderText(null);
                alert.setContentText("Sai tài khoản hoặc mật khẩu");
                alert.show();
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


}
