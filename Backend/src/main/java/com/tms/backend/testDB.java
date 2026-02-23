package com.tms.backend;

import com.tms.backend.DB.DBConnection;
import java.sql.Connection;

public class testDB {

    public static void main(String[] args) {

        try {

            Connection conn = DBConnection.getConnection();

            if (conn != null) {
                System.out.println("Kết nối database thành công!");
            } else {
                System.out.println("Kết nối thất bại");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}

