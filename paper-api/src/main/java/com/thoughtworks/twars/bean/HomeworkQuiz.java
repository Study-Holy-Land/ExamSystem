package com.thoughtworks.twars.bean;

import java.util.HashMap;
import java.util.Map;

public class HomeworkQuiz {
    private int id;
    private String description;
    private String evaluateScript;
    private String templateRepository;
    private int makerId;
    private int createTime;
    private String homeworkName;
    private String answerPath;
    private int stackId;

    public int getRawId() {
        return rawId;
    }

    public void setRawId(int rawId) {
        this.rawId = rawId;
    }

    private int rawId;



    public String getAnswerPath() {
        return answerPath;
    }

    public void setAnswerPath(String answerPath) {
        this.answerPath = answerPath;
    }

    public int getMakerId() {
        return makerId;
    }

    public void setMakerId(int makerId) {
        this.makerId = makerId;
    }

    public int getCreateTime() {
        return createTime;
    }

    public void setCreateTime(int createTime) {
        this.createTime = createTime;
    }

    public String getHomeworkName() {
        return homeworkName;
    }

    public void setHomeworkName(String homeworkName) {
        this.homeworkName = homeworkName;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEvaluateScript() {
        return evaluateScript;
    }

    public void setEvaluateScript(String evaluateScript) {
        this.evaluateScript = evaluateScript;
    }

    public String getTemplateRepository() {
        return templateRepository;
    }

    public void setTemplateRepository(String templateRepository) {
        this.templateRepository = templateRepository;
    }

    public int getStackId() {
        return stackId;
    }

    public void setStackId(int stack) {
        this.stackId = stack;
    }

    public Map<String, Object> toMap() {
        Map<String, Object> result = new HashMap<>();

        result.put("id", getId());
        result.put("description", getDescription());
        result.put("evaluateScript", getEvaluateScript());
        result.put("templateRepository", getTemplateRepository());
        result.put("makerId", getMakerId());
        result.put("makerDetailUri", "users/" + getMakerId() + "/detail");
        result.put("createTime", getCreateTime());
        result.put("homeworkName", getHomeworkName());
        result.put("answerPath", getAnswerPath());
        result.put("stackId", getStackId());
        result.put("uri", "homeworkQuizzes/" + getId());

        return result;
    }
}
