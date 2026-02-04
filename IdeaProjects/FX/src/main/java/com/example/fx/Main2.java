package com.example.fx;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class Main2 extends Application {
        Stage window;
        Scene scene1, scene2;
    public static void main(String[] args) {
        launch(args);
    }

    @Override
    public void start(Stage primaryStage) {
        window = primaryStage;
        Label label= new Label("Welcome to team");
        Button button1 = new Button("Go to course");
        button1.setOnAction(even ->{
            window.setScene(scene2);
        });
        VBox layout1 = new VBox();
        layout1.getChildren().addAll(label,button1);
        scene1 = new Scene(layout1,300,200);
        Button button2 = new Button("Go back");
        button2.setOnAction(even -> {
            window.setScene(scene1);
        });
        StackPane layout2 = new StackPane();
        layout2.getChildren().add(button2);
        scene2 = new Scene(layout2,300,200);
        window.setScene(scene1);
        window.show();
    }
}
