package com.thoughtworks.twars.resource;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.thoughtworks.twars.bean.QuizItem;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;


@RunWith(MockitoJUnitRunner.class)
public class QuizItemResourceTest extends TestBase {

    QuizItem firstQuizItem = mock(QuizItem.class);
    QuizItem secondQuizItem = mock(QuizItem.class);

    String basePath = "quizItems";

    @Test
    public void should_return_all_quizItems() {
        when(quizItemMapper.getAllQuizItems()).thenReturn(
                Arrays.asList(firstQuizItem, secondQuizItem));
        when(firstQuizItem.getId()).thenReturn(1);

        Response response = target(basePath).request().get();
        assertThat(response.getStatus(), is(200));

        List<Map> result = (List<Map>) response.readEntity(List.class);
        assertThat((String) result.get(0).get("uri"), is(basePath + "/1"));
    }

    @Test
    public void should_return_404_when_not_find_quiz_item() {
        when(quizItemMapper.getAllQuizItems()).thenReturn(null);

        Response response = target(basePath).request().get();
        assertThat(response.getStatus(), is(404));
    }

    @Test
    public void should_return_insert_quizItem_uri() {
        QuizItem quizItem = new QuizItem();
        quizItem.setId(6);
        quizItem.setInitializedBox("8,3,4,5,6");
        quizItem.setChartPath("/chart");
        quizItem.setQuestionZh("question");
        quizItem.setDescriptionZh("description");

        when(quizItemMapper.insertQuizItem(quizItem)).thenReturn(1);

        Response response = target(basePath).request().post(
                Entity.entity(quizItem, MediaType.APPLICATION_JSON), Response.class);
        assertThat(response.getStatus(), is(201));

        Map result = response.readEntity(Map.class);
        assertThat((String) result.get("uri"), is(basePath + "/6"));
    }

    @Test
    public void should_return_quizItem_by_id() {
        when(quizItemMapper.getQuizItemById(2)).thenReturn(secondQuizItem);
        when(secondQuizItem.getId()).thenReturn(2);
        when(secondQuizItem.getDescriptionZh()).thenReturn("aaa");
        when(secondQuizItem.getInitializedBox()).thenReturn("zzz");
        when(secondQuizItem.getChartPath()).thenReturn("sss");
        when(secondQuizItem.getQuestionZh()).thenReturn("www");

        Response response = target(basePath + "/2").request().get();
        assertThat(response.getStatus(), is(200));

        Map result = response.readEntity(Map.class);
        assertThat((int) result.get("id"), is(2));
        assertThat((String) result.get("initializedBox"), is("zzz"));
        assertThat((String) result.get("description"), is("aaa"));
        assertThat((String) result.get("chartPath"), is("sss"));
        assertThat((String) result.get("question"), is("www"));
    }

    @Test
    public void should_return_404_when_not_quiz_item_by_id() {
        when(quizItemMapper.getQuizItemById(10)).thenReturn(null);

        Response response = target(basePath + "/10").request().get();
        assertThat(response.getStatus(), is(404));
    }

    @Test
    public void should_return_example_quiz_items() {
        Map firstItem = new HashMap();

        firstItem.put("id", 1);
        firstItem.put("initializedBox", " [0,2,7,2,1,5,7,1,4,8]");
        firstItem.put("stepsString", "step instructions");
        firstItem.put("count", 13);
        firstItem.put("question", "question english instructions");
        firstItem.put("questionZh", "question Chinese instructions");
        firstItem.put("stepsLength", 11);
        firstItem.put("maxUpdateTimes", 4);
        firstItem.put("answer", 5);
        firstItem.put("description", "english description");
        firstItem.put("descriptionZh", "chinese description");
        firstItem.put("chartPath", "logic-puzzle/17.png");
        firstItem.put("infoPath", "logic-puzzle/17.json");

        Map secondItem = new HashMap();

        secondItem.put("id", 2);
        secondItem.put("initializedBox", "[0,2,7,2,1,5,7,1,4,8]");
        secondItem.put("stepsString", "step instructions");
        secondItem.put("count", 14);
        secondItem.put("question", "question english instructions");
        secondItem.put("questionZh", "question Chinese instructions");
        secondItem.put("stepsLength", 11);
        secondItem.put("maxUpdateTimes", 4);
        secondItem.put("answer", 1);
        secondItem.put("description", "english description");
        secondItem.put("descriptionZh", "chinese description");
        secondItem.put("chartPath", "logic-puzzle/33.png");
        secondItem.put("infoPath", "logic-puzzle/33.json");

        when(quizItemMapper.getExamples()).thenReturn(Arrays.asList(firstQuizItem, secondQuizItem));
        when(firstQuizItem.toMap()).thenReturn(firstItem);
        when(secondQuizItem.toMap()).thenReturn(secondItem);

        Response response = target(basePath + "/examples").request().get();
        assertThat(response.getStatus(), is(200));

        Gson gson = new GsonBuilder().create();

        Map result = response.readEntity(Map.class);
        String jsonStr = gson.toJson(result);

        Assert.assertThat(jsonStr, is("{\"items\":["
                + "{\"question\":\"question english instructions\","
                + "\"count\":13,"
                + "\"description\":\"english description\","
                + "\"infoPath\":\"logic-puzzle/17.json\","
                + "\"stepsLength\":11,"
                + "\"maxUpdateTimes\":4,"
                + "\"descriptionZh\":\"chinese description\","
                + "\"answer\":5,"
                + "\"stepsString\":\"step instructions\","
                + "\"questionZh\":\"question Chinese instructions\","
                + "\"id\":1,"
                + "\"chartPath\":\"logic-puzzle/17.png\","
                + "\"initializedBox\":\" [0,2,7,2,1,5,7,1,4,8]\""
                + "},{"
                + "\"question\":\"question english instructions\","
                + "\"count\":14,"
                + "\"description\":\"english description\","
                + "\"infoPath\":\"logic-puzzle/33.json\","
                + "\"stepsLength\":11,"
                + "\"maxUpdateTimes\":4,"
                + "\"descriptionZh\":\"chinese description\","
                + "\"answer\":1,"
                + "\"stepsString\":\"step instructions\","
                + "\"questionZh\":\"question Chinese instructions\","
                + "\"id\":2,"
                + "\"chartPath\":\"logic-puzzle/33.png\","
                + "\"initializedBox\":\"[0,2,7,2,1,5,7,1,4,8]\""
                + "}"
                + "]}"));


    }
}