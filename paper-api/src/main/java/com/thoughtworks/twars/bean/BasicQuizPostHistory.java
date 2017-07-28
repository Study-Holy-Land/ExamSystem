package com.thoughtworks.twars.bean;


public class BasicQuizPostHistory {
    private int id;
    private int basicQuizSubmitId;
    private int basicQuizItemId;
    private String userAnswer;
    private String type;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getBasicQuizItemId() {

        return basicQuizItemId;
    }

    public void setBasicQuizItemId(int basicQuizItemId) {
        this.basicQuizItemId = basicQuizItemId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUserAnswer() {
        return userAnswer;
    }

    public void setUserAnswer(String userAnswer) {
        this.userAnswer = userAnswer;
    }

    public int getBasicQuizSubmitId() {

        return basicQuizSubmitId;
    }

    public void setBasicQuizSubmitId(int basicQuizSubmitId) {
        this.basicQuizSubmitId = basicQuizSubmitId;
    }
}
