package com.example.fx;
import javafx.beans.property.*;
public class Mynumb {
    private DoubleProperty number = new SimpleDoubleProperty();

    public double getNumber() {
        return number.get();
    }

    public DoubleProperty numberProperty() {
        return number;
    }

    public void setNumber(double number) {
        this.number.set(number);
    }
}
