package com.thoughtworks.twars.bean;


public class BasicQuiz {
    private int id;
    private int scoreSheetId;
    private int sectionId;

    public int getSectionId() {
        return sectionId;
    }

    public void setSectionId(int sectionId) {
        this.sectionId = sectionId;
    }

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
}
