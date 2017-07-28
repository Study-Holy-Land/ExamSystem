package com.thoughtworks.twars.resource;

import com.thoughtworks.twars.bean.LoginDetail;
import com.thoughtworks.twars.bean.User;
import com.thoughtworks.twars.mapper.LoginDetailMapper;
import com.thoughtworks.twars.mapper.UserMapper;
import io.swagger.annotations.*;

import javax.inject.Inject;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Path("/login")
@Api
public class LoginResource extends Resource {

    @Inject
    private UserMapper userMapper;

    @Inject
    private LoginDetailMapper loginDetailMapper;

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response createUser(User user) {

        Pattern mobilePhoneMatches = Pattern
                .compile("^1([3|4|5|8])[0-9]\\d{8}$");
        Matcher mobilePhoneMatcher = mobilePhoneMatches.matcher(user.getEmail());
        User resultUser = new User();

        if (mobilePhoneMatcher.matches()) {
            resultUser = userMapper.getUserByMobilePhoneAndPassWord(user);
        } else {
            resultUser = userMapper.getUserByEmailAndPassWord(user);
        }

        if ((resultUser == null) || (resultUser.getId() == 0)) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }

        List<LoginDetail> loginDetails = loginDetailMapper
                .getLoginDetailByUserId(resultUser.getId());


        if (loginDetails.size() != 0 && loginDetails.get(loginDetails.size() - 1).getFlag() == 1) {
            loginDetailMapper.updateLoginDetail(loginDetails
                    .get(loginDetails.size() - 1).getToken());
        }

        loginDetailMapper.insertLoginDetail(resultUser.getId());

        Map result = resultUser.toMap();
        result.put("role",userMapper.getUserRoleByUserId(resultUser.getId()));

        Map<String, String> userInfo = new HashMap<>();
        userInfo.put("uri", "users/" + resultUser.getId());

        result.put("userInfo",userInfo);

        List<LoginDetail> loginDetailList = loginDetailMapper
                .getLoginDetailByUserId(resultUser.getId());
        String token = loginDetailList.get(loginDetailList.size() - 1).getToken();

        return Response.ok(result).header("token", token).build();
    }

}
