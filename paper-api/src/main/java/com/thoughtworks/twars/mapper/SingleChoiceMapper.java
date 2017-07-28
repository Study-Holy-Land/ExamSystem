package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.SingleChoice;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

public interface SingleChoiceMapper extends BasicQuizAnswer {
    @Insert("INSERT INTO singleChoice VALUES(NULL,#{description},#{options},#{type},#{answer});")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertSingleChoice(SingleChoice singleChoice);

    @Select("select * from singleChoice where id = #{id}")
    SingleChoice getSingleChoiceById(Integer id);

    @Update(" UPDATE singleChoice SET description = #{description},"
            + "type = #{type},options = #{options},answer = #{answer} "
            + " WHERE id = #{id}")
    Integer updateSingleChoice(SingleChoice singleChoice);

    @Override
    @Select("select answer from singleChoice where id = #{id}")
    String findAnswerById(Integer id);
}
