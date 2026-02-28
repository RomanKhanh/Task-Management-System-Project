package com.tms.backend.plugin.notificationPlugin;

import com.tms.backend.entity.Project;
import com.tms.backend.plugin.ProjectPlugin;

import java.util.ArrayList;
import java.util.List;

public class PluginLoader {

    private static final List<ProjectPlugin> plugins = new ArrayList<>();

    static {
        plugins.add(new com.tms.backend.plugin.notificationPlugin.NotificationPlugin());
        System.out.println("Notification Plugin loaded");
    }

    public static void run(Project project) {

        System.out.println("PluginLoader.runPlugins CALLED");

        for (ProjectPlugin plugin : plugins) {
            System.out.println("Running plugin: " + plugin.getClass().getSimpleName());
            plugin.onStatusChange(project);
        }
    }
}