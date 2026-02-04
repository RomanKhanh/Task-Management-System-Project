package com.example.fx;

public class Main6 {
    public static void main(String[] args) {
        Mynumb example = new Mynumb();
        example.numberProperty().addListener((observableValue, number, t1) -> {
            System.out.println(observableValue);
            System.out.println(number);
            System.out.println(t1);
        });
        example.setNumber(10);

    }
}
