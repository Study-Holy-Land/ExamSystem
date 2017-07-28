package com.thoughtworks.twars.resource;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.thoughtworks.twars.bean.Stack;
import org.junit.Assert;
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

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.mockito.Mockito.when;


@RunWith(MockitoJUnitRunner.class)
public class StackResourceTest extends TestBase {
    String basePath = "/stacks";

    @Mock
    Stack stack;

    @Mock
    Stack stackOne;

    @Mock
    Stack stackTwo;

    @Test
    public void should_return_all_stack() throws Exception {
        when(stackOne.getStackId()).thenReturn(1);
        when(stackOne.getTitle()).thenReturn("C#");
        when(stackOne.getDescription()).thenReturn("这是C#");
        when(stackOne.getDefinition()).thenReturn("./aa/bb/cc");
        when(stackTwo.getStackId()).thenReturn(2);
        when(stackTwo.getTitle()).thenReturn("java");
        when(stackTwo.getDescription()).thenReturn("./xx/yy/zz");

        Map m1 = new HashMap();
        m1.put("stackId", 1);
        m1.put("title", "C#");
        m1.put("description", "这是C#");
        m1.put("definitionFile", "./aa/bb/cc");

        Map m2 = new HashMap();
        m2.put("stackId", 2);
        m2.put("title", "java");
        m2.put("description", "这是Java");
        m2.put("definitionFile", "./xx/yy/zz");

        when(stackOne.toMap()).thenReturn(m1);
        when(stackTwo.toMap()).thenReturn(m2);

        when(stackMapper.getAllStack())
                .thenReturn(Arrays.asList(stackOne, stackTwo));

        Response response = target(basePath).request().get();
        assertThat(response.getStatus(), is(200));

        Gson gson = new GsonBuilder().create();

        Map result = response.readEntity(Map.class);
        String jsonStr = gson.toJson(result);

        Assert.assertThat(jsonStr, is("{\"items\":[{\"definitionFile\":\"./aa/bb/cc\","
                + "\"stackId\":1,"
                + "\"description\":\"这是C#\","
                + "\"title\":\"C#\"},"
                + "{\"definitionFile\":\"./xx/yy/zz\","
                + "\"stackId\":2,"
                + "\"description\":\"这是Java\","
                + "\"title\":\"java\"}]}"
        ));
    }

    @Test
    public void should_add_stack() {
        Stack stack = new Stack();

        stack.setStackId(4);
        stack.setTitle("Scala");
        stack.setDescription("这是Scala技术栈");
        stack.setDefinition("scala:2.12");

        Entity<Stack> entityStack = Entity.entity(stack, MediaType.APPLICATION_JSON_TYPE);
        Response response = target(basePath).request().post(entityStack);

        assertThat(response.getStatus(), is(201));

        Map result = response.readEntity(Map.class);
        assertThat(result.get("stackId"), is(4));
        assertThat(result.get("uri"), is("stack/4"));
    }

    @Test
    public void should_return_a_stack() {
        when(stackMapper.getStackById(2)).thenReturn(stack);

        when(stack.getStackId()).thenReturn(2);
        when(stack.getTitle()).thenReturn("Java");
        when(stack.getDescription()).thenReturn("这是Java技术栈");
        when(stack.getDefinition()).thenReturn("jetty:9.3");

        Map m1 = new HashMap();
        m1.put("stackId", 2);
        m1.put("title", "Java");
        m1.put("description", "这是Java技术栈");
        m1.put("definitionFile", "jetty:9.3");

        when(stack.toMap()).thenReturn(m1);

        Response response = target(basePath + "/2").request().get();

        assertThat(response.getStatus(), is(200));
        Gson gson = new GsonBuilder().create();

        Map result = response.readEntity(Map.class);
        String jsonStr = gson.toJson(result);

        Assert.assertThat(jsonStr,is("{\"definitionFile\":\"jetty:9.3\""
                + ",\"stackId\":2"
                + ",\"description\":\"这是Java技术栈\""
                + ",\"title\":\"Java\"}"));
    }

    @Test
    public void should_return_404_when_get_stack() {
        when(stackMapper.getStackById(90)).thenReturn(null);

        Response response = target(basePath + "/90").request().get();
        assertThat(response.getStatus(), is(404));
    }
}

