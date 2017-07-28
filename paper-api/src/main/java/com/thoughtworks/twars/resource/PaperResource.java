
package com.thoughtworks.twars.resource;

import com.thoughtworks.twars.bean.*;
import com.thoughtworks.twars.mapper.*;
import com.thoughtworks.twars.resource.quiz.definition.BlankQuizDefinitionService;
import com.thoughtworks.twars.resource.quiz.definition.HomeworkQuizDefinitionService;
import io.swagger.annotations.*;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Path("/papers")
@Api
public class PaperResource extends Resource {
    @Inject
    private HomeworkPostHistoryMapper homeworkPostHistoryMapper;
    @Inject
    private PaperMapper paperMapper;
    @Inject
    private UserMapper userMapper;
    @Inject
    private PaperOperationMapper paperOperationMapper;
    @Inject
    private HomeworkQuizDefinitionService homeworkQuizDefinition;
    @Inject
    private BlankQuizDefinitionService blankQuizDefinition;
    @Inject
    private ScoreSheetMapper scoreSheetMapper;
    @Inject
    private BlankQuizSubmitMapper blankQuizSubmitMapper;
    @Inject
    private ItemPostMapper itemPostMapper;
    @Inject
    private QuizItemMapper quizItemMapper;
    @Inject
    private BlankQuizMapper blankQuizMapper;
    @Inject
    private SectionQuizMapper sectionQuizMapper;
    @Inject
    private BasicQuizMapper basicQuizMapper;
    @Inject
    private BasicQuizSubmitMapper basicQuizSubmitMapper;
    @Inject
    private BasicQuizPostHistoryMapper basicQuizPostHistoryMapper;
    @Inject
    private SingleChoiceMapper singleChoiceMapper;
    @Inject
    private MultipleChoiceMapper multipleChoiceMapper;
    @Inject
    private BasicBlankQuizMapper basicBlankQuizMapper;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllPapers(
            @DefaultValue("1") @QueryParam("page") Integer page,
            @DefaultValue("15") @QueryParam("pageSize") Integer pageSize
    ) {

        int startPage = Math.max(page - 1, 0);
        Integer newPage = startPage * pageSize;
        List<Paper> papers = paperMapper.getAllPapers(newPage, pageSize);
        Map result = new HashMap<>();

        List<Map> items = papers
                .stream()
                .map(item -> item.getPapersInfo())
                .collect(Collectors.toList());


        result.put("paperInfo", items);

        int paperCount = paperMapper.findAll().size();

        result.put("paperCount", paperCount);

        return Response.status(Response.Status.OK).entity(result).build();
    }


    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertPaper(Map data) {
        try {
            int makerId = (int) data.get("makerId");
            int programId = (int) data.get("programId");
            String paperName = (String) data.get("paperName");
            String description = (String) data.get("description");
            Integer createTime = (Integer) data.get("createTime");

            Map section = (Map) data.get("sections");

            if (section == null) {
                Paper insertPaper = new Paper();
                insertPaper.setMakerId(makerId);
                insertPaper.setPaperName(paperName);
                insertPaper.setProgramId(programId);
                insertPaper.setDescription(description);
                insertPaper.setCreateTime(createTime);

                paperMapper.insertPaper(insertPaper);

                Map result = new HashMap<>();
                result.put("paperId", insertPaper.getId());

                return Response.status(Response.Status.OK).entity(result).build();
            }

            Paper paper = new Paper();
            paper.setMakerId(makerId);
            paper.setPaperName(paperName);
            paper.setProgramId(programId);
            paper.setDescription(description);
            paper.setCreateTime(createTime);

            paperMapper.insertPaper(paper);
            int paperId = paper.getId();
            Map result = new HashMap();
            result.put("uri", insertDefinitionByQuizType(section, paperId));

            return Response.status(Response.Status.OK).entity(result).build();
        } catch (Exception exception) {
            exception.printStackTrace();
            session.rollback();
        }
        return Response.status(Response.Status.UNSUPPORTED_MEDIA_TYPE).build();
    }

    public String insertDefinitionByQuizType(Map section, Integer paperId) {
        Map blankQuizzes = (Map) section.get("blankQuizzes");
        Map homeworkQuizzes = (Map) section.get("homeworkQuizzes");

        if ("blankQuizzes".equals(blankQuizzes.get("quizType"))) {
            blankQuizDefinition.insertQuizDefinition(blankQuizzes, paperId);
        }
        if ("homeworkQuizzes".equals(homeworkQuizzes.get("quizType"))) {
            homeworkQuizDefinition.insertQuizDefinition(homeworkQuizzes, paperId);
        }

        return "papers/" + paperId;
    }


    @GET
    @Path("/{paperId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getOnePaper(
            @PathParam("paperId") int id) {
        Paper paper = paperMapper.getOnePaper(id);
        if (paper == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.status(Response.Status.OK)
                .entity(paper.toMap()).build();
    }

    @GET
    @Path("/{param}/usersDetail")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserDetailByPaperId(
            @PathParam("param") Integer id) {
        List<Integer> examerIds = scoreSheetMapper.findUserIdsByPaperId(id);
        List<UserDetail> userDetails = userMapper.findUserDetailsByUserIds(examerIds);
        List<User> users = userMapper.findUsersByUserIds(examerIds);
        List<Map> result = new ArrayList<>();
        for (int i = 0; i < userDetails.size(); i++) {
            Map userMap = new HashMap<>();
            userMap.put("userId", users.get(i).getId());
            userMap.put("mobilePhone", users.get(i).getMobilePhone());
            userMap.put("email", users.get(i).getEmail());
            userMap.put("major", userDetails.get(i).getMajor());
            userMap.put("degree", userDetails.get(i).getDegree());
            userMap.put("gender", userDetails.get(i).getGender());
            userMap.put("name", userDetails.get(i).getName());
            userMap.put("school", userDetails.get(i).getSchool());
            userMap.put("schoolProvince", userDetails.get(i).getSchoolProvince());
            userMap.put("schoolCity", userDetails.get(i).getSchoolCity());
            userMap.put("entranceYear", userDetails.get(i).getEntranceYear());
            result.add(userMap);
        }
        return Response.status(Response.Status.OK).entity(result).build();
    }

    @GET
    @Path("/enrollment")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getEnrollmentPaper() {
        return getOnePaper(1);
    }


    @GET
    @Path("/{param}/logicPuzzle")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getLogicPuzzleByPaperId(
            @PathParam("param") Integer id,
            @QueryParam("userId") Integer examerId
    ) {

        List<ScoreSheet> scoreSheets = scoreSheetMapper.findByPaperId(id, examerId);

        if (scoreSheets.size() == 0) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        List<Map> result = new ArrayList<>();

        scoreSheets.forEach(item -> {
            BlankQuizSubmit blankQuizSubmit = blankQuizSubmitMapper
                    .findByScoreSheetId(item.getId()).get(0);

            List<ItemPost> itemPostList = itemPostMapper
                    .findByBlankQuizSubmit(blankQuizSubmit.getId());

            int paperId = item.getPaperId();
            BlankQuiz blankQuiz = blankQuizMapper.findOne(blankQuizSubmit.getBlankQuizId());

            List<String> correctList = new ArrayList<>();
            itemPostList.forEach(val -> {
                String answer = quizItemMapper.getQuizItemById(val.getQuizItemId()).getAnswer();
                if (val.getAnswer() != null && val.getAnswer().equals(answer)) {
                    correctList.add("true");
                }
            });

            int itemCount = blankQuiz.getEasyCount()
                    + blankQuiz.getNormalCount()
                    + blankQuiz.getHardCount();
            Map map = new HashMap();
            map.put("itemNumber", itemCount);
            map.put("userId", item.getExamerId());
            map.put("correctNumber", correctList.size());
            map.put("startTime", blankQuizSubmit.getStartTime());
            map.put("endTime", blankQuizSubmit.getEndTime());

            result.add(map);
        });
        return Response.status(Response.Status.OK).entity(result).build();
    }

    @GET
    @Path("/{paperId}/userCount")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserCountByPaperId(
            @PathParam("paperId") Integer paperId) {
        Map<String, Integer> result = paperMapper.getUserCountByPaperId(paperId);


        return Response.status(Response.Status.OK).entity(result).build();
    }

    @PUT
    @Path("/{paperId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updatePaperOperation(
            @PathParam("paperId") Integer paperId, Map data) {
        if (paperMapper.getPaperById(paperId) == null) {
            return Response.status(Response.Status.PRECONDITION_FAILED).build();
        }
        PaperOperation paperOperation = new PaperOperation();
        paperOperation.setOperationType((String) data.get("operationType"));
        paperOperation.setOperatingTime((Integer) data.get("operatingTime"));
        paperOperation.setOperatorId((Integer) data.get("operatorId"));
        paperOperation.setPaperId(paperId);

        paperOperationMapper.insertPaperOperation(paperOperation);

        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @GET
    @Path("/{paperId}/users/{userId}/homeworkHistory")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getHistoryByUser(
            @PathParam("paperId") Integer paperId, @PathParam("userId") Integer examerId,
            @QueryParam("sectionId") Integer sectionId) {
        Map result = new HashMap();
        List<Map> homeworkHistory = homeworkPostHistoryMapper
                .getHistoryByExamerIdAndPaperId(examerId, paperId);
        if (sectionId == null) {
            result.put("items", homeworkHistory);
        } else {

            List<Map> items = new ArrayList<>();
            for (int i = 0; i < homeworkHistory.size(); i++) {
                Integer quizId = (Integer) homeworkHistory.get(i).get("homeworkQuizId");
                Integer id = sectionQuizMapper
                        .getSectionQuizIdBySectionIdAndQuizId(quizId, sectionId);
                if (id != null) {
                    items.add(homeworkHistory.get(i));
                }
            }
            result.put("items", items);
        }


        return Response.status(Response.Status.OK).entity(result).build();
    }


    @GET
    @Path("/{paperId}/basicQuizzes")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getBasicQuizzesHistoryByUser(
            @PathParam("paperId") Integer paperId,
            @QueryParam("sectionId") Integer sectionId,
            @QueryParam("userId") Integer userId) {

        Map result = new HashMap();
        Integer basicQuizId = basicQuizMapper.getBasicQuizIdById(paperId, sectionId, userId);

        if (basicQuizId == null) {
            return Response.status(Response.Status.OK).entity(result).build();
        }


        Integer totalCount = sectionQuizMapper.getQuizCountByPaperIdAndSectionId(sectionId);
        result.put("totalCount", totalCount);

        Map item = basicQuizSubmitMapper.getBaiscQuizSubmitByBasicQuizId(basicQuizId);
        result.put("startTime", item.get("startTime"));
        result.put("endTime", item.get("endTime"));

        int correctCount = 0;

        Map<String, BasicQuizAnswer> quizTypeMap = new HashMap();
        quizTypeMap.put("SINGLE_CHOICE", singleChoiceMapper);
        quizTypeMap.put("MULTIPLE_CHOICE", multipleChoiceMapper);
        quizTypeMap.put("BASIC_BLANK_QUIZ", basicBlankQuizMapper);

        List<BasicQuizPostHistory> basicQuizPostHistories =
                basicQuizPostHistoryMapper.findByBasicQuizSubmitId((Integer) item.get("id"));

        for (BasicQuizPostHistory basicQuizPostHistory : basicQuizPostHistories) {
            String answer = quizTypeMap.get(basicQuizPostHistory.getType())
                    .findAnswerById(basicQuizPostHistory.getBasicQuizItemId());
            if (answer.equals(basicQuizPostHistory.getUserAnswer())) {
                correctCount++;
            }
        }

        result.put("correctCount", correctCount);

        return Response.status(Response.Status.OK).entity(result).build();
    }

}
