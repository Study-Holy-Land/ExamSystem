package com.thoughtworks.twars.resource;

import com.thoughtworks.twars.bean.*;
import com.thoughtworks.twars.mapper.*;
import io.swagger.annotations.Api;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Path("/programs")
@Api
public class ProgramResource extends Resource {

    @Inject
    private PaperMapper paperMapper;
    @Inject
    private PaperOperationMapper paperOperationMapper;
    @Inject
    private SectionMapper sectionMapper;
    @Inject
    private BlankQuizMapper blankQuizMapper;
    @Inject
    private SectionQuizMapper sectionQuizMapper;
    @Inject
    private ProgramMapper programMapper;
    @Inject
    private PaperAndOperationMapper paperAndOperationMapper;
    @Inject
    private BasicQuizMapper basicQuizMapper;

    @GET
    @Path("/{programId}/papers")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPapersByProgramId(
            @PathParam("programId") Integer programId) {
        List<PaperAndOperation> papers = paperAndOperationMapper.findPapersByProgramId(programId);

        List<Map> items = papers
                .stream()
                .map(item -> item.toMap())
                .collect(Collectors.toList());

        Map result = new HashMap();

        result.put("paperList", items);

        return Response.status(Response.Status.OK).entity(result).build();
    }

    @POST
    @Path("/{programId}/papers")
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertPapers(Map data, @PathParam("programId") Integer programId) {

        Integer makerId = (Integer) data.get("makerId");
        String paperName = (String) data.get("paperName");
        String description = (String) data.get("description");
        Integer createTime = (Integer) data.get("createTime");

        Paper paper = new Paper();
        paper.setMakerId(makerId);
        paper.setPaperName(paperName);
        paper.setDescription(description);
        paper.setCreateTime(createTime);
        paper.setProgramId(programId);

        paperMapper.insertPaper(paper);

        Integer paperId = paper.getId();

        PaperOperation paperOperation = new PaperOperation();
        paperOperation.setPaperId(paperId);
        paperOperation.setOperatingTime(createTime);
        paperOperation.setOperationType("DISTRIBUTION");
        paperOperation.setOperatorId(makerId);

        paperOperationMapper.insertPaperOperation(paperOperation);

        List sections = (List) data.get("sections");

        for (Object sectionItem : sections) {
            Map section = (Map) sectionItem;
            String sectionDescription = (String) section.get("description");
            String sectionType = (String) section.get("type");

            Section insertSection = new Section();
            insertSection.setPaperId(paperId);
            insertSection.setType(sectionType);
            insertSection.setDescription(sectionDescription);

            sectionMapper.insertSection(insertSection);
            Integer sectionId = insertSection.getId();

            if (sectionType.equals("blankQuizzes")) {
                Map item = (Map) section.get("items");

                Integer easyCount = (Integer) item.get("easyCount");
                Integer normalCount = (Integer) item.get("normalCount");
                Integer hardCount = (Integer) item.get("hardCount");
                Integer exampleCount = (Integer) item.get("exampleCount");

                BlankQuiz insertBlankQuiz = new BlankQuiz();
                insertBlankQuiz.setEasyCount(easyCount);
                insertBlankQuiz.setNormalCount(normalCount);
                insertBlankQuiz.setHardCount(hardCount);
                insertBlankQuiz.setExampleCount(exampleCount);
                insertBlankQuiz.setId(sectionId);

                blankQuizMapper.insertBlankQuiz(insertBlankQuiz);

                Integer blankQuizId = insertBlankQuiz.getId();

                SectionQuiz insertSectionQuiz = new SectionQuiz();
                insertSectionQuiz.setSectionId(sectionId);
                insertSectionQuiz.setQuizId(blankQuizId);
                insertSectionQuiz.setQuizType("blankQuizzes");

                sectionQuizMapper.insertSectionQuiz(insertSectionQuiz);
            }
            if (sectionType.equals("homeworkQuizzes")) {
                List item = (List) section.get("items");

                for (Object homeworkItem : item) {

                    Map homeworkQuiz = (Map) homeworkItem;

                    Integer homeworkId = (Integer) homeworkQuiz.get("id");

                    SectionQuiz sectionQuiz = new SectionQuiz();
                    sectionQuiz.setQuizId(homeworkId);
                    sectionQuiz.setSectionId(sectionId);
                    sectionQuiz.setQuizType("homeworkQuizzes");

                    sectionQuizMapper.insertSectionQuiz(sectionQuiz);

                }
            }
            if (sectionType.equals("basicQuizzes")) {

                List item = (List) section.get("items");

                for (Object basicQuizItem : item) {

                    Map basicQuizObj = (Map) basicQuizItem;
                    Integer id = (Integer) basicQuizObj.get("id");
                    String quizType = ((String) basicQuizObj.get("uri")).split("/")[0];

                    SectionQuiz sectionQuiz = new SectionQuiz();
                    sectionQuiz.setQuizId(id);
                    sectionQuiz.setSectionId(sectionId);
                    sectionQuiz.setQuizType(quizType);
                    sectionQuizMapper.insertSectionQuiz(sectionQuiz);
                }
            }
        }

        Map result = new HashMap();
        result.put("uri", "programs/" + programId + "/papers/" + paperId);

        return Response.status(Response.Status.CREATED).entity(result).build();
    }

    @GET
    @Path("/{programId}/papers/{paperId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getOnePaper(
            @PathParam("programId") Integer programId,
            @PathParam("paperId") Integer paperId) {

        Paper paper = paperMapper.getOnePaper(paperId);
        if (paper == null || programId != paper.getProgramId()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.status(Response.Status.OK)
                .entity(paper.toMap()).build();
    }

    @GET
    @Path("/{programId}/users")
    @Produces(MediaType.APPLICATION_JSON)
    public Response findUsersIdByProgramId(
            @PathParam("programId") Integer programId) {
        List<Integer> users = programMapper.findUsersIdByProgramId(programId);
        if (users.size() != 0) {

            List<String> usersUri = new ArrayList<String>();

            for (Integer item : users) {
                String uri = "users/" + item;
                usersUri.add(uri);
            }

            Map<String, Object> result = new HashMap();
            result.put("usersUri", usersUri);

            return Response.status(Response.Status.OK).entity(result).build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();

    }


    @POST
    @Path("/{programId}/papers/{paperId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertPaperOperation(
            @PathParam("programId") Integer programId,
            @PathParam("paperId") Integer paperId, Map data) {
        try {

            String operationType = (String) data.get("operation");
            Integer operatorId = (Integer) data.get("makerId");
            Integer operatingTime = (Integer) data.get("createTime");

            PaperOperation paperOperation = new PaperOperation();
            paperOperation.setOperationType(operationType);
            paperOperation.setOperatorId(operatorId);
            paperOperation.setOperatingTime(operatingTime);
            paperOperation.setPaperId(paperId);

            int result = paperOperationMapper.insertPaperOperation(paperOperation);
            if (result == 0) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllPrograms(
            @DefaultValue("1") @QueryParam("page") Integer page,
            @DefaultValue("15") @QueryParam("pageSize") Integer pageSize
    ) {

        Integer startPage = Math.max(page - 1, 0);
        Integer newPage = startPage * pageSize;
        List<Program> programs = programMapper.getAllPrograms(newPage, pageSize);
        Map result = new HashMap();

        List<Map> programsInfo = programs.stream()
                .map(program -> program.toMap())
                .collect(Collectors.toList());


        result.put("programs", programsInfo);
        return Response.status(Response.Status.OK).entity(result).build();
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertPrograms(Map data) {
        String name = (String) data.get("name");

        Program program = new Program();
        program.setName(name);

        programMapper.insertPrograms(program);

        Map result = new HashMap();
        result.put("id", program.getId());

        return Response.status(Response.Status.CREATED).entity(result).build();
    }

    @PUT
    @Path("/{programId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updatePrograms(
            @PathParam("programId") Integer programId, Map data) {

        Program program = new Program();
        program.setId(programId);
        program.setName((String) data.get("name"));

        programMapper.updatePrograms(program);

        return Response.status(Response.Status.NO_CONTENT).build();
    }

}
