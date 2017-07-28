package com.thoughtworks.twars.mapper;


import com.thoughtworks.twars.bean.BasicQuizPostHistory;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface BasicQuizPostHistoryMapper {

    @Insert("insert into basicQuizPostHistory values(null,"
            + "#{basicQuizSubmitId},#{basicQuizItemId},#{type},#{userAnswer})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    Integer insertBasicQuizHistory(BasicQuizPostHistory basicQuizPostHistory);

    @Select("select * from basicQuizPostHistory where basicQuizSubmitId = #{basicQuizSubmitId};")
    List<BasicQuizPostHistory> findByBasicQuizSubmitId(Integer basicQuizSubmitId);

}
