package com.thoughtworks.twars.resource;

import com.thoughtworks.twars.bean.LoginDetail;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class LogoutResourceTest extends TestBase {
    String basePath = "/logout";

    @Test
    public void should_update_user_detail_when_logout() throws Exception {

        LoginDetail loginDetail = new LoginDetail();
        loginDetail.setFlag(1);
        loginDetail.setId(2);

        when(loginDetailMapper.getLoginDetailByUserId(1)).thenReturn(Arrays.asList(loginDetail));
        when(loginDetailMapper.updateLoginDetailById(2)).thenReturn(1);

        Map map = new HashMap<>();
        map.put("userId", 1);

        Response response = target(basePath).request().post(
                Entity.entity(map, MediaType.APPLICATION_JSON_TYPE));
        assertThat(response.getStatus(), is(201));
    }

    @Test
    public void should_return_401_when_not_found_token() {
        LoginDetail loginDetail = new LoginDetail();

        when(loginDetailMapper.getLoginDetailByUserId(1)).thenReturn(Arrays.asList(loginDetail));
        when(loginDetailMapper.updateLoginDetailById(2)).thenReturn(1);

        Map map = new HashMap<>();
        map.put("userId", 1);

        Response response = target(basePath).request().post(
                Entity.entity(map, MediaType.APPLICATION_JSON_TYPE));
        assertThat(response.getStatus(), is(401));
    }
}