package com.example.fx;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.ButtonBar;
import javafx.scene.control.ButtonType;
import javafx.scene.layout.StackPane;
import javafx.stage.Stage;

import java.util.Optional;

public class Main31 extends Application {
        Button button;
    public static void main(String[] args) {
        launch(args);
    }

    @Override
    public void start(Stage primaryStage) {
        primaryStage.setTitle("Web");
        button = new Button("Close");
        button.setOnAction(event -> {
            Alert alert = new Alert(Alert.AlertType.CONFIRMATION);
            alert.setTitle("Mày có chắc muốn đóng không?");
            alert.setHeaderText("check otp");
            alert.setContentText("Chọn lựa chọn đi");

            ButtonType buttonTypeYes = new ButtonType("Yes", ButtonBar.ButtonData.YES);
            ButtonType buttonTypeNo = new ButtonType("No", ButtonBar.ButtonData.NO);
            ButtonType buttonTypeCancle = new ButtonType("Cancle", ButtonBar.ButtonData.CANCEL_CLOSE);

            alert.getButtonTypes().setAll(buttonTypeYes,buttonTypeNo,buttonTypeCancle);
            Optional<ButtonType> result = alert.showAndWait();
            if(result.isPresent()){
                if(result.get().getButtonData()==ButtonBar.ButtonData.YES){
                    Alert alert1 = new Alert(Alert.AlertType.INFORMATION);
                    alert1.setContentText("M đã chọn đóng");
                    alert1.show();
                } else if (result.get().getButtonData()==ButtonBar.ButtonData.NO) {
                    Alert alert2 = new Alert(Alert.AlertType.INFORMATION);
                    alert2.setContentText("M đã chọn không đóng");
                    alert2.show();
                }
                else {
                    Alert alert3 = new Alert(Alert.AlertType.INFORMATION);
                    alert3.setContentText("M đã chọn huỷ");
                    alert3.show();
                }
//                String message = result.get().getText();
//                Alert alert1 = new Alert(Alert.AlertType.INFORMATION);
//                alert1.setTitle("Information");
//                alert1.setHeaderText("Notification");
//                alert1.setContentText(message);
//                alert1.show();
            }


        });
        StackPane layout = new StackPane();
        layout.getChildren().add(button);
        Scene scene = new Scene(layout,300,200);
        primaryStage.setScene(scene);
        primaryStage.show();
    }
}
