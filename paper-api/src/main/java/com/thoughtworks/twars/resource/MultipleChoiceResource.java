package com.thoughtworks.twars.resource;


import com.thoughtworks.twars.bean.MultipleChoice;
import com.thoughtworks.twars.bean.SingleChoice;
import com.thoughtworks.twars.mapper.MultipleChoiceMapper;
import io.swagger.annotations.Api;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.HashMap;
import java.util.Map;


@Path("/multipleChoices")
@Api

public class MultipleChoiceResource {

    @Inject
    private MultipleChoiceMapper multipleChoiceMapper;


    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertMultipleChoice(Map data) {

        MultipleChoice multipleChoice = new MultipleChoice();
        multipleChoice.setType((String) data.get("type"));
        multipleChoice.setDescription((String) data.get("description"));
        multipleChoice.setAnswer((String) data.get("answer"));
        multipleChoice.setOptions((String) data.get("options"));

        multipleChoiceMapper.insertMultipleChoice(multipleChoice);

        Map result = new HashMap();
        result.put("id", multipleChoice.getId());
        result.put("uri", "multipleChoices/" + multipleChoice.getId());

        return Response.status(Response.Status.CREATED).entity(result).build();
    }


    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{id}")
    public Response getMultipleChoiceById(@PathParam("id") Integer id) {

        MultipleChoice multipleChoice = multipleChoiceMapper.getMultipleChoiceById(id);

        Map result = multipleChoice.toMap();

        return Response.status(Response.Status.OK).entity(result).build();

    }

    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{id}")
    public Response updateMultipleChoiceById(@PathParam("id") Integer id, Map data) {

        MultipleChoice multipleChoice = new MultipleChoice();
        multipleChoice.setOptions((String) data.get("options"));
        multipleChoice.setType((String) data.get("type"));
        multipleChoice.setDescription((String) data.get("description"));
        multipleChoice.setAnswer((String) data.get("answer"));
        multipleChoice.setId(id);

        multipleChoiceMapper.updateMultipleChoice(multipleChoice);

        return Response.status(Response.Status.NO_CONTENT).build();
    }
}
