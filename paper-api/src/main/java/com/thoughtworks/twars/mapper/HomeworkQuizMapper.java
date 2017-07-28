package com.thoughtworks.twars.mapper;


import com.thoughtworks.twars.bean.HomeworkQuiz;
import org.apache.ibatis.annotations.*;

import java.util.List;

public interface HomeworkQuizMapper {

    @Select("SELECT a.* FROM homeworkQuiz a, sectionQuiz b "
            + "WHERE a.id = b.quizId AND b.sectionId = #{sectionId};")
    List<HomeworkQuiz> findBySectionId(Integer id);

    @Select("SELECT * FROM homeworkQuiz WHERE id = #{id};")
    HomeworkQuiz findById(Integer id);

    @Insert("INSERT INTO homeworkQuiz(description, evaluateScript,"
            + "templateRepository,makerId,createTime,homeworkName,"
            + "answerPath,stackId,rawId) VALUES(#{description},"
            + "#{evaluateScript},"
            + "#{templateRepository},#{makerId},#{createTime},"
            + "#{homeworkName},#{answerPath},#{stackId},#{rawId});")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertHomeworkQuiz(HomeworkQuiz homeworkQuiz);

    @Update("update homeworkQuiz set rawId = #{id} where id = #{id};")
    int updateRawId(Integer id);

    @Select({"<script>",
            " SELECT s.* FROM homeworkQuiz s WHERE id IN",
            "(SELECT MAX(id) FROM (SELECT * FROM homeworkQuiz h WHERE h.rawId NOT IN",
            "(SELECT homeworkQuizId FROM homeworkQuizOperation)) as temp",
            "GROUP BY rawId)",
            "<if test = 'homeworkName != null'>",
            "       AND s.homeworkName LIKE concat('%',#{homeworkName},'%')",
            "</if>",
            "<if test ='stackId != null'>",
            "       AND s.stackId = #{stackId}",
            "</if>",
            "LIMIT #{newPage},#{pageSize};",
            "</script>",
            })
    List<HomeworkQuiz> findHomeworkQuizzes(
            @Param("homeworkName") String homeworkName,
            @Param("stackId") Integer stackId,
            @Param("newPage") Integer newPage,
            @Param("pageSize") Integer pageSize);
}
