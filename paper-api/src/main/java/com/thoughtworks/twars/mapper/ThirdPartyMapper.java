package com.thoughtworks.twars.mapper;


import com.thoughtworks.twars.bean.ThirdParty;
import org.apache.ibatis.annotations.*;

public interface ThirdPartyMapper {

    @Insert("INSERT INTO thirdParty(thirdPartyUserId, userId, type) "
         +  "VALUES (#{thirdPartyUserId}, #{userId}, #{type});")
    int insertThirdPartyUser(ThirdParty thirdParty);

    @Select("SELECT * FROM thirdParty WHERE thirdPartyUserId = "
         +  "#{thirdPartyUserId} AND type = #{type} LIMIT 1;")
    ThirdParty getByThirdPartyUserIdAndType(ThirdParty thirdParty);
}
