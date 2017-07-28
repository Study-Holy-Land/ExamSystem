package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.Stack;
import org.apache.ibatis.annotations.*;

import java.util.List;

public interface StackMapper {

    @Select("SELECT * FROM stack ORDER BY stackId;")
    List<Stack> getAllStack();

    @Select(" SELECT * FROM stack WHERE stackId = #{stackId};")
    Stack getStackById(Integer stackId);

    @Select(" SELECT * FROM stack WHERE title = #{title};")
    Stack getStackByTitle(String title);

    @Insert("INSERT INTO stack(title,description,definition)"
         +  "VALUES (#{title}, #{description}, #{definition});")
    @Options(useGeneratedKeys = true, keyProperty = "stackId")
    int insertStack(Stack stack);
}
