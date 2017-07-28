package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.PaperAndOperation;
import org.apache.ibatis.annotations.*;

import java.util.List;

public interface PaperAndOperationMapper {

    @Select({"<script>",
             "SELECT P.id paperId,makerId,paperName,description,"
             + "createTime,programId,O.id operationId," ,
             "operatorId,operationType" ,
             "FROM paper P LEFT JOIN paperOperation O ON P.id = O.paperId" ,
             "WHERE O.id =" ,
             "(SELECT" ,
             "MAX(id)" ,
             "FROM paperOperation" ,
             "WHERE paperId=O.paperId" ,
             ") AND P.programId = #{programId} AND O.operationType = 'DISTRIBUTION';",
            "</script>"
            })
    List<PaperAndOperation> findPapersByProgramId(Integer programId);
}
