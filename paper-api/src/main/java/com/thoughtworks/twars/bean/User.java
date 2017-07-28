package com.thoughtworks.twars.bean;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class User {
    private int id;
    private String email;
    private String mobilePhone;
    private String password;
    private String userName;
    private List<Integer> roles;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobilePhone() {
        return mobilePhone;
    }

    public void setMobilePhone(String mobilePhone) {
        this.mobilePhone = mobilePhone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<Integer> getRoles() {
        return roles;
    }

    public void setRoles(List<Integer> roles) {
        this.roles = roles;
    }

    public Map toMap() {
        Map result = new HashMap<>();
        result.put("id",getId());
        result.put("email", getEmail());
        result.put("mobilePhone", getMobilePhone());
        result.put("userName", getUserName());
        result.put("role", roles);

        return result;
    }


}
