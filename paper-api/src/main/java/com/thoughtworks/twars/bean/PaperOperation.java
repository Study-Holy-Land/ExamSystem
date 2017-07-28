package com.thoughtworks.twars.bean;

import java.util.HashMap;
import java.util.Map;

public class PaperOperation {
    private int id;
    private String operationType;
    private int operatorId;
    private int operatingTime;
    private int paperId;

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

    public int getPaperId() {
        return paperId;
    }

    public void setPaperId(int paperId) {
        this.paperId = paperId;
    }

    public Map toMap() {
        Map result = new HashMap<>();

        result.put("id", getId());
        result.put("operatorId", getOperatorId());
        result.put("operatingTime", getOperatingTime());
        result.put("paperId", getPaperId());
        result.put("operationType", getOperationType());

        return result;
    }
}
