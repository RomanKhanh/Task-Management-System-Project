package com.tms.backend.plugin;

import java.io.File;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.ArrayList;
import java.util.List;

public class PluginLoader {

    public static List<Plugin> loadPlugins(String path) {
        List<Plugin> plugins = new ArrayList<>();
        File dir = new File(path);

        if (!dir.exists()) {
            System.out.println("Plugin folder not found");
            return plugins;
        }

        File[] jars = dir.listFiles(f -> f.getName().endsWith(".jar"));
        if (jars == null) return plugins;

        for (File jar : jars) {
            try {
                URLClassLoader loader = new URLClassLoader(
                        new URL[]{jar.toURI().toURL()},
                        Plugin.class.getClassLoader()
                );

                Class<?> clazz = loader.loadClass("plugin.MainPlugin");
                Plugin plugin = (Plugin) clazz.getDeclaredConstructor().newInstance();

                plugins.add(plugin);
                System.out.println("Loaded: " + plugin.getName());

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return plugins;
    }
}