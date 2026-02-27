package Main8;

import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class SettingsController {

    @FXML
    private PasswordField oldPasswordField;

    @FXML
    private PasswordField newPasswordField;

    @FXML
    private PasswordField confirmPasswordField;

    @FXML
    private Label messageLabel;

    @FXML
    private void handleChangePassword() {

        String oldPass = oldPasswordField.getText();
        String newPass = newPasswordField.getText();
        String confirmPass = confirmPasswordField.getText();

        // kiểm tra rỗng
        if (oldPass.isEmpty() || newPass.isEmpty() || confirmPass.isEmpty()) {
            messageLabel.setText("Please fill all fields");
            return;
        }

        // kiểm tra confirm password
        if (!newPass.equals(confirmPass)) {
            messageLabel.setText("New passwords do not match");
            return;
        }

        try {

            // lấy username từ Session
            String username = Session.getCurrentUsername();

            // DEBUG để kiểm tra
            System.out.println("DEBUG username: " + username);
            System.out.println("DEBUG oldPass: " + oldPass);
            System.out.println("DEBUG newPass: " + newPass);

            // kiểm tra nếu username null
            if (username == null || username.isEmpty()) {
                messageLabel.setText("User not logged in");
                return;
            }

            URL url = new URL("http://localhost:8080/api/auth/change-password");

            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            String json =
                    "{"
                            + "\"username\":\"" + username + "\","
                            + "\"oldPassword\":\"" + oldPass + "\","
                            + "\"newPassword\":\"" + newPass + "\""
                            + "}";

            // DEBUG JSON
            System.out.println("DEBUG JSON: " + json);

            OutputStream os = conn.getOutputStream();
            os.write(json.getBytes("UTF-8"));
            os.close();

            int responseCode = conn.getResponseCode();

            System.out.println("DEBUG responseCode: " + responseCode);

            if (responseCode == 200) {
                messageLabel.setText("Password changed successfully ✅");
            } else {
                messageLabel.setText("Wrong old password ❌");
            }

        } catch (Exception e) {
            e.printStackTrace();
            messageLabel.setText("Connection error ❌");
        }
    }
}