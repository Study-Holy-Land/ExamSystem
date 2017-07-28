package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.BasicQuiz;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface BasicQuizMapper {

    @Insert("insert into basicQuiz values(null,#{sectionId},#{scoreSheetId})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    Integer insertBasicQuiz(BasicQuiz basicQuiz);

    @Select("select id from basicQuiz where scoreSheetId = #{scoreSheetId}")
    Integer findByScoreSheetId(Integer scoreSheetId);

    @Select("select sectionId from basicQuiz where scoreSheetId = #{scoreSheetId}")
    List<Integer> findSectionIdsByScoreSheetId(Integer scoreSheetId);

    @Select("select id from basicQuiz where sectionId = #{sectionId} "
            + "and scoreSheetId in (select id from scoreSheet where "
            + "paperId = #{paperId} and examerId = #{userId});")
    Integer getBasicQuizIdById(@Param("paperId") Integer paperId,
                               @Param("sectionId") Integer sectionId,
                               @Param("userId") Integer userId);


}
