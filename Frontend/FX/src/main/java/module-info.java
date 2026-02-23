module com.example.fx {
    requires javafx.controls;
    requires javafx.fxml;
    requires java.net.http;
    requires org.json;
    requires java.sql;


//    opens com.example.fx to javafx.fxml;
//    exports com.example.fx;

    exports Main8;
    opens Main8 to javafx.fxml;
}