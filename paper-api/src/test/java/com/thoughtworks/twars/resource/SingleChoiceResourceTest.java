package com.thoughtworks.twars.resource;


import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.thoughtworks.twars.bean.SingleChoice;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;


import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class SingleChoiceResourceTest extends TestBase {

    String basePath = "/singleChoices";

    @Mock
    SingleChoice singleChoice1;

    @Mock
    SingleChoice singleChoice2;


    @Test
    public void should_insert_single_choice() {

        SingleChoice singleChoice = new SingleChoice();

        singleChoice.setType("SINGLE_CHOICE");
        singleChoice.setDescription("这是一道单选题");
        singleChoice.setOptions("aa,bb,cc,dd");
        singleChoice.setAnswer("aa");

        when(singleChoiceMapper.insertSingleChoice(singleChoice)).thenReturn(1);

        Response response = target(basePath).request().post(
                Entity.entity(singleChoice, MediaType.APPLICATION_JSON), Response.class);
        assertThat(response.getStatus(), is(201));

    }

    @Test
    public void should_get_single_choice_by_id() {
        when(singleChoice1.getId()).thenReturn(1);
        when(singleChoice1.getOptions()).thenReturn("1,2,3,4");
        when(singleChoice1.getDescription()).thenReturn("这是一道单选题");
        when(singleChoice1.getAnswer()).thenReturn("1");
        when(singleChoice1.getType()).thenReturn("SINGLE_CHOICE");


        when(singleChoiceMapper.getSingleChoiceById(1)).thenReturn(singleChoice1);
        Map result = new HashMap<>();
        result.put("options", "1,2,3,4");
        result.put("description", "这是一道单选题");
        result.put("answer", "1");
        result.put("type", "SINGLE_CHOICE");

        when(singleChoice1.toMap()).thenReturn(result);


        Response response = target(basePath + "/1").request().get();
        assertThat(response.getStatus(), is(200));

        Gson gson = new GsonBuilder().create();

        Map map = response.readEntity(Map.class);
        String jsonStr = gson.toJson(map);
        assertThat(jsonStr, is("{\"answer\":\"1\","
                + "\"options\":\"1,"
                + "2,"
                + "3,"
                + "4\","
                + "\"description\":\"这是一道单选题\","
                + "\"type\":\"SINGLE_CHOICE\"}"));
    }

    @Test
    public void should_update_single_choice_by_id() {

        when(singleChoice2.getId()).thenReturn(1);
        when(singleChoice2.getOptions()).thenReturn("1,2,3,4");
        when(singleChoice2.getDescription()).thenReturn("这是一道多选题");
        when(singleChoice2.getAnswer()).thenReturn("1,2");
        when(singleChoice2.getType()).thenReturn("MULTIPLE_CHOICE");

        when(singleChoiceMapper.updateSingleChoice(singleChoice2)).thenReturn(1);


        Map result = new HashMap<>();
        result.put("options", "1,2,3,4");
        result.put("description", "这是一道多选题");
        result.put("answer", "1,2");
        result.put("type", "MULTIPLE_CHOICE");
        result.put("id", 1);


        Response response = target(basePath + "/1").request().put(
                Entity.entity(result, MediaType.APPLICATION_JSON), Response.class);
        assertThat(response.getStatus(), is(204));

    }
}
