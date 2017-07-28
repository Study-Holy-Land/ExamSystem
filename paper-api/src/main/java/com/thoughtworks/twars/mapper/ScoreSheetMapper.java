package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.ScoreSheet;
import org.apache.ibatis.annotations.*;

import java.util.List;

public interface ScoreSheetMapper {

    @Select("SELECT * FROM scoreSheet;")
    List<ScoreSheet> findAll();

    @Select("SELECT * FROM scoreSheet WHERE id = #{id};")
    ScoreSheet findOne(Integer id);

    @Insert("INSERT INTO scoreSheet(examerId,paperId) "
          + "VALUES(#{examerId},#{paperId});")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertScoreSheet(ScoreSheet scoreSheet);

    @Select("SELECT * FROM scoreSheet WHERE examerId ="
          + " #{examerId} AND paperId = #{paperId};")
    ScoreSheet selectScoreSheet(ScoreSheet scoreSheet);

    @Select("SELECT * FROM scoreSheet WHERE examerId = #{userId};")
    ScoreSheet findOneByUserId(Integer userId);

    @Select({"<script>",
             "SELECT * FROM scoreSheet",
             "<where>",
             "<if test='examerId != null'>",
             "examerId = #{examerId}",
             "</if>",
             "AND paperId = #{paperId}",
             "</where>",
            "</script>"
            })
    List<ScoreSheet> findByPaperId(@Param("paperId") Integer id,
                                   @Param("examerId") Integer examerId);

    @Select("SELECT examerId FROM scoreSheet WHERE paperId = #{paperId};")
    List<Integer> findUserIdsByPaperId(Integer paperId);
}
