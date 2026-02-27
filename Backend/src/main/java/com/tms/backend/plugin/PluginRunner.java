package com.tms.backend.plugin;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class PluginRunner implements CommandLineRunner {

    private final PluginLoader pluginLoader;

    public PluginRunner(PluginLoader pluginLoader) {
        this.pluginLoader = pluginLoader;
    }

    @Override
    public void run(String... args) {
        System.out.println("=== PLUGINS ===");
        pluginLoader.listPlugins();
        pluginLoader.run("test");
    }
}