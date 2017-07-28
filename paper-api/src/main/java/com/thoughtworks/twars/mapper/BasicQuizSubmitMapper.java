package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.BasicQuizSubmit;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

public interface BasicQuizSubmitMapper {

    @Insert("insert into basicQuizSubmit values(null,#{basicQuizId},"
         +  "#{startTime},#{endTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    Integer insertBasicQuizSubmit(BasicQuizSubmit basicQuizSubmit);

    @Select("select * from basicQuizSubmit where basicQuizId = #{basicQuizId};")
    List<BasicQuizSubmit> findByBasicQuizId(Integer basicQuizId);

    @Select("select startTime,endTime,id from basicQuizSubmit where basicQuizId = #{basicQuizId}")
    Map getBaiscQuizSubmitByBasicQuizId(Integer basicQuizId);
}
