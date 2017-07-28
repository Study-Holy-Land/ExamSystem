package com.thoughtworks.twars.bean;

public class HomeworkPostHistory {
    private int id;
    private int status;
    private String userAnswerRepo;
    private int homeworkSubmitId;
    private String version;
    private String branch;
    private int startTime;
    private int commitTime;
    private String result;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public int getHomeworkSubmitId() {
        return homeworkSubmitId;
    }

    public void setHomeworkSubmitId(int homeworkSubmitId) {
        this.homeworkSubmitId = homeworkSubmitId;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public int getStartTime() {
        return startTime;
    }

    public void setStartTime(int startTime) {
        this.startTime = startTime;
    }

    public int getCommitTime() {
        return commitTime;
    }

    public void setCommitTime(int commitTime) {
        this.commitTime = commitTime;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getUserAnswerRepo() {
        return userAnswerRepo;
    }

    public void setUserAnswerRepo(String userAnswerRepo) {
        this.userAnswerRepo = userAnswerRepo;
    }
}
