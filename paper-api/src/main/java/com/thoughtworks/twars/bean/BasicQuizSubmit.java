
package com.thoughtworks.twars.bean;


public class BasicQuizSubmit {
    private int id;
    private int basicQuizId;
    private int startTime;
    private int endTime;

    public int getStartTime() {
        return startTime;
    }

    public void setStartTime(int startTime) {
        this.startTime = startTime;
    }

    public int getEndTime() {
        return endTime;
    }

    public void setEndTime(int endTime) {
        this.endTime = endTime;
    }

    public int getBasicQuizId() {

        return basicQuizId;
    }

    public void setBasicQuizId(int basicQuizId) {
        this.basicQuizId = basicQuizId;
    }

    public int getId() {

        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}
