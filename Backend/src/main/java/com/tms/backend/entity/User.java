package com.tms.backend.entity;

public class User {
    public String username;
    public String password;
    public String role;
    public User(String username, String password, String role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }
    public String getUsername(){return username;}
    public String gerUserpassword(){return password;}
    public String getUserRole(){
        return role;
    }
}
