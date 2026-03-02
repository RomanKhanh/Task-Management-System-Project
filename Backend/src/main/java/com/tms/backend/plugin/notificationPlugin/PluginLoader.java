package com.tms.backend.plugin.notificationPlugin;

import com.tms.backend.entity.Project;
import com.tms.backend.plugin.Event;
import com.tms.backend.plugin.Plugin;
import com.tms.backend.plugin.ProjectPlugin;

import java.util.ArrayList;
import java.util.List;

public class PluginLoader {

    private List<Plugin> plugins = new ArrayList<>();

    public PluginLoader() {
        loadPlugins();
    }

    private void loadPlugins() {
        plugins.add(new NotificationPlugin());
    }

    public void run(Event event) {
        for(Plugin plugin : plugins) {
            plugin.execute(event);
        }
    }
}