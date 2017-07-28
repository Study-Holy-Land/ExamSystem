package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.HomeworkQuizOperation;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;

public interface HomeworkQuizOperationMapper {
    @Insert("INSERT INTO homeworkQuizOperation (operationType, operatorId,"
            + "operatingTime,homeworkQuizId)"
            + "VALUES (#{operationType}, #{operatorId},UNIX_TIMESTAMP(),#{homeworkQuizId});")
    @Options(useGeneratedKeys = true,keyProperty = "id")
    int insertHomeworkQuizOperation(HomeworkQuizOperation homeworkQuizOperation);
}
