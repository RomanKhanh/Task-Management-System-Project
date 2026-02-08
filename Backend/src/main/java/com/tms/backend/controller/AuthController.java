package com.tms.backend.controller;

import com.tms.backend.service.userService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final userService UserService;

    public AuthController(userService UserService) {
        this.UserService = UserService;
    }

    @PostMapping("/register") // Phải là Post để khớp với JavaFX
    public String register(@RequestBody com.tms.backend.entity.User user) {
        // Dùng @RequestBody để nhận cục JSON từ JavaFX gửi sang
        return userService.register(user.getUsername(), user.gerUserpassword());
    }

    @GetMapping("/login")
    public String login(
            @RequestParam String username,
            @RequestParam String password) {
        return UserService.login(username,password);
    }
}
