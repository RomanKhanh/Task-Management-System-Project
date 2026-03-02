package Main8;

import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.layout.StackPane;
import javafx.fxml.FXML;
import javafx.scene.layout.VBox;
import javafx.scene.shape.Circle;
import java.net.URL;

public class HomeController {

    @FXML
    private StackPane contentArea;
    @FXML private VBox notificationPane;
    @FXML private Circle notifDot;
    @FXML private VBox notificationList;
    @FXML
    public void initialize() {
        // load dashboard mặc định khi mở app
        loadUI("Dashboard.fxml");

    }

    private void loadUI(String fxml) {
        try {
            URL url = getClass().getResource("/FXML/" + fxml);
            FXMLLoader loader = new FXMLLoader(url);
            Node node = loader.load();

            // KHÔNG clear toàn bộ nữa
            contentArea.getChildren().removeIf(n -> n != notificationPane);

            // thêm UI mới xuống dưới
            contentArea.getChildren().add(0, node);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @FXML
    private void showProjects() {
        loadUI("Projects.fxml");
    }

    @FXML
    private void showSettings() {
        loadUI("Settings.fxml");
    }

    @FXML
    private void showDashboard(){ loadUI("Dashboard.fxml");}

    @FXML
    private void showTask(){ loadUI("Task.fxml");}




    @FXML
    private void toggleNotification() {

        System.out.println("CLICKED");

        boolean show = !notificationPane.isVisible();

        notificationPane.setVisible(show);
        notificationPane.setManaged(show);
        notificationPane.toFront();   // 🔥 quan trọng

        if (show) {
            notifDot.setVisible(false);
        }
    }
}

