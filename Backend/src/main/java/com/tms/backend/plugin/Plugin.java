    package com.tms.backend.plugin;

    import com.tms.backend.entity.Project;
    import com.tms.backend.plugin.Event;

    public interface Plugin {
        void onStatusChange(Project project);

        void execute(Event event);
    }
