package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.PaperOperation;
import org.apache.ibatis.annotations.Insert;


public  interface PaperOperationMapper {
    @Insert(" INSERT INTO paperOperation(operationType,"
            + " operatorId,operatingTime,paperId)"
            + "VALUES (#{operationType},#{operatorId},#{operatingTime}"
            + ",#{paperId});")
    int insertPaperOperation(PaperOperation paperOperation);

}
