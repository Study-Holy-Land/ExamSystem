package com.memberClass;

/**
 * Created by qmm on 17-7-18.
 */
public class People {
    private String name = "Lilei";

    public class Student{
        String ID = "20151234";
        public void stuInfo(){
            System.out.println("访问外部类中的name"+name);
            System.out.println("访问内部类中的ＩＤ"+ID);
        }
    }

    public static void main(String[] args){
        People a = new People();


        //定义成员内部类后，必须使用外部类对象来创建内部类对象，即 内部类 对象名 = 外部类对象.new 内部类();
        Student b = a.new Student();

        b.stuInfo();
    }
}
