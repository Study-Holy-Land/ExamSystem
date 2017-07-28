package com.thoughtworks.twars.bean;

public class ItemPost {
    private int id;
    private int quizItemId;
    private int blankQuizSubmitId;
    private String userAnswer;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getQuizItemId() {
        return quizItemId;
    }

    public void setQuizItemId(int quizItemId) {
        this.quizItemId = quizItemId;
    }

    public int getBlankQuizSubmitsId() {
        return blankQuizSubmitId;
    }

    public void setBlankQuizSubmitsId(int blankQuizSubmitsId) {
        this.blankQuizSubmitId = blankQuizSubmitsId;
    }

    public String getAnswer() {
        return userAnswer;
    }

    public void setAnswer(String answer) {
        this.userAnswer = answer;
    }
}
