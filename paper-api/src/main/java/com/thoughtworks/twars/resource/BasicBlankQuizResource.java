package com.thoughtworks.twars.resource;

import com.thoughtworks.twars.bean.BasicBlankQuiz;
import com.thoughtworks.twars.mapper.BasicBlankQuizMapper;
import io.swagger.annotations.Api;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.HashMap;
import java.util.Map;

@Path("/basicBlankQuizzes")
@Api
public class BasicBlankQuizResource {

    @Inject
    private BasicBlankQuizMapper basicBlankQuizMapper;

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertBasicQuizzes(Map data) {

        BasicBlankQuiz basicBlankQuiz = new BasicBlankQuiz();
        basicBlankQuiz.setType((String) data.get("type"));
        basicBlankQuiz.setDescription((String) data.get("description"));
        basicBlankQuiz.setAnswer((String) data.get("answer"));

        basicBlankQuizMapper.insertBasicBlankQuiz(basicBlankQuiz);

        Map result = new HashMap();
        result.put("uri", "basicBlankQuizzes/" + basicBlankQuiz.getId());
        result.put("id", basicBlankQuiz.getId());

        return Response.status(Response.Status.CREATED).entity(result).build();

    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{id}")
    public Response getBasicBlankQuizById(@PathParam("id") Integer id) {

        BasicBlankQuiz basicBlankQuiz = basicBlankQuizMapper.getBasicBlankQuizById(id);

        Map result = basicBlankQuiz.toMap();

        return Response.status(Response.Status.OK).entity(result).build();

    }

    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{id}")
    public Response updateMultipleChoiceById(@PathParam("id") Integer id, Map data) {

        BasicBlankQuiz basicBlankQuiz = new BasicBlankQuiz();
        basicBlankQuiz.setType((String) data.get("type"));
        basicBlankQuiz.setDescription((String) data.get("description"));
        basicBlankQuiz.setAnswer((String) data.get("answer"));
        basicBlankQuiz.setId(id);

        basicBlankQuizMapper.updateBasicBlankQuiz(basicBlankQuiz);

        return Response.status(Response.Status.NO_CONTENT).build();
    }
}
