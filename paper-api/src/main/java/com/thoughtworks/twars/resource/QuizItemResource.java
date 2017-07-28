package com.thoughtworks.twars.resource;

import com.thoughtworks.twars.bean.QuizItem;
import com.thoughtworks.twars.mapper.QuizItemMapper;
import io.swagger.annotations.Api;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Path("/quizItems")
@Api
public class QuizItemResource extends Resource {

    @Inject
    private QuizItemMapper quizItemMapper;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllQuizItems() {
        List<QuizItem> quizItems = quizItemMapper.getAllQuizItems();

        if (quizItems == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        List<Map> result = quizItems
                .stream()
                .map(item -> {
                    Map map = new HashMap();
                    map.put("uri", "quizItems/" + item.getId());

                    return map;
                })
                .collect(Collectors.toList());

        return Response.status(Response.Status.OK).entity(result).build();
    }


    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertQuizItem(QuizItem quizItem) {

        quizItemMapper.insertQuizItem(quizItem);

        Map result = new HashMap();
        result.put("uri", "quizItems/" + quizItem.getId());

        return Response.status(Response.Status.CREATED).entity(result).build();
    }


    @GET
    @Path("/{param}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getQuizItem(
            @PathParam("param") Integer id) {

        QuizItem quizItem = quizItemMapper.getQuizItemById(id);

        if (quizItem == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        Map result = new HashMap();
        result.put("id", quizItem.getId());
        result.put("description", quizItem.getDescriptionZh());
        result.put("chartPath", quizItem.getChartPath());
        result.put("question", quizItem.getQuestionZh());
        result.put("initializedBox", quizItem.getInitializedBox());


        return Response.status(Response.Status.OK).entity(result).build();
    }

    @GET
    @Path("/examples")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getExamples() {

        List<QuizItem> exampleItems = quizItemMapper.getExamples();
        List<Map> examples = exampleItems
                .stream()
                .map(item -> item.toMap())
                .collect(Collectors.toList());
        Map reslut = new HashMap();
        reslut.put("items",examples);
        return Response.status(Response.Status.OK).entity(reslut).build();
    }


}
