package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.HomeworkPostHistory;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;

public interface HomeworkPostHistoryMapper {

    @Insert("INSERT INTO homeworkPostHistory(homeworkSubmitId,"
        + "userAnswerRepo,branch,version,status,commitTime,startTime,result)"
        + "VALUES (#{homeworkSubmitId},#{userAnswerRepo},#{branch},"
        + "#{version},#{status},#{commitTime},#{startTime},#{result});")
    @Options(useGeneratedKeys = true,keyProperty = "id")
    int insertHomeworkPostHistory(HomeworkPostHistory homeworkPostHistory);

    @Select("SELECT * FROM homeworkPostHistory WHERE homeworkSubmitId = #{homeworkSubmitId}")
    @Results(value = {
            @Result(id = true, property = "id", column = "id"),
            @Result(property = "userAnswerRepo", column = "userAnswerRepo"),
            @Result(property = "homeworkSubmitId", column = "homeworkSubmitId"),
            @Result(property = "version", column = "version"),
            @Result(property = "branch", column = "branch"),
            @Result(property = "startTime", column = "startTime"),
            @Result(property = "result", column = "result"),
            })
    List<HomeworkPostHistory> findByHomeworkSubmitId(Integer homeworkSubmitId);


    @Select({"<script>",
            "select examerId, homeworkQuizId,H.*",
            "from homeworkPostHistory H,",
            "(select hs.homeworkQuizId,s.examerId ,hs.id from homeworkSubmit hs," ,
           "(select * from scoreSheet where examerId = #{examerId} and ",
           "paperId = #{paperId}) s where hs.scoreSheetId = s.id) O",
           "where O.id = H.homeworkSubmitId;",
            "</script>"
            })
    List<Map> getHistoryByExamerIdAndPaperId(
            @Param("examerId") Integer examerId,
            @Param("paperId") Integer paperId
    );

}
