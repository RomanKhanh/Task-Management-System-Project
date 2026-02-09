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
        String user = this.preUser.getText();
        String pass = this.prePass.getText();
//        String confirmPass = this.ConformedPass.getText();
//        if (!user.isEmpty() && !pass.isEmpty() && !confirmPass.isEmpty()) {
//            if (!pass.equals(confirmPass)) {
//                this.showAlert("Lỗi", "Mật khẩu xác nhận không khớp!");
//            } else {
//                this.showAlert("Thành công", "Đăng ký tài khoản thành công!");
//                String jsonPayload = String.format("{\"username\":\"%s\", \"password\":\"%s\"}", user, pass);
//                HttpClient client = HttpClient.newHttpClient();
//                HttpRequest request = HttpRequest.newBuilder().uri(URI.create("http://localhost:8080/api/register")).header("Content-Type", "application/json").POST(BodyPublishers.ofString(jsonPayload)).build();
//                client.sendAsync(request, BodyHandlers.ofString()).thenApply(HttpResponse::body).thenAccept((result) -> Platform.runLater(() -> this.showAlert("Thông báo", result))).exceptionally((ex) -> {
//                    Platform.runLater(() -> this.showAlert("Lỗi", "Không kết nối được Backend!"));
//                    return null;
//                });
//            }
//        } else {
//            this.showAlert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
//        }
        String url = String.format(
                "http://localhost:8080/api/register?username=%s&password=%s",
                user, pass
        );

        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .POST(HttpRequest.BodyPublishers.noBody())
                .build();

        client.sendAsync(request, BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenAccept(result ->
                        Platform.runLater(() -> this.showAlert("Thông báo", result))
                )
                .exceptionally(ex -> {
                    Platform.runLater(() ->
                            this.showAlert("Lỗi", "Không kết nối được Backend!")
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
