package com.tms.backend;

import com.tms.backend.entity.Project;
import com.tms.backend.plugin.notificationPlugin.PluginLoader;
import com.tms.backend.service.projectService;

public class testNotificationPlugin {

    public static void main(String[] args) {

        projectService.updateStatus(1, "TODO");
    }
}