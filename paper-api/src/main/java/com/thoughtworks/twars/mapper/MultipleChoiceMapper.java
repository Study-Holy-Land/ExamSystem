package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.MultipleChoice;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

public interface MultipleChoiceMapper extends BasicQuizAnswer {
    @Insert("INSERT INTO multipleChoice VALUES(NULL,#{description},#{options},#{type},#{answer});")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertMultipleChoice(MultipleChoice multipleChoice);

    @Select("SELECT * FROM multipleChoice WHERE id = #{id};")
    MultipleChoice getMultipleChoiceById(Integer id);

    @Update(" UPDATE multipleChoice SET description = #{description},"
            + "type = #{type},options = #{options},answer = #{answer}"
            + "WHERE id = #{id}")
    Integer updateMultipleChoice(MultipleChoice multipleChoice);

    @Override
    @Select("select answer from multipleChoice where id = #{id}")
    String findAnswerById(Integer id);

}
