package com.tms.backend.plugin;

import org.springframework.stereotype.Component;

@Component
public class TestPlugin implements Plugin {

    @Override
    public String name() {
        return "test";
    }

    @Override
    public void execute() {
        System.out.println("TEST PLUGIN DANG HOAT DONG");
    }
}