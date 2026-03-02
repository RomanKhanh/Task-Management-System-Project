package com.tms.backend.service;

import java.util.ArrayList;
import java.util.List;
public class NotificationService {
    private static List<String> notifications= new ArrayList<>();

    public static void add(String message){
        notifications.add(message);
    }

    public static List<String> getAll(){
        return notifications;
    }
    public static int count(){
        return notifications.size();
    }


}
