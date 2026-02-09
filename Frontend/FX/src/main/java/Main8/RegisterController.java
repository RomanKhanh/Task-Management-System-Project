package Main8;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.scene.control.Alert;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.scene.control.Alert.AlertType;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.stage.Stage;


public class RegisterController {
    @FXML
    private TextField preUser;
    @FXML
    private PasswordField prePass;
    @FXML
    private PasswordField ConformedPass;


    @FXML
    private void handleRegister() {

        String user = preUser.getText();
        String pass = prePass.getText();
        String confirm = ConformedPass.getText();

        if (user.isEmpty() || pass.isEmpty() || confirm.isEmpty()) {
            showAlert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (!pass.equals(confirm)) {
            showAlert("Lỗi", "Mật khẩu xác nhận không khớp!");
            return;
        }

        // FORM DATA
        String body = "username=" + user + "&password=" + pass;

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:8080/api/auth/register"))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        HttpClient client = HttpClient.newHttpClient();

        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenAccept(response -> {
                    Platform.runLater(() ->
                            showAlert("Thông báo", response.body())
                    );

                })
                .exceptionally(e -> {
                    Platform.runLater(() ->
                            showAlert("Lỗi", "Không kết nối được Backend!")
                    );
                    return null;
                });
    }


    private void showAlert(String title, String content) {
        Alert alert = new Alert(AlertType.INFORMATION);
        alert.setTitle(title);
        alert.setHeaderText((String)null);
        alert.setContentText(content);
        alert.show();
    }
}
