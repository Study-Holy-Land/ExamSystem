package com.thoughtworks.twars.bean;

public class BlankQuiz {
    private int id;
    private int hardCount;
    private int normalCount;
    private int easyCount;
    private int exampleCount;
    private String type;

    public void setExampleCount(int exampleCount) {
        this.exampleCount = exampleCount;
    }

    public int getExampleCount() {
        return exampleCount;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setHardCount(int hardCount) {
        this.hardCount = hardCount;
    }

    public void setNormalCount(int normalCount) {
        this.normalCount = normalCount;
    }

    public void setEasyCount(int easyCount) {
        this.easyCount = easyCount;
    }

    public int getId() {
        return id;
    }

    public int getHardCount() {
        return hardCount;
    }

    public int getNormalCount() {
        return normalCount;
    }

    public int getEasyCount() {
        return easyCount;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
