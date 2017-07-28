package com.thoughtworks.twars.resource;

import com.google.gson.Gson;
import com.thoughtworks.twars.bean.ThirdParty;
import org.hamcrest.MatcherAssert;
import org.junit.Test;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class ThirdPartyResourceTest extends TestBase {
    String basePath = "/auth/thirdParty";

    ThirdParty thirdParty0 = mock(ThirdParty.class);
    ThirdParty thirdParty = mock(ThirdParty.class);

    @Test
    public void should_create_user_when_register_with_github_user() throws Exception {
        ThirdParty thirdParty = new ThirdParty();

        when(thirdPartyMapper.insertThirdPartyUser(thirdParty)).thenReturn(1);
        thirdParty.setThirdPartyUserId("2");
        thirdParty.setUserId(4);

        Entity entity = Entity.entity(thirdParty, MediaType.APPLICATION_JSON);
        Response response = target(basePath + "/github").request().post(entity);
        Map result = response.readEntity(Map.class);
        assertThat(response.getStatus(), is(201));
        assertThat(result.get("userId"), is(4));
    }

    @Test
    public void should_not_return_third_party_user_result() throws Exception {
        Response response = target(basePath + "/github?thirdPartyUserId=1").request().get();
        MatcherAssert.assertThat(response.getStatus(), is(404));
    }

    @Test
    public void should_not_return_third_party_user_uri() throws Exception {
        Map data =  new Gson().fromJson("{\n"
               + "  \"schoolCity\": \"111\",\n"
               + "  \"gender\": \"F\",\n"
               + "  \"degree\": \"111\",\n"
               + "  \"userName\": \"章三\",\n"
               + "  \"schoolProvince\": \"111\",\n"
               + "  \"mobilePhone\": \"18798037893\",\n"
               + "  \"major\": \"111\",\n"
               + "  \"school\": \"111\",\n"
               + "  \"entranceYear\": \"111\",\n"
               + "  \"name\": \"11\",\n"
               + "  \"email\": \"test@163.com\",\n"
               + "  \"password\":\"12345678\"\n"
               + "}",Map.class);
        data.put("thirdPartyUserId","100");
        data.put("programId",2);


        Entity entity = Entity.entity(data,MediaType.APPLICATION_JSON);
        Response response = target(basePath + "/weChat").request().post(entity);

        MatcherAssert.assertThat(response.getStatus(), is(201));
    }

    @Test
    public void should_return_third_party_user_by_third_party_user_id() throws Exception {

        Map map  = new HashMap();
        map.put("thirdPartyUserId","1");
        map.put("userId",1);
        map.put("type","weChat");

        when(thirdParty.getThirdPartyUserId()).thenReturn("1");
        when(thirdParty.getType()).thenReturn("weChat");

        when(thirdPartyMapper.getByThirdPartyUserIdAndType(thirdParty)).thenReturn(thirdParty0);
        when(thirdParty0.toMap()).thenReturn(map);

        Response response = target(basePath + "/weChat")
                .queryParam("thirdPartyUserId","1").request().get();

        MatcherAssert.assertThat(response.getStatus(), is(404));
    }
}
