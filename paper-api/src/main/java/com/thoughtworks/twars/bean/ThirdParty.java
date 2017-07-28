package com.thoughtworks.twars.bean;

import java.util.HashMap;
import java.util.Map;

public class ThirdParty {
    String thirdPartyUserId;
    Integer userId;
    String type;

    public String getThirdPartyUserId() {
        return thirdPartyUserId;
    }

    public void setThirdPartyUserId(String thirdPartyUserId) {
        this.thirdPartyUserId = thirdPartyUserId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Map toMap() {
        Map map  = new HashMap();
        map.put("thirdPartyUserId",thirdPartyUserId);
        map.put("userId",userId);
        map.put("type",type);

        return map;
    }


}
