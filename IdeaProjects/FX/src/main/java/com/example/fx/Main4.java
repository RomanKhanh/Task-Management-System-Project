package com.example.fx;

import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.scene.Node;
import javafx.scene.control.*;
import javafx.scene.layout.GridPane;
import javafx.stage.Stage;
import javafx.util.Pair;

import java.util.Optional;

public class Main4 extends Application {

    public static void main(String[] args) {
        launch(args);
    }

    @Override
    public void start(Stage primaryStage) {
        Dialog<Pair<String, String>> dialog = new Dialog<>();
        dialog.setTitle("Login Dialog");
        dialog.setHeaderText("Sign Up");

        ButtonType loginButtonType = new ButtonType("Login", ButtonBar.ButtonData.OK_DONE);
        dialog.getDialogPane().getButtonTypes().addAll(loginButtonType, ButtonType.CANCEL);

        GridPane grip = new GridPane();
        grip.setHgap(10);
        grip.setVgap(10);
        grip.setPadding(new Insets(30,150,50,60));

        TextField username = new TextField();
        username.setPromptText("UserName");
        PasswordField password = new PasswordField();
        password.setPromptText("PassWord");

        grip.add(new Label("UserName: "),0,0);
        grip.add(username,1,0);
        grip.add(new Label("PassWord: "),0,1);
        grip.add(password,1,1);

        Node LoginButton = dialog.getDialogPane().lookupButton(loginButtonType);
        LoginButton.setDisable(true);

        username.textProperty().addListener((observableValue, s, t1) -> {
            LoginButton.setDisable(username.getText().trim().isEmpty() || password.getText().trim().isEmpty());
        });
        password.textProperty().addListener((observableValue, s, t1) -> {
            LoginButton.setDisable(username.getText().trim().isEmpty() || password.getText().trim().isEmpty());
        });

        dialog.getDialogPane().setContent(grip);

        dialog.setResultConverter(dialogButton -> {
            if(dialogButton == loginButtonType){
                return new Pair<>(username.getText(),password.getText());
            }
            return null;
        });

        Optional<Pair<String, String>> result = dialog.showAndWait();
        result.ifPresent(usernamepassword -> {
            System.out.println("UserName: " + usernamepassword.getKey()+"Password: " + usernamepassword.getValue());
        });
    }
}
