package com.thoughtworks.twars.bean;


import java.util.HashMap;
import java.util.Map;

public class Stack {
    private int stackId;
    private String title;
    private String description;
    private String definition;

    public int getStackId() {
        return stackId;
    }

    public void setStackId(int stackId) {
        this.stackId = stackId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDefinition() {
        return definition;
    }

    public void setDefinition(String definition) {
        this.definition = definition;
    }

    public Map<String, Object> toMap() {
        Map<String, Object> result = new HashMap<>();
        result.put("stackId", stackId);
        result.put("title", title);
        result.put("description", description);
        result.put("definition", definition);
        return result;
    }
}
