package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.LoginDetail;
import org.apache.ibatis.annotations.*;

import java.util.List;

public interface LoginDetailMapper {

    @Select(" SELECT * FROM loginDetail WHERE userId = #{userId};")
    List<LoginDetail> getLoginDetailByUserId(Integer userId);

    @Insert("INSERT INTO loginDetail(userId,token,loginDate,logoutDate,flag)"
         +  "VALUES (#{userId}, MD5(RAND()), UNIX_TIMESTAMP(),NULL ,1);")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertLoginDetail(Integer userId);

    @Update("UPDATE loginDetail SET flag = 0,"
         +  "logoutDate =UNIX_TIMESTAMP()  WHERE token = #{token};")
    int updateLoginDetail(String token);

    @Update(" UPDATE loginDetail SET flag = 0, "
         +  "logoutDate =UNIX_TIMESTAMP()  WHERE id = #{id};")
    int updateLoginDetailById(Integer id);

    @Select("SELECT * FROM loginDetail WHERE token = #{token};")
    LoginDetail getLoginDetailByToken(String token);

}
