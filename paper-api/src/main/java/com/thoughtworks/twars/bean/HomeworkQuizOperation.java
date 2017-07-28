package com.thoughtworks.twars.bean;

import java.util.HashMap;
import java.util.Map;

public class HomeworkQuizOperation {
    private int id;
    private String operationType;
    private int operatorId;
    private int operatingTime;
    private int homeworkQuizId;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getOperationType() {
        return operationType;
    }

    public void setOperationType(String operationType) {
        this.operationType = operationType;
    }

    public int getOperatorId() {
        return operatorId;
    }

    public void setOperatorId(int operatorId) {
        this.operatorId = operatorId;
    }

    public int getOperatingTime() {
        return operatingTime;
    }

    public void setOperatingTime(int operatingTime) {
        this.operatingTime = operatingTime;
    }

    public int getHomeworkQuizId() {
        return homeworkQuizId;
    }

    public void setHomeworkQuizId(int homeworkQuizId) {
        this.homeworkQuizId = homeworkQuizId;
    }

    public Map toMap() {
        Map result = new HashMap<>();

        result.put("id", id);
        result.put("operatorId", operatorId);
        result.put("operatingTime", operatingTime);
        result.put("homeworkQuizId", homeworkQuizId);
        result.put("operationType", operationType);

        return result;
    }
}
