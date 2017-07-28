package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.SectionQuiz;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import scala.Int;

import java.util.List;

public interface SectionQuizMapper {

    @Select("SELECT * FROM sectionQuiz WHERE sectionId = #{sectionId};")
    List<SectionQuiz> findBySectionId(Integer sectionId );

    @Insert("INSERT INTO sectionQuiz(sectionId,quizId,quizType)"
            + "VALUES (#{sectionId},#{quizId},#{quizType});")
    @Options(useGeneratedKeys = true,keyProperty = "id")
    int insertSectionQuiz(SectionQuiz sectionQuiz);

    @Select("SELECT id from sectionQuiz WHERE sectionId = #{sectionId} AND quizId = #{quizId};")
    Integer getSectionQuizIdBySectionIdAndQuizId(
            @Param("quizId") Integer quizId,
            @Param("sectionId") Integer sectionId);

    @Select("select count(*) from sectionQuiz where sectionId = #{sectionId}")
    Integer getQuizCountByPaperIdAndSectionId(Integer sectionId);
}
