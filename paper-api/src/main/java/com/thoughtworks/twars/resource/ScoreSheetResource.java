package com.thoughtworks.twars.resource;

import com.thoughtworks.twars.bean.ScoreSheet;
import com.thoughtworks.twars.mapper.ScoreSheetMapper;
import com.thoughtworks.twars.resource.quiz.scoresheet.BasicQuizScoreSheetService;
import com.thoughtworks.twars.resource.quiz.scoresheet.BlankQuizScoreSheetService;
import com.thoughtworks.twars.resource.quiz.scoresheet.HomeworkQuizScoreSheetService;
import io.swagger.annotations.Api;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Path("/scoresheets")
@Api
public class ScoreSheetResource extends Resource {
    @Inject
    private ScoreSheetMapper scoreSheetMapper;
    @Inject
    private BlankQuizScoreSheetService blankQuizScoreSheet;
    @Inject
    private HomeworkQuizScoreSheetService homeworkQuizScoreSheet;
    @Inject
    private BasicQuizScoreSheetService basicQuizScoreSheet;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response findAll() {
        List<ScoreSheet> scoreSheets = scoreSheetMapper.findAll();

        if (scoreSheets == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        List result = scoreSheets.stream()
                .map(item -> {
                    Map map = new HashMap();
                    map.put("uri", "scoresheets/" + item.getId());

                    return map;
                })
                .collect(Collectors.toList());

        return Response.status(Response.Status.OK).entity(result).build();
    }


    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertScoreSheet(Map data) {

        Integer examerId = (Integer) data.get("examerId");
        Integer paperId = (Integer) data.get("paperId");
        Integer scoreSheetId;

        ScoreSheet scoreSheet = new ScoreSheet();
        scoreSheet.setPaperId(paperId);
        scoreSheet.setExamerId(examerId);

        try {
            ScoreSheet selectScoreSheet = scoreSheetMapper.selectScoreSheet(scoreSheet);

            if (selectScoreSheet != null) {
                scoreSheetId = selectScoreSheet.getId();
            } else {
                scoreSheetMapper.insertScoreSheet(scoreSheet);
                scoreSheetId = scoreSheet.getId();
            }

            List<Map> blankQuizSubmits = (List<Map>) data.get("blankQuizSubmits");
            List<Map> homeworkSubmits = (List<Map>) data.get("homeworkSubmits");
            List<Map> basicQuizSubmits = (List<Map>) data.get("basicQuizSubmits");

            if (blankQuizSubmits != null) {
                blankQuizScoreSheet.insertQuizScoreSheet(data, scoreSheetId, paperId);
            }

            if (homeworkSubmits != null) {
                homeworkQuizScoreSheet.insertQuizScoreSheet(data, scoreSheetId, paperId);
            }

            if (basicQuizSubmits != null) {
                basicQuizScoreSheet.insertQuizScoreSheet(data, scoreSheetId, paperId);
            }

            Map result = new HashMap<>();
            result.put("uri", "scoresheets/" + scoreSheetId);

            return Response.status(Response.Status.CREATED).entity(result).build();

        } catch (Exception exception) {
            exception.printStackTrace();
            if (session != null) {
                try {
                    session.rollback();    
                } catch (Exception ex) {
                    ex.printStackTrace();
                }

            }
        }

        return Response.status(Response.Status.UNAUTHORIZED).build();
    }


    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response findOne(
            @PathParam("id") Integer id
    ) {
        ScoreSheet scoreSheet = scoreSheetMapper.findOne(id);

        if (scoreSheet == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        Map<String, Object> examerUri = new HashMap<>();
        Map<String, Object> paperUri = new HashMap<>();
        examerUri.put("uri", "users/" + scoreSheet.getExamerId());
        paperUri.put("uri", "papers/" + scoreSheet.getPaperId());

        Map result = new HashMap<>();
        result.put("examer", examerUri);
        result.put("paper", paperUri);
        result.put("blankQuizSubmits", blankQuizScoreSheet.getQuizScoreSheet(id));
        result.put("homeworkSubmits", homeworkQuizScoreSheet.getQuizScoreSheet(id));
        result.put("basicQuizSubmits", basicQuizScoreSheet.getQuizScoreSheet(id));

        return Response.status(Response.Status.OK).entity(result).build();
    }

}
