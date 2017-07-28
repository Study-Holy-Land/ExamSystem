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

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.anyInt;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class RelationshipCreatingResourceTest extends TestBase {

    String basePath = "/relationshipCreating";

    @Test
    public void should_return_201_when_create_relationship_with_mentor() throws Exception {

        when(userMapper.insertStudentMentor(3, 6)).thenReturn(1);
        Entity entity = Entity.entity("", MediaType.APPLICATION_JSON);
        Response response = target(basePath + "/3/students/6").request().post(entity);
        assertThat(response.getStatus(), is(201));
    }
}



