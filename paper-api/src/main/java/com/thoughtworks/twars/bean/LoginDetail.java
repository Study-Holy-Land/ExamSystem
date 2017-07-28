package com.thoughtworks.twars.bean;

public class LoginDetail {
    private int id;
    private int userId;
    private String token;
    private int loginDate;
    private int logoutDate;
    private int flag;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public int getLoginDate() {
        return loginDate;
    }

    public void setLoginDate(int loginDate) {
        this.loginDate = loginDate;
    }

    public int getLogoutDate() {
        return logoutDate;
    }

    public void setLogoutDate(int logoutDate) {
        this.logoutDate = logoutDate;
    }

    public int getFlag() {
        return flag;
    }

    public void setFlag(int flag) {
        this.flag = flag;
    }
}
