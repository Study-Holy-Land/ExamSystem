package com.thoughtworks.twars.bean;

import java.util.HashMap;
import java.util.Map;

public class Program {
    private Integer id;
    private String name;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Map toMap() {
        Map result = new HashMap<>();
        result.put("id", id);
        result.put("name", name);
        return result;
    }

}

