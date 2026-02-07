package Main8;

import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.layout.StackPane;

import java.net.URL;

public class HomeController {

    @FXML
    private StackPane contentArea;

    private void loadUI(String fxml) {
        try {
            System.out.println("Đang load file: " + fxml);

            URL url = getClass().getResource("/FXML/" + fxml);
            System.out.println("URL: " + url);

            FXMLLoader loader = new FXMLLoader(url);
            Node node = loader.load();

            contentArea.getChildren().clear();
            contentArea.getChildren().add(node);

            System.out.println("Load thành công: " + fxml);

        } catch (Exception e) {
            System.out.println("LỖI KHI LOAD: " + fxml);
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
}
