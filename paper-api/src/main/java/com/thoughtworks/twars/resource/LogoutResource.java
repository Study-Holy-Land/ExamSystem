package com.thoughtworks.twars.resource;

import com.thoughtworks.twars.bean.LoginDetail;
import com.thoughtworks.twars.mapper.LoginDetailMapper;
import io.swagger.annotations.*;

import javax.inject.Inject;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.Map;

@Path("/logout")
@Api
public class LogoutResource extends Resource {

    @Inject
    private LoginDetailMapper loginDetailMapper;

    @POST
    public Response logoutUser(Map data) {

        List<LoginDetail> loginDetailList =
                loginDetailMapper.getLoginDetailByUserId((Integer) data.get("userId"));
        LoginDetail loginDetail = loginDetailList.get(loginDetailList.size() - 1);

        if (loginDetail == null || loginDetail.getFlag() == 0) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }

        loginDetailMapper.updateLoginDetailById(loginDetail.getId());

        return Response.status(Response.Status.CREATED).build();
    }
}
