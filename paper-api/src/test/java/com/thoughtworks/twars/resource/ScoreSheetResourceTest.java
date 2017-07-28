package com.thoughtworks.twars.resource;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.thoughtworks.twars.bean.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.*;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class ScoreSheetResourceTest extends TestBase {

    @Mock
    ItemPost itemPost;

    @Mock
    BlankQuizSubmit blankQuizSubmit;

    @Mock
    ScoreSheet firstScoreSheet;

    @Mock
    ScoreSheet secondScoreSheet;

    @Mock
    BasicQuizSubmit basicQuizSubmit;

    @Mock
    BasicQuizPostHistory basicQuizPostHistory;

    String basePath = "/scoresheets";

    @Test
    public void should_return_all_score_sheets() {
        when(scoreSheetMapper.findAll()).thenReturn(
                Arrays.asList(firstScoreSheet, secondScoreSheet));
        when(firstScoreSheet.getId()).thenReturn(3);

        Response response = target(basePath).request().get();
        assertThat(response.getStatus(), is(200));

        List<Map> result = response.readEntity(List.class);
        assertThat(result.get(0).get("uri"), is("scoresheets/3"));
    }

    @Test
    public void should_return_404_when_not_find_score_sheets() {
        when(scoreSheetMapper.findAll()).thenReturn(null);

        Response response = target(basePath).request().get();

        assertThat(response.getStatus(), is(404));
    }

    @Test
    public void should_return_one_score_sheet_by_id() {
        Gson gson = new GsonBuilder().create();

        when(scoreSheetMapper.findOne(1)).thenReturn(firstScoreSheet);

        when(blankQuizSubmitMapper.findByScoreSheetId(1))
                .thenReturn(Arrays.asList(blankQuizSubmit));
        when(itemPostMapper.findByBlankQuizSubmit(2)).thenReturn(Arrays.asList(itemPost));

        when(firstScoreSheet.getExamerId()).thenReturn(2);
        when(firstScoreSheet.getPaperId()).thenReturn(5);

        when(blankQuizSubmit.getId()).thenReturn(2);
        when(blankQuizSubmit.getBlankQuizId()).thenReturn(3);

        when(itemPost.getAnswer()).thenReturn("success");
        when(itemPost.getQuizItemId()).thenReturn(3);

        Response response = target(basePath + "/1").request().get();
        assertThat(response.getStatus(), is(200));
    }

    @Test
    public void should_return_one_score_sheet_include_basic_quiz_by_id() {
        when(scoreSheetMapper.findOne(1)).thenReturn(firstScoreSheet);
        when(basicQuizMapper .findByScoreSheetId(1)).thenReturn(1);
        when(basicQuizSubmitMapper.findByBasicQuizId(4))
                .thenReturn(Arrays.asList(basicQuizSubmit));
        when(basicQuizPostHistoryMapper.findByBasicQuizSubmitId(1))
                .thenReturn(Arrays.asList(basicQuizPostHistory));

        when(firstScoreSheet.getExamerId()).thenReturn(1);
        when(firstScoreSheet.getPaperId()).thenReturn(1);

        when(basicQuizSubmit.getId()).thenReturn(1);
        when(basicQuizSubmit.getBasicQuizId()).thenReturn(1);

        when(basicQuizPostHistory.getBasicQuizItemId()).thenReturn(1);
        when(basicQuizPostHistory.getType()).thenReturn("SINGLE_CHOICE");

        Response response = target(basePath + "/1").request().get();
        assertThat(response.getStatus(), is(200));

    }

    @Test
    public void should_return_score_sheet_uri() {
        Map homeworkSubmitPostHistory = new HashMap<>();
        homeworkSubmitPostHistory.put("homeworkURL", "fghjk");
        homeworkSubmitPostHistory.put("version", "jkl");
        homeworkSubmitPostHistory.put("branch", "dev");
        homeworkSubmitPostHistory.put("status", 9);

        Map homeworkSubmit = new HashMap<>();
        homeworkSubmit.put("homeworkQuizId", 8);
        homeworkSubmit.put("homeworkSubmitPostHistory", homeworkSubmitPostHistory);

        List<Map> homeworkSubmits = new ArrayList<>();
        homeworkSubmits.add(homeworkSubmit);

        Map itemPost = new HashMap<>();
        itemPost.put("answer", "10");
        itemPost.put("quizItemId", 8);

        List<Map> itemPosts = new ArrayList<>();
        itemPosts.add(itemPost);

        Map blankQuizSubmit = new HashMap<>();
        blankQuizSubmit.put("blankQuizId", 9);
        blankQuizSubmit.put("itemPosts", itemPosts);

        List<Map> blankQuizSubmits = new ArrayList<>();
        blankQuizSubmits.add(blankQuizSubmit);

        Map basicQuizSubmit = new HashMap();
        basicQuizSubmit.put("startTime", 32323);
        basicQuizSubmit.put("endTime", 43434);

        Map basicQuizPost = new HashMap();
        basicQuizPost.put("id", 1);
        basicQuizPost.put("type", "SINGLE_CHOICES");
        basicQuizPost.put("answer", 1);

        List<Map> basicQuizPosts = new ArrayList<>();
        basicQuizPosts.add(basicQuizPost);

        List<Map> basicQuizSubmits = new ArrayList<>();
        basicQuizSubmits.add(basicQuizSubmit);


        Map data = new HashMap<>();
        data.put("examerId", 2);
        data.put("paperId", 4);
        data.put("homeworkSubmits", homeworkSubmits);
        data.put("blankQuizSubmits", blankQuizSubmits);
        data.put("basicQuizSubmits", basicQuizSubmits);


        Entity entity = Entity.entity(data, MediaType.APPLICATION_JSON);
        Response response = target(basePath).request().post(entity);

        assertThat(response.getStatus(), is(201));
    }

    @Test
    public void should_return_404_when_not_find_score_sheet_by_id() {
        when(scoreSheetMapper.findOne(1)).thenReturn(null);

        Response response = target(basePath + "/1").request().get();
        assertThat(response.getStatus(), is(404));
    }
}
