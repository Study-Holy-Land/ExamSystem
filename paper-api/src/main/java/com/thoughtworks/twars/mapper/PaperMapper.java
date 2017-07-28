package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.Paper;
import com.thoughtworks.twars.bean.Section;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;

public interface PaperMapper {

    @Select("SELECT * FROM paper;")
    List<Paper> findAll();

    @Select("SELECT * FROM paper WHERE id = #{id}")
    Paper getPaperById(Integer id);

    @Select({"<script>",
            "SELECT * FROM paper WHERE id IN ",
            "((SELECT paperId FROM paperOperation ",
            "WHERE id IN (SELECT  MAX(id) FROM paperOperation  GROUP BY paperId)",
            "AND operationType = 'DISTRIBUTION'))",
            "LIMIT #{newPage},#{pageSize};",
            "</script>"
            })
    List<Paper> getAllPapers(@Param("newPage") Integer newPage,
                             @Param("pageSize") Integer pageSize);

    @Select("SELECT * FROM paper WHERE id=#{id}")
    @Results(value = {
            @Result(id = true, property = "id", column = "id"),
            @Result(property = "sections", column = "id", javaType = List.class,
                    many = @Many(select = "selectSectionFromPaper"))
            })
    Paper getOnePaper(Integer id);

    @Select("SELECT * FROM section WHERE paperId=#{paperId};")
    @Results(value = {
            @Result(id = true, property = "id", column = "id"),
            @Result(property = "quizzes", column = "id", javaType = List.class,
                    many = @Many(select = "selectQuizFromSectionQuiz"))
            })
    Section selectSectionFromPaper(Integer id);

    @Select("SELECT quizId,quizType FROM sectionQuiz WHERE sectionId=#{sectionId};")
    @Results(value = {
            @Result(property = "quizId", column = "quizId"),
            @Result(property = "quizType", column = "quizType")
            })
    List<Map> selectQuizFromSectionQuiz(Integer id);


    @Insert("INSERT INTO paper(makerId, paperName,programId,description,createTime)"
            + "VALUES (#{makerId}, #{paperName},#{programId},"
            + "#{description},#{createTime});")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertPaper(Paper paper);


    @Select("SELECT scoreSheet.paperId, COUNT(scoreSheet.examerId) AS "
           + "userCount FROM scoreSheet WHERE scoreSheet.paperId = #{paperId} "
           + "GROUP BY scoreSheet.paperId;")
    Map<String, Integer> getUserCountByPaperId(Integer paperId);

}
