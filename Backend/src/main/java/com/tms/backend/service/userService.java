package com.tms.backend.service;

import com.tms.backend.entity.User;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class userService {
    private List<User> users = new ArrayList<>();

    public String register(String username, String password) {
        for (User u : users) {
            if (u.getUsername().equals(username)) {
                return "Username đã tồn tại";
            }
        }
        users.add(new User(username, password));
        return "Đăng ký thành công";
    }

    public String login(String username, String password){
        for(User u : users){
            if (u.username.equals(username)&&u.password.equals(password))
                return "Đăng nhập thành công";
        }
        return "Đăng nhập thất bại";

    }
}
