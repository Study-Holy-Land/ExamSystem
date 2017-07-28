package com.thoughtworks.twars.resource;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.thoughtworks.twars.bean.BasicBlankQuiz;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;


import java.util.HashMap;
import java.util.Map;

import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class BasicBlankQuizResourceTest extends TestBase {

    String basePath = "/basicBlankQuizzes";

    @Mock
    BasicBlankQuiz basicBlankQuiz1;

    @Mock
    BasicBlankQuiz basicBlankQuiz2;


    @Test
    public void should_insert_basic_blank_quiz() {

        BasicBlankQuiz basicBlankQuiz = new BasicBlankQuiz();

        basicBlankQuiz.setType("BASIC_BLANK_QUIZ");
        basicBlankQuiz.setDescription("这是一道填空题");
        basicBlankQuiz.setAnswer("aa");

        when(basicBlankQuizMapper.insertBasicBlankQuiz(basicBlankQuiz)).thenReturn(1);

        Response response = target(basePath).request().post(
                Entity.entity(basicBlankQuiz, MediaType.APPLICATION_JSON), Response.class);
        assertThat(response.getStatus(), is(201));

    }

    @Test
    public void should_get_basic_blank_quiz_by_id() {

        when(basicBlankQuiz1.getId()).thenReturn(1);
        when(basicBlankQuiz1.getDescription()).thenReturn("这是一道填空题");
        when(basicBlankQuiz1.getAnswer()).thenReturn("1");
        when(basicBlankQuiz1.getType()).thenReturn("BASIC_BLANK_QUIZ");


        when(basicBlankQuizMapper.getBasicBlankQuizById(1)).thenReturn(basicBlankQuiz1);

        Map result = new HashMap<>();
        result.put("description", "这是一道填空题");
        result.put("answer", "1");
        result.put("type", "BASIC_BLANK_QUIZ");

        when(basicBlankQuiz1.toMap()).thenReturn(result);


        Response response = target(basePath + "/1").request().get();
        assertThat(response.getStatus(), is(200));

        Gson gson = new GsonBuilder().create();

        Map map = response.readEntity(Map.class);
        String jsonStr = gson.toJson(map);
        assertThat(jsonStr, is("{\"answer\":\"1\","
                + "\"description\":\"这是一道填空题\","
                + "\"type\":\"BASIC_BLANK_QUIZ\"}"));
    }

    @Test
    public void should_update_basic_blank_quiz_by_id() {

        when(basicBlankQuiz2.getId()).thenReturn(1);
        when(basicBlankQuiz2.getDescription()).thenReturn("这是一道多选题");
        when(basicBlankQuiz2.getAnswer()).thenReturn("1,2");
        when(basicBlankQuiz2.getType()).thenReturn("MULTIPLE_CHOICE");

        when(basicBlankQuizMapper.updateBasicBlankQuiz(basicBlankQuiz2)).thenReturn(1);


        Map result = new HashMap<>();
        result.put("description", "这是一道多选题");
        result.put("answer", "1,2");
        result.put("type", "MULTIPLE_CHOICE");
        result.put("id", 1);


        Response response = target(basePath + "/1").request().put(
                Entity.entity(result, MediaType.APPLICATION_JSON), Response.class);
        assertThat(response.getStatus(), is(204));

    }
}
