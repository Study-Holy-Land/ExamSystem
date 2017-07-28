package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.HomeworkSubmit;
import org.apache.ibatis.annotations.*;

import java.util.List;

public interface HomeworkSubmitMapper {

    @Insert("INSERT INTO homeworkSubmit(scoreSheetId,homeworkQuizId)"
         +  "VALUES (#{scoreSheetId},#{homeworkQuizId});")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertHomeworkSubmit(HomeworkSubmit homeworkSubmit);

    @Select(" SELECT * FROM homeworkSubmit WHERE scoreSheetId = #{scoreSheetId};")
    List<HomeworkSubmit> findByScoreSheetId(int scoreSheetId);

    @Select("SELECT * FROM homeworkSubmit WHERE scoreSheetId = #{scoreSheetId} "
         +  "AND homeworkQuizId = #{homeworkQuizId} limit 1")
    HomeworkSubmit findByScoreSheetIdAndQuizId(
            @Param("scoreSheetId") Integer scoreSheetId,
            @Param("homeworkQuizId") Integer homeworkQuizId);
}
