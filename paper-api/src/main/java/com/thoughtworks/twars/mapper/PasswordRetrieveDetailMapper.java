package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.PasswordRetrieveDetail;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

public interface PasswordRetrieveDetailMapper {


    @Insert("INSERT INTO passwordRetrieveDetail(email, token, retrieveDate)"
            + "VALUES (#{email}, MD5(RAND()), UNIX_TIMESTAMP());")
    @Options(useGeneratedKeys = true,keyProperty = "id")
    int insertDetail(PasswordRetrieveDetail passwordRetrieveDetail);

    @Select("SELECT * FROM passwordRetrieveDetail WHERE token = #{token};")
    PasswordRetrieveDetail getDetailByToken(String token);

    @Select("SELECT * FROM passwordRetrieveDetail WHERE email = #{email} AND token IS NOT NULL;")
    PasswordRetrieveDetail getDetailByEmail(String email);

    @Insert(" REPLACE INTO passwordRetrieveDetail(email,token,retrieveDate) "
            + "values(#{email},MD5(RAND()),UNIX_TIMESTAMP());")
    @Options(useGeneratedKeys = true,keyProperty = "id")
    int updateDetailByEmail(String email);

    @Update("UPDATE passwordRetrieveDetail SET token = null, "
            + "retrieveDate = NULL WHERE email = #{email};")
    int setNullToken(String email);
}
