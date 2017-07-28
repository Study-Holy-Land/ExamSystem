package com.thoughtworks.twars.bean;

public class HomeworkSubmit {
    private int id;
    private int scoreSheetId;
    private int homeworkQuizId;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getScoreSheetId() {
        return scoreSheetId;
    }

    public void setScoreSheetId(int scoreSheetId) {
        this.scoreSheetId = scoreSheetId;
    }

    public int getHomeworkQuizId() {
        return homeworkQuizId;
    }

    public void setHomeworkQuizId(int homeworkQuizId) {
        this.homeworkQuizId = homeworkQuizId;
    }
}
