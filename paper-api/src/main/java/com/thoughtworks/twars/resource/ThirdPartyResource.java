package com.thoughtworks.twars.resource;

import com.thoughtworks.twars.bean.ThirdParty;
import com.thoughtworks.twars.bean.User;
import com.thoughtworks.twars.bean.UserDetail;
import com.thoughtworks.twars.mapper.ThirdPartyMapper;
import com.thoughtworks.twars.mapper.UserMapper;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.HashMap;
import java.util.Map;

@Path("/auth/thirdParty")

public class ThirdPartyResource extends Resource {

    @Inject
    private ThirdPartyMapper thirdPartyMapper;

    @Inject
    private UserMapper userMapper;


    @GET
    @Path("/weChat")
    @Produces(MediaType.APPLICATION_JSON)
    public Response findUserByThirdPartyUserId(
            @QueryParam("thirdPartyUserId") String thirdPartyUserId) {
        ThirdParty thirdParty = new ThirdParty();
        thirdParty.setType("weChat");
        thirdParty.setThirdPartyUserId(thirdPartyUserId);
        ThirdParty result = thirdPartyMapper.getByThirdPartyUserIdAndType(thirdParty);

        if (null == result) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.status(Response.Status.OK).entity(result.toMap()).build();
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/weChat")
    public Response createWeChatUser(Map data) {

        User user = new User();
        user.setUserName((String) data.get("userName"));
        user.setEmail((String) data.get("email"));
        user.setMobilePhone((String) data.get("mobilePhone"));
        user.setPassword((String) data.get("password"));
        userMapper.insertUser(user);
        userMapper.insertUserRole(user.getId(),0);
        if (null == data.get("programId")) {
            userMapper.insertUserProgram(user.getId(),1);
        } else {
            userMapper.insertUserProgram(user.getId(), (Integer) data.get("programId"));
        }

        UserDetail userDetail = new UserDetail();
        userDetail.setUserId(user.getId());
        userDetail.setSchool((String) data.get("school"));
        userDetail.setName((String) data.get("name"));
        userDetail.setMajor((String) data.get("major"));
        userDetail.setDegree((String) data.get("degree"));
        userDetail.setGender((String) data.get("gender"));
        userDetail.setSchoolCity((String) data.get("schoolCity"));
        userDetail.setSchoolProvince((String) data.get("schoolProvince"));
        userDetail.setEntranceYear((String) data.get("entranceYear"));
        userMapper.updateUserDetail(userDetail);

        ThirdParty thirdParty = new ThirdParty();
        thirdParty.setUserId(user.getId());
        thirdParty.setThirdPartyUserId((String) data.get("thirdPartyUserId"));
        thirdParty.setType("weChat");
        thirdPartyMapper.insertThirdPartyUser(thirdParty);

        Map result = new HashMap();
        result.put("uri","users/" + user.getId());

        return Response.status(Response.Status.CREATED).entity(result).build();
    }

    @POST
    @Path("/github")
    @Produces(MediaType.APPLICATION_JSON)
    public Response createUser(ThirdParty thirdParty) {

        thirdParty.setType("github");
        thirdPartyMapper.insertThirdPartyUser(thirdParty);
        Map result = new HashMap<>();
        result.put("userId", thirdParty.getUserId());

        return Response.status(Response.Status.CREATED).entity(result).build();
    }

    @GET
    @Path("/github")
    @Produces(MediaType.APPLICATION_JSON)
    public Response findThirdPartyUserById(
            @QueryParam("thirdPartyUserId") String thirdPartyUserId) {

        ThirdParty thirdParty = new ThirdParty();
        thirdParty.setType("github");
        thirdParty.setThirdPartyUserId(thirdPartyUserId);
        ThirdParty result = thirdPartyMapper.getByThirdPartyUserIdAndType(thirdParty);

        if (result == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.status(Response.Status.OK).entity(thirdParty).build();
    }
}
