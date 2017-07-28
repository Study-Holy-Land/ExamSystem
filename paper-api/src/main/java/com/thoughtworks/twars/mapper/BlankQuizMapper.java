package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.BlankQuiz;
import org.apache.ibatis.annotations.*;

import java.util.List;

public interface BlankQuizMapper {

    @Select("SELECT * FROM blankQuiz;")
    @Results(value = {
            @Result(id = true, property = "id", column = "id"),
            @Result(property = "hardCount", column = "hardCount"),
            @Result(property = "normalCount", column = "normalCount"),
            @Result(property = "easyCount", column = "easyCount"),
            @Result(property = "exampleCount", column = "exampleCount")
            })
    List<BlankQuiz> findAll();

    @Select("SELECT a.* FROM blankQuiz a , sectionQuiz b WHERE a.id = b.quizId "
            + "AND b.sectionId = #{sectionId};")
    List<BlankQuiz> findBySectionId(Integer sectionId);

    @Select("SELECT * FROM blankQuiz WHERE id = #{id};")
    BlankQuiz findOne(Integer id);

    @Insert("  INSERT INTO blankQuiz(hardCount,normalCount,easyCount,exampleCount)"
            + "VALUES (#{hardCount},#{normalCount},#{easyCount},#{exampleCount});")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertBlankQuiz(BlankQuiz blankQuiz);

}
