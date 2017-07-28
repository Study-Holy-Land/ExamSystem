package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.ItemPost;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface ItemPostMapper {

    @Insert("INSERT INTO itemPost(blankQuizSubmitId,"
            + "quizItemId,userAnswer) VALUES (#{blankQuizSubmitId}, #{quizItemId}, #{userAnswer});")
    @Options(useGeneratedKeys = true,keyProperty = "id")
    int insertItemPost(ItemPost itemPost);

    @Select("  SELECT * FROM itemPost WHERE blankQuizSubmitId = #{blankQuizSubmitId};")
    List<ItemPost> findByBlankQuizSubmit(Integer blankQuizSubmitId);
}
