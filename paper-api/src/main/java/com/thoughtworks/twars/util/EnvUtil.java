package com.thoughtworks.twars.util;

public class EnvUtil {
    public static String getVariable(String variable) {
        return System.getenv(variable);
    }
}
