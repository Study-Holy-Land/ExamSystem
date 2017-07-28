package com.thoughtworks.twars.resource;

import com.thoughtworks.twars.mapper.UserMapper;
import io.swagger.annotations.Api;

import javax.inject.Inject;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/relationshipCreating")
@Api
public class RelationshipCreatingResource extends Resource {
    @Inject
    UserMapper userMapper;

    @POST
    @Path("/{mentorId}/students/{studentId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertMentorUser(
            @PathParam("mentorId") Integer mentorId,
            @PathParam("studentId") Integer studentId) {
        try {
            Integer isCreating = userMapper.insertStudentMentor(mentorId, studentId);
            if (isCreating == 1) {
                return Response.status(Response.Status.CREATED).build();
            }
        } catch (Exception exception) {
            session.rollback();
        }
        return Response.status(Response.Status.FORBIDDEN).build();
    }
}
