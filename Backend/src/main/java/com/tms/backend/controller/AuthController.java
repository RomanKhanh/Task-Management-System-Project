package com.tms.backend.controller;
import java.util.List;
import java.util.Map;

import com.tms.backend.entity.Project;
import com.tms.backend.entity.User;
import com.tms.backend.service.userService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.sql.SQLException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final userService UserService;
    
    public AuthController(userService UserService) {
        this.UserService = UserService;
    }

    @PostMapping("/register")
    public String register(@RequestParam String username,
                           @RequestParam String password) {
        return UserService.register(username, password);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> data) {
        String username = data.get("username");
        String password = data.get("password");

        boolean ok = UserService.login(username, password);

        if (ok) {
            return ResponseEntity.ok("Đăng nhập thành công");
        } else {
            return ResponseEntity.status(401).body("Sai tài khoản hoặc mật khẩu");
        }
    }

    @GetMapping("/all")
    public List<User> getAllUsers(){return UserService.getAllUsers();}
}


