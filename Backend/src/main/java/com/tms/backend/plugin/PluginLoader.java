package com.tms.backend.plugin;

import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class PluginLoader {

    private final List<Plugin> plugins;

    // Spring sẽ tự inject TẤT CẢ Plugin vào đây
    public PluginLoader(List<Plugin> plugins) {
        this.plugins = plugins;
    }

    public void run(String pluginName) {
        for (Plugin plugin : plugins) {
            if (plugin.name().equalsIgnoreCase(pluginName)) {
                plugin.execute();
                return;
            }
        }

        System.out.println("Khong tim thay plugin: " + pluginName);
    }

    // Debug: xem Spring load được plugin nào
    public void listPlugins() {
        System.out.println("===DANH SACH PLUGIN===");
        plugins.forEach(p -> System.out.println("- " + p.name()));
    }
}