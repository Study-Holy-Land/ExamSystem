package com.thoughtworks.twars.resource;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.thoughtworks.twars.bean.HomeworkQuiz;
import com.thoughtworks.twars.bean.HomeworkQuizOperation;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class HomeworkQuizResourceTest extends TestBase {
    @Mock
    HomeworkQuiz homeworkQuiz;
    @Mock
    HomeworkQuiz homeworkQuiz01;


    String basePath = "homeworkQuizzes";


    @Test
    public void should_return_one_homework_quiz() {
        when(homeworkQuizMapper.findById(1)).thenReturn(homeworkQuiz);
        when(homeworkQuiz.getMakerId()).thenReturn(1);
        when(homeworkQuiz.getDescription()).thenReturn("这是一道比较简单的题目");
        when(homeworkQuiz.getEvaluateScript()).thenReturn("www.baidu.com");
        when(homeworkQuiz.getTemplateRepository()).thenReturn("templateRepository");
        when(homeworkQuiz.getAnswerPath()).thenReturn("/homework-answer/check-readme");

        Map h1 = new HashMap();
        h1.put("id", 1);
        h1.put("makerId", 1);
        h1.put("description", "这是一道比较简单的题目");
        h1.put("evaluateScript", "www.baidu.com");
        h1.put("templateRepository", "templateRepository");
        h1.put("answerPath", "homework-answer/check-readme");
        h1.put("makerDetailUri", "users/1/detail");


        when(homeworkQuiz.toMap()).thenReturn(h1);

        Response response = target(basePath + "/1").request().get();
        assertThat(response.getStatus(), is(200));

        Map item = response.readEntity(Map.class);
        assertThat(item.get("id"), is(1));
        assertThat(item.get("makerId"), is(1));
        assertThat(item.get("makerDetailUri"), is("users/1/detail"));
        assertThat(item.get("description"), is("这是一道比较简单的题目"));
        assertThat(item.get("evaluateScript"), is("www.baidu.com"));
        assertThat(item.get("templateRepository"), is("templateRepository"));
        assertThat(item.get("answerPath"), is("homework-answer/check-readme"));
    }

    @Test
    public void should_return_homework_quiz_List_by_ids() {
        when(homeworkQuizMapper.findById(1)).thenReturn(homeworkQuiz);

        when(homeworkQuiz.getMakerId()).thenReturn(1);
        when(homeworkQuiz.getDescription()).thenReturn("这是一道比较简单的题目");
        when(homeworkQuiz.getEvaluateScript()).thenReturn("www.baidu.com");
        when(homeworkQuiz.getTemplateRepository()).thenReturn("templateRepository");
        when(homeworkQuiz.getAnswerPath()).thenReturn("homework-answer/check-readme");
        when(homeworkQuiz.getStackId()).thenReturn(1);

        Map h1 = new HashMap();
        h1.put("id", 1);
        h1.put("makerId", 1);
        h1.put("description", "这是一道比较简单的题目");
        h1.put("evaluateScript", "www.baidu.com");
        h1.put("templateRepository", "templateRepository");
        h1.put("answerPath", "homework-answer/check-readme");
        h1.put("makerDetailUri", "users/1/detail");

        when(homeworkQuiz.toMap()).thenReturn(h1);

        when(homeworkQuizMapper.findById(2)).thenReturn(homeworkQuiz01);

        when(homeworkQuiz01.getMakerId()).thenReturn(2);
        when(homeworkQuiz01.getDescription()).thenReturn("这是一道普通难度的题目");
        when(homeworkQuiz01.getEvaluateScript()).thenReturn("www.talkop.com");
        when(homeworkQuiz01.getTemplateRepository()).thenReturn("talkopRepository");
        when(homeworkQuiz01.getAnswerPath()).thenReturn("homework-answer/calculate_median");
        when(homeworkQuiz01.getStackId()).thenReturn(2);

        Map h2 = new HashMap();
        h2.put("id", 2);
        h2.put("makerId", 2);
        h2.put("description", "这是一道普通难度的题目");
        h2.put("evaluateScript", "www.talkop.com");
        h2.put("templateRepository", "talkopRepository");
        h2.put("answerPath", "homework-answer/calculate_median");
        h2.put("makerDetailUri", "users/2/detail");

        when(homeworkQuiz01.toMap()).thenReturn(h2);

        Response response = target(basePath + "/1,2").request().get();
        assertThat(response.getStatus(), is(200));

        Gson gson = new GsonBuilder().create();
        Map result = response.readEntity(Map.class);
        String jsonStr = gson.toJson(result);
        assertThat(jsonStr, is("{\"homeworkQuizzes\":[{\"evaluateScript\":\"www.baidu.com\","
                + "\"templateRepository\":\"templateRepository\","
                + "\"description\":\"这是一道比较简单的题目\","
                + "\"id\":1,"
                + "\"answerPath\":\"homework-answer/check-readme\","
                + "\"makerDetailUri\":\"users/1/detail\","
                + "\"makerId\":1},"
                + "{\"evaluateScript\":\"www.talkop.com\","
                + "\"templateRepository\":\"talkopRepository\","
                + "\"description\":\"这是一道普通难度的题目\","
                + "\"id\":2,"
                + "\"answerPath\":\"homework-answer/calculate_median\","
                + "\"makerDetailUri\":\"users/2/detail\","
                + "\"makerId\":2}]}"));
    }

    @Test
    public void should_return_homework_quiz_by_id() {
        when(homeworkQuizMapper.findById(1)).thenReturn(homeworkQuiz);
        when(homeworkQuiz.getDescription()).thenReturn("这是一道比较简单的题目");
        when(homeworkQuiz.getEvaluateScript()).thenReturn("www.baidu.com");
        when(homeworkQuiz.getTemplateRepository()).thenReturn("templateRepository");
        when(homeworkQuiz.getAnswerPath()).thenReturn("homework-answer/check-readme");
        when(homeworkQuiz.getStackId()).thenReturn(1);
        when(homeworkQuiz.getMakerId()).thenReturn(1);

        Map h1 = new HashMap();
        h1.put("id", 1);
        h1.put("makerId", 1);
        h1.put("stackId", 1);
        h1.put("description", "这是一道比较简单的题目");
        h1.put("evaluateScript", "www.baidu.com");
        h1.put("templateRepository", "templateRepository");
        h1.put("answerPath", "homework-answer/check-readme");
        h1.put("makerDetailUri", "users/1/detail");

        when(homeworkQuiz.toMap()).thenReturn(h1);
        Response response = target("homeworkQuizzes/1").request().get();

        assertThat(response.getStatus(), is(200));

        Map item = response.readEntity(Map.class);

        assertThat(item.get("id"), is(1));
        assertThat(item.get("makerDetailUri"), is("users/1/detail"));
        assertThat(item.get("description"), is("这是一道比较简单的题目"));
        assertThat(item.get("evaluateScript"), is("www.baidu.com"));
        assertThat(item.get("templateRepository"), is("templateRepository"));
        assertThat(item.get("answerPath"), is("homework-answer/check-readme"));
        assertThat(item.get("stackId"), is(1));
        assertThat(item.get("makerId"), is(1));
    }

    @Test
    public void should_return_all_homework_quiz_List() {
        when(homeworkQuiz.getMakerId()).thenReturn(1);
        when(homeworkQuiz.getDescription()).thenReturn("这是一道比较简单的题目");
        when(homeworkQuiz.getEvaluateScript()).thenReturn("www.baidu.com");
        when(homeworkQuiz.getTemplateRepository()).thenReturn("templateRepository");
        when(homeworkQuiz.getAnswerPath()).thenReturn("/homework-answer/check-readme");
        when(homeworkQuiz.getStackId()).thenReturn(2);

        Map h1 = new HashMap();
        h1.put("makerId", 1);
        h1.put("description", "这是一道比较简单的题目");
        h1.put("evaluateScript", "www.baidu.com");
        h1.put("templateRepository", "templateRepository");
        h1.put("answerPath", "/homework-answer/check-readme");
        h1.put("stackId", 2);
        h1.put("makerDetailUri", "users/1/detail");

        when(homeworkQuiz.toMap()).thenReturn(h1);

        when(homeworkQuiz01.getMakerId()).thenReturn(2);
        when(homeworkQuiz01.getDescription()).thenReturn("这是一道普通难度的题目");
        when(homeworkQuiz01.getEvaluateScript()).thenReturn("www.talkop.com");
        when(homeworkQuiz01.getTemplateRepository()).thenReturn("talkopRepository");
        when(homeworkQuiz01.getAnswerPath()).thenReturn("/homework-answer/check-readme");
        when(homeworkQuiz01.getStackId()).thenReturn(2);

        Map h2 = new HashMap();
        h2.put("makerId", 2);
        h2.put("description", "这是一道普通难度的题目");
        h2.put("evaluateScript", "www.talkop.com");
        h2.put("templateRepository", "talkopRepository");
        h2.put("answerPath", "/homework-answer/check-readme");
        h2.put("stackId", 2);
        h2.put("makerDetailUri", "users/2/detail");
        when(homeworkQuiz01.toMap()).thenReturn(h2);


        when(homeworkQuizMapper.findHomeworkQuizzes(null, null, 0, 15))
                .thenReturn(Arrays.asList(homeworkQuiz, homeworkQuiz01));

        Response response = target(basePath).request().get();

        assertThat(response.getStatus(), is(200));

        Gson gson = new GsonBuilder().create();

        Map result = response.readEntity(Map.class);
        String jsonStr = gson.toJson(result);
        assertThat(jsonStr, is("{\"homeworkQuizzes\":[{\"evaluateScript\":\"www.baidu.com\","
                + "\"templateRepository\":\"templateRepository\","
                + "\"stackId\":2,"
                + "\"description\":\"这是一道比较简单的题目\","
                + "\"answerPath\":\"/homework-answer/check-readme\","
                + "\"makerDetailUri\":\"users/1/detail\","
                + "\"makerId\":1},"
                + "{\"evaluateScript\":\"www.talkop.com\","
                + "\"templateRepository\":\"talkopRepository\","
                + "\"stackId\":2,"
                + "\"description\":\"这是一道普通难度的题目\","
                + "\"answerPath\":\"/homework-answer/check-readme\","
                + "\"makerDetailUri\":\"users/2/detail\","
                + "\"makerId\":2}]}"
        ));
    }

    @Test
    public void should_return_homework_quiz_uri() {

        HomeworkQuiz homeworkQuiz = new HomeworkQuiz();

        homeworkQuiz.setDescription("description");
        homeworkQuiz.setEvaluateScript("evaluateScript.sh");
        homeworkQuiz.setTemplateRepository("http://github.com/templateRepository");
        homeworkQuiz.setMakerId(1);
        homeworkQuiz.setHomeworkName("homeworkName");
        homeworkQuiz.setAnswerPath("/homework-answer/calculate_median");

        when(homeworkQuizMapper.insertHomeworkQuiz(homeworkQuiz)).thenReturn(1);

        Map map = new HashMap();

        map.put("description", "miaoshu");
        map.put("evaluateScript", "ceshi ");
        map.put("templateRepository", "http://github.com/templateRepository");
        map.put("makerId", 1);
        map.put("homeworkName", "homeworkName");
        map.put("createTime", 123456);
        map.put("answerPath", "/homework-answer/calculate_median");

        Entity entity = Entity.entity(map, MediaType.APPLICATION_JSON);

        Response response = target(basePath).request().post(entity);

        MatcherAssert.assertThat(response.getStatus(), is(201));
        Map result = response.readEntity(Map.class);

        MatcherAssert.assertThat(result.size(), is(1));
    }

    @Test
    public void should_return_204_when_delete_homework_quiz() {

        when(homeworkQuizMapper.findById(1)).thenReturn(homeworkQuiz);
        HomeworkQuizOperation hqo = mock(HomeworkQuizOperation.class);

        when(homeworkQuizOperationMapper
                .insertHomeworkQuizOperation(hqo)).thenReturn(1);

        Map map = new HashMap();

        map.put("operationType", "DELETE");
        map.put("operatorId", 1);
        map.put("createTime", 123456);
        map.put("homeworkQuizId", 1);

        Entity entity = Entity.entity(map, MediaType.APPLICATION_JSON);

        Response response = target(basePath + "/1").request().put(entity);
        MatcherAssert.assertThat(response.getStatus(), is(204));
    }
}


