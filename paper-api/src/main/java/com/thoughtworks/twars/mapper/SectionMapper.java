package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.Section;
import org.apache.ibatis.annotations.*;

import java.util.List;

public interface SectionMapper {

    @Select("SELECT * FROM section WHERE paperId = #{paperId};")
    @Results(value = {
            @Result(id = true,property = "id", column = "id"),
            @Result( property = "paperId", column = "paperId"),
            @Result(property = "description", column = "description")
             })
    List<Section> getSectionsByPaperId(Integer paperId);

    @Insert("INSERT INTO section(paperId,description,type) "
         +  "VALUES(#{paperId},#{description},#{type});")
    @Options( useGeneratedKeys = true, keyProperty = "id")
    int insertSection(Section section);

    @Select("select id from section where paperId = #{paperId} and type = 'basicQuizzes';")
    List<Integer> findSectionIdsByPaperId(Integer paperId);

}
