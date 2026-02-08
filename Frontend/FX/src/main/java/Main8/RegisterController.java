package Main8;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse.BodyHandlers;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.scene.control.Alert;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.scene.control.Alert.AlertType;

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
        String confirmPass = ConformedPass.getText();

        if (user.isEmpty() || pass.isEmpty() || confirmPass.isEmpty()) {
            showAlert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (!pass.equals(confirmPass)) {
            showAlert("Lỗi", "Mật khẩu xác nhận không khớp!");
            return;
        }

        // --- PHẦN KẾT NỐI VỚI SPRING BOOT ---
        // 1. Đóng gói JSON
        String jsonPayload = String.format("{\"username\":\"%s\", \"password\":\"%s\"}", user, pass);

        // 2. Gửi lệnh POST lên Backend
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:8080/api/register"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                .build();

        // 3. Nhận phản hồi
        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenAccept(result -> {
                    javafx.application.Platform.runLater(() -> {
                        showAlert("Thông báo", result);
                    });
                })
                .exceptionally(ex -> {
                    javafx.application.Platform.runLater(() -> showAlert("Lỗi", "Không kết nối được Backend!"));
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
