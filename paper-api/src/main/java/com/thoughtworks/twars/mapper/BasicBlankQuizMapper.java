package com.thoughtworks.twars.mapper;


import com.thoughtworks.twars.bean.BasicBlankQuiz;
import org.apache.ibatis.annotations.*;


public interface BasicBlankQuizMapper extends BasicQuizAnswer {

    @Insert("INSERT INTO basicBlankQuiz "
            + "VALUES(NULL,#{description},#{type},#{answer});")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertBasicBlankQuiz(BasicBlankQuiz basicBlankQuiz);

    @Select("SELECT * FROM basicBlankQuiz WHERE id =#{id};")
    BasicBlankQuiz getBasicBlankQuizById(Integer id);

    @Update("UPDATE basicBlankQuiz SET description = "
            + "#{description},type = #{type},answer = #{answer} WHERE id = #{id};")
    Integer updateBasicBlankQuiz(BasicBlankQuiz basicBlankQuiz);

    @Override
    @Select("select answer from basicBlankQuiz where id =#{id}")
    String findAnswerById(Integer id);
}
