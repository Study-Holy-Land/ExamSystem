package com.thoughtworks.twars.resource;

import com.thoughtworks.twars.bean.User;
import com.thoughtworks.twars.mapper.UserMapper;
import io.swagger.annotations.Api;

import javax.inject.Inject;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.HashMap;
import java.util.Map;

@Path("/register")
@Api

public class RegisterResource extends Resource {

    @Inject
    private UserMapper userMapper;

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response createUser(User user) {

        userMapper.insertUser(user);
        userMapper.insertUserRole(user.getId(), 0);
        userMapper.insertUserProgram(user.getId(), 1);

        Map<String, Object> result = new HashMap<>();
        Map<String, String> userInfo = new HashMap<>();
        Map<String, String> theUser = new HashMap<>();

        result.put("id", user.getId());
        userInfo.put("uri", "userInfo/" + user.getId());
        theUser.put("uri", "user/" + user.getId());

        result.put("userInfo", userInfo);
        result.put("user", theUser);

        return Response.status(Response.Status.OK).entity(result).build();
    }
}
