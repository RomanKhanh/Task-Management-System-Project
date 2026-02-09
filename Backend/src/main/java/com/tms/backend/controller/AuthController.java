package com.tms.backend.controller;

import com.tms.backend.entity.User;
import com.tms.backend.service.userService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final userService UserService;

    public AuthController(userService UserService) {
        this.UserService = UserService;
    }

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        return userService.register(user.getUsername(), user.gerUserpassword());
    }

    @GetMapping("/login")
    public String login(
            @RequestParam String username,
            @RequestParam String password) {
        return UserService.login(username,password);
    }
}
