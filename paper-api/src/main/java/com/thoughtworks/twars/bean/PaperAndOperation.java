package com.thoughtworks.twars.bean;

import java.util.HashMap;
import java.util.Map;

public class PaperAndOperation {
    private Integer paperId;
    private Integer makerId;
    private String paperName;
    private String description;
    private Integer createTime;
    private Integer programId;
    private Integer operationId;
    private Integer operatorId;
    private String operationType;

    public Integer getPaperId() {
        return paperId;
    }

    public void setPaperId(Integer paperId) {
        this.paperId = paperId;
    }

    public Integer getMakerId() {
        return makerId;
    }

    public void setMakerId(Integer makerId) {
        this.makerId = makerId;
    }

    public String getPaperName() {
        return paperName;
    }

    public void setPaperName(String paperName) {
        this.paperName = paperName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Integer createTime) {
        this.createTime = createTime;
    }

    public Integer getProgramId() {
        return programId;
    }

    public void setProgramId(Integer programId) {
        this.programId = programId;
    }

    public Integer getOperationId() {
        return operationId;
    }

    public void setOperationId(Integer operationId) {
        this.operationId = operationId;
    }

    public Integer getOperatorId() {
        return operatorId;
    }

    public void setOperatorId(Integer operatorId) {
        this.operatorId = operatorId;
    }

    public String getOperationType() {
        return operationType;
    }

    public void setOperationType(String operationType) {
        this.operationType = operationType;
    }

    public Map toMap() {
        Map result = new HashMap<>();

        result.put("uri", "papers/" + getPaperId());
        result.put("makerId", getMakerId());
        result.put("paperName", getPaperName());
        result.put("description", getDescription());
        result.put("createTime", getCreateTime());
        result.put("id", getPaperId());
        result.put("programId", getProgramId());
        result.put("operationId", getOperationId());
        result.put("operatorId", getOperatorId());
        result.put("operationType", getOperationType());

        return result;
    }
}
