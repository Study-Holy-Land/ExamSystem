package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.BlankQuizSubmit;
import org.apache.ibatis.annotations.*;

import java.util.List;

public interface BlankQuizSubmitMapper {

    @Insert("INSERT INTO blankQuizSubmit(scoreSheetId,blankQuizId,startTime,endTime)"
          + "VALUES (#{scoreSheetId}, #{blankQuizId}, #{startTime}, #{endTime});")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertBlankQuizSubmit(BlankQuizSubmit blankQuizSubmit);

    @Select("SELECT * FROM blankQuizSubmit WHERE scoreSheetId = #{scoreSheetId};")
    List<BlankQuizSubmit> findByScoreSheetId(Integer scoreSheetId);
}
