package com.thoughtworks.twars.resource;

import com.thoughtworks.twars.bean.HomeworkQuiz;
import com.thoughtworks.twars.bean.HomeworkQuizOperation;
import com.thoughtworks.twars.mapper.HomeworkQuizMapper;
import com.thoughtworks.twars.mapper.HomeworkQuizOperationMapper;
import com.thoughtworks.twars.mapper.UserMapper;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Path("/homeworkQuizzes")
public class HomeworkQuizResource extends Resource {
    @Inject
    private HomeworkQuizMapper homeworkQuizMapper;

    @Inject
    private UserMapper userMapper;

    @Inject
    private HomeworkQuizOperationMapper homeworkQuizOperationMapper;

    @PUT
    @Path("/{homeworkQuizId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateHomeworkQuiz(
            @PathParam("homeworkQuizId") Integer id, Map data
    ) {
        if (homeworkQuizMapper.findById(id) == null) {
            return Response.status(Response.Status.PRECONDITION_FAILED).build();
        }

        if (data.get("operationType").equals("DELETE")) {
            HomeworkQuizOperation homeworkQuizOperation = new HomeworkQuizOperation();
            homeworkQuizOperation.setHomeworkQuizId(id);
            homeworkQuizOperation.setOperationType((String) data.get("operationType"));
            homeworkQuizOperation.setOperatorId((Integer) data.get("operatorId"));

            homeworkQuizOperationMapper.insertHomeworkQuizOperation(homeworkQuizOperation);

            return Response.status(Response.Status.NO_CONTENT).build();
        }
        HomeworkQuiz homeworkQuiz = new HomeworkQuiz();
        homeworkQuiz.setDescription((String) data.get("description"));
        homeworkQuiz.setEvaluateScript((String) data.get("evaluateScript"));
        homeworkQuiz.setTemplateRepository((String) data.get("templateRepository"));
        homeworkQuiz.setMakerId((int) data.get("makerId"));
        homeworkQuiz.setHomeworkName((String) data.get("homeworkName"));
        homeworkQuiz.setCreateTime((int) data.get("createTime"));
        homeworkQuiz.setAnswerPath((String) data.get("answerPath"));
        homeworkQuiz.setRawId(homeworkQuizMapper.findById(id).getRawId());
        int stackId = 1;
        if (data.get("stackId") != null) {
            stackId = (int) data.get("stackId");
        }
        homeworkQuiz.setStackId(stackId);

        homeworkQuizMapper.insertHomeworkQuiz(homeworkQuiz);

        Map result = new HashMap();
        result.put("uri", "homeworkQuizzes/" + homeworkQuiz.getId());

        return Response.status(Response.Status.CREATED).entity(result).build();

    }


    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllHomeworkQuiz(
            @DefaultValue("1") @QueryParam("page") Integer page,
            @DefaultValue("15") @QueryParam("pageSize") Integer pageSize,
            @QueryParam("homeworkName") String homeworkName,
            @QueryParam("stackId") Integer stackId
    ) {
        Integer startPage = Math.max(page - 1, 0);
        Integer newPage = startPage * pageSize;
        List<HomeworkQuiz> allHomeworkQuizzes = homeworkQuizMapper
                .findHomeworkQuizzes(homeworkName, stackId, newPage, pageSize);
        List<Map> items = allHomeworkQuizzes
                .stream()
                .map(item -> item.toMap())
                .collect(Collectors.toList());
        Map result = new HashMap<>();
        result.put("homeworkQuizzes", items);
        return Response.status(Response.Status.OK).entity(result).build();
    }

    @GET
    @Path("/{homeworkQuizIds}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getOneHomeworkQuiz(
            @PathParam("homeworkQuizIds") String ids) {
        List homeworkQuizzes = new ArrayList();
        String[] idList = ids.split(",");

        for (String i : idList) {
            Integer id = Integer.parseInt(i);
            HomeworkQuiz homeworkQuiz = homeworkQuizMapper.findById(id);

            Map homeworkItem = homeworkQuiz.toMap();

            homeworkQuizzes.add(homeworkItem);
        }

        Map result = new HashMap<>();
        if (homeworkQuizzes.size() == 1) {
            result = (Map) homeworkQuizzes.get(0);
            return Response.status(Response.Status.OK).entity(result).build();
        }
        result.put("homeworkQuizzes", homeworkQuizzes);

        return Response.status(Response.Status.OK).entity(result).build();
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertPaper(Map data) {
        try {
            HomeworkQuiz homeworkQuiz = new HomeworkQuiz();
            String description = (String) data.get("description");
            homeworkQuiz.setDescription(description);
            String evaluateScript = (String) data.get("evaluateScript");
            homeworkQuiz.setEvaluateScript(evaluateScript);
            String templateRepository = (String) data.get("templateRepository");
            homeworkQuiz.setTemplateRepository(templateRepository);
            int makerId = (int) data.get("makerId");
            homeworkQuiz.setMakerId(makerId);
            String homeworkName = (String) data.get("homeworkName");
            homeworkQuiz.setHomeworkName(homeworkName);
            int createTime = (int) data.get("createTime");
            homeworkQuiz.setCreateTime(createTime);
            String answerPath = (String) data.get("answerPath");
            homeworkQuiz.setAnswerPath(answerPath);
            homeworkQuiz.setRawId(0);
            int stackId = 1;
            if (data.get("stackId") != null) {
                stackId = (int) data.get("stackId");
            }
            homeworkQuiz.setStackId(stackId);

            homeworkQuizMapper.insertHomeworkQuiz(homeworkQuiz);
            Integer id = homeworkQuiz.getId();

            homeworkQuizMapper.updateRawId(id);


            Map result = new HashMap();
            result.put("uri", "homeworkQuizzes/" + id);

            return Response.status(Response.Status.CREATED).entity(result).build();
        } catch (Exception exception) {
            session.rollback();
        }
        return Response.status(Response.Status.UNSUPPORTED_MEDIA_TYPE).build();
    }

}
