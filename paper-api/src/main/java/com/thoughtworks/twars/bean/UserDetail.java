package com.thoughtworks.twars.bean;

public class UserDetail {
    private String school;
    private String name;
    private String major;
    private String degree;
    private String gender;
    private int userId;
    private String schoolProvince;
    private String schoolCity;
    private String entranceYear;

    public void setSchool(String school) {
        this.school = school;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setMajor(String major) {
        this.major = major;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getSchool() {
        return school;
    }

    public String getName() {
        return name;
    }

    public String getMajor() {
        return major;
    }

    public String getDegree() {
        return degree;
    }

    public String getGender() {
        return gender;
    }

    public int getUserId() {
        return userId;
    }

    public String getSchoolProvince() {
        return schoolProvince;
    }

    public void setSchoolProvince(String schoolProvince) {
        this.schoolProvince = schoolProvince;
    }

    public String getSchoolCity() {
        return schoolCity;
    }

    public void setSchoolCity(String schoolCity) {
        this.schoolCity = schoolCity;
    }

    public String getEntranceYear() {
        return entranceYear;
    }

    public void setEntranceYear(String entranceYear) {
        this.entranceYear = entranceYear;
    }

}
