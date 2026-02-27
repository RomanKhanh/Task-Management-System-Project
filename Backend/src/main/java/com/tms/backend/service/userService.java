package com.tms.backend.service;

import com.tms.backend.dao.userDAO;
import com.tms.backend.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;


//import java.util.ArrayList;
//import java.util.List;
//
//import java.sql.Connection;
//import java.sql.PreparedStatement;
//import java.sql.ResultSet;
//import java.sql.SQLException;
//
//import com.tms.backend.DB.DBConnection;

@Service
public class userService {
    private final userDAO userdao;


    public userService(userDAO userdao) {
        this.userdao = userdao;
    }

    public String register(String username, String password) {
        boolean success = userdao.insert(username, password);
        if (success) {
            return "Đăng ký thành công";
        } else return "Đăng ký thất bại";
    }

    public boolean login(String username, String password) {
        User user = userdao.finduser(username, password);
        if(user!=null){
            return true;
        }
        else return false;
    }
    public List<User> getAllUsers(){
        List<User> list = userdao.getAllUsers();
        return list;
    }
    public boolean changePassword(String username, String oldPassword, String newPassword) {
        return userdao.changePassword(username, oldPassword, newPassword);
    }
}
//public class userService {
//    private static List<User> users = new ArrayList<>();
//
//    public static String register(String username, String password) {
//        String sql = "INSERT INTO Users(username, password, role) VALUES (?, ?, ?)";
//
//        try (Connection conn = DBConnection.getConnection();
//             PreparedStatement ps = conn.prepareStatement(sql)) {
//
//            ps.setString(1, username);
//            ps.setString(2, password);
//            ps.setString(3, "Member");
//
//            ps.executeUpdate();
//            return "Đăng ký thành công";
//
//        } catch (SQLException e) {
//            e.printStackTrace();   // 👈 IN RA LỖI THẬT
//            return "Lỗi SQL: " + e.getMessage();
//        }  catch (Exception e) {
//            e.printStackTrace();   // 👈 IN RA LỖI THẬT
//            return "Lỗi hệ thống: " + e.getMessage();
//        }
//    }
//
//
//    public static boolean login(String username, String password) {
//        String sql = "SELECT * FROM Users WHERE username = ? AND password = ?";
//
//        try (Connection conn = DBConnection.getConnection();
//             PreparedStatement ps = conn.prepareStatement(sql)) {
//
//            ps.setString(1, username);
//            ps.setString(2, password);
//
//            ResultSet rs = ps.executeQuery();
//            return rs.next(); // có bản ghi là login đúng
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            return false;
//        }
//    }
//
//}
