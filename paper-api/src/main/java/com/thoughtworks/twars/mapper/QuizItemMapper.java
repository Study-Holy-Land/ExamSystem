package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.QuizItem;
import org.apache.ibatis.annotations.*;

import java.util.List;

public interface QuizItemMapper {

    @Select(" SELECT * FROM quizItem;")
    @Results(value = {
            @Result(id = true, property = "id", column = "id"),
            @Result(property = "initializedBox",column = "initializedBox"),
            @Result(property = "questionZh", column = "questionZh"),
            @Result(property = "descriptionZh", column = "descriptionZh"),
            @Result(property = "chartPath", column = "chartPath")
            })
    List<QuizItem> getAllQuizItems();

    @Insert("INSERT INTO quizItem"
           + "(initializedBox,stepsString,count,questionZh,stepsLength,"
           + "answer,maxUpdateTimes,descriptionZh,chartPath,infoPath)"
           + "VALUES"
           + "(#{initializedBox},#{stepsString},#{count},#{questionZh},#{stepsLength},"
           + "#{answer},#{maxUpdateTimes},#{descriptionZh},#{chartPath},#{infoPath});"
           )
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertQuizItem(QuizItem quizItem);

    @Select("SELECT * FROM quizItem WHERE id = #{id};")
    QuizItem getQuizItemById(Integer id);

    @Select("SELECT * FROM quizItem WHERE count BETWEEN 21 "
          + "AND 25 ORDER BY rand() LIMIT #{easyCount};")
    @Options(flushCache = true, useCache = false)
    @Results(value = {
            @Result(id = true, property = "id", column = "id"),
            @Result(property = "initializedBox",column = "initializedBox"),
            @Result(property = "questionZh", column = "questionZh"),
            @Result(property = "descriptionZh", column = "descriptionZh"),
            @Result(property = "chartPath", column = "chartPath")
            })
    List<QuizItem> getEasyItems(Integer easyCount);

    @Select("SELECT * FROM quizItem WHERE count BETWEEN 26 "
          + "AND 33 ORDER BY rand() LIMIT #{normalCount};")
    @Results(value = {
            @Result(id = true, property = "id", column = "id"),
            @Result(property = "initializedBox",column = "initializedBox"),
            @Result(property = "questionZh", column = "questionZh"),
            @Result(property = "descriptionZh", column = "descriptionZh"),
            @Result(property = "chartPath", column = "chartPath")
            })
    @Options(flushCache = true, useCache = false)
    List<QuizItem> getNormalItems(Integer normalCount);

    @Select("SELECT * FROM quizItem WHERE count BETWEEN 34 "
          + "AND 50 ORDER BY rand() LIMIT #{hardCount};")
    @Results(value = {
            @Result(id = true, property = "id", column = "id"),
            @Result(property = "initializedBox",column = "initializedBox"),
            @Result(property = "questionZh", column = "questionZh"),
            @Result(property = "descriptionZh", column = "descriptionZh"),
            @Result(property = "chartPath", column = "chartPath")
             })
    @Options(flushCache = true, useCache = false)
    List<QuizItem> getHardItems(Integer hardItems);

    @Select("SELECT * FROM quizItem WHERE count  <  15 LIMIT #{exampleCount};")
    @Results(value = {
            @Result(id = true, property = "id", column = "id"),
            @Result(property = "initializedBox",column = "initializedBox"),
            @Result(property = "questionZh", column = "questionZh"),
            @Result(property = "descriptionZh", column = "descriptionZh"),
            @Result(property = "chartPath", column = "chartPath")
            })
    List<QuizItem> getExampleItems(Integer exampleCount);

    @Select("SELECT * FROM quizItem ORDER BY count LIMIT 2;")
    @Results(value = {
            @Result(id = true, property = "id", column = "id"),
            @Result(property = "initializedBox",column = "initializedBox"),
            @Result(property = "questionZh", column = "questionZh"),
            @Result(property = "descriptionZh", column = "descriptionZh"),
            @Result(property = "chartPath", column = "chartPath")
            })
    @Options(flushCache = true, useCache = false)
    List<QuizItem> getExamples();
}
