package com.thoughtworks.twars.resource;


import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.thoughtworks.twars.bean.MultipleChoice;
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
public class MultipleChoiceResourceTest extends TestBase {

    String basePath = "/multipleChoices";

    @Mock
    MultipleChoice multipleChoice1;

    @Mock
    MultipleChoice multipleChoice2;

    @Test
    public void should_insert_multiple_choice() {

        MultipleChoice multipleChoice = new MultipleChoice();

        multipleChoice.setType("MULTIPLE_CHOICE");
        multipleChoice.setDescription("这是一道多选题");
        multipleChoice.setOptions("aa,bb,cc,dd");
        multipleChoice.setAnswer("aa,bb");

        when(multipleChoiceMapper.insertMultipleChoice(multipleChoice)).thenReturn(1);

        Response response = target(basePath).request().post(
                Entity.entity(multipleChoice, MediaType.APPLICATION_JSON), Response.class);
        assertThat(response.getStatus(), is(201));


    }


    @Test
    public void should_get_multiple_choice_by_id() {
        when(multipleChoice1.getId()).thenReturn(1);
        when(multipleChoice1.getOptions()).thenReturn("1,2,3,4");
        when(multipleChoice1.getDescription()).thenReturn("这是一道单选题");
        when(multipleChoice1.getAnswer()).thenReturn("1,2");
        when(multipleChoice1.getType()).thenReturn("SINGLE_CHOICE");


        when(multipleChoiceMapper.getMultipleChoiceById(1)).thenReturn(multipleChoice1);
        Map result = new HashMap<>();
        result.put("options", "1,2,3,4");
        result.put("description", "这是一道单选题");
        result.put("answer", "1,2");
        result.put("type", "SINGLE_CHOICE");

        when(multipleChoice1.toMap()).thenReturn(result);


        Response response = target(basePath + "/1").request().get();
        assertThat(response.getStatus(), is(200));

        Gson gson = new GsonBuilder().create();

        Map map = response.readEntity(Map.class);
        String jsonStr = gson.toJson(map);
        assertThat(jsonStr, is("{\"answer\":\"1,2\""
                + ",\"options\":\"1"
                + ",2"
                + ",3"
                + ",4\""
                + ",\"description\":\"这是一道单选题\""
                + ",\"type\":\"SINGLE_CHOICE\"}"));
    }

    @Test
    public void should_update_multiple_choice_by_id() {

        when(multipleChoice2.getId()).thenReturn(1);
        when(multipleChoice2.getOptions()).thenReturn("1,2,3,4");
        when(multipleChoice2.getDescription()).thenReturn("这是一道多选题");
        when(multipleChoice2.getAnswer()).thenReturn("1,2");
        when(multipleChoice2.getType()).thenReturn("MULTIPLE_CHOICE");

        when(multipleChoiceMapper.updateMultipleChoice(multipleChoice2)).thenReturn(1);


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
