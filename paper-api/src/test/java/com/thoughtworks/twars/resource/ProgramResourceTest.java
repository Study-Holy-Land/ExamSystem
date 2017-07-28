package com.thoughtworks.twars.resource;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.thoughtworks.twars.bean.Paper;
import com.thoughtworks.twars.bean.PaperAndOperation;
import com.thoughtworks.twars.bean.Program;
import com.thoughtworks.twars.bean.Section;
import org.junit.Assert;
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
public class ProgramResourceTest extends TestBase {
    String basePath = "/programs";

    @Mock
    Paper paper;

    @Mock
    PaperAndOperation firstPaper;

    @Mock
    PaperAndOperation secondPaper;


    @Mock
    Program firstProgram;

    @Mock
    Program secondProgram;


    @Test
    public void should_list_all_papers() throws Exception {

        when(paperMapper.getOnePaper(2)).thenReturn(paper);

        when(paper.getProgramId()).thenReturn(1);

        Section section1 = new Section();
        section1.setId(1);
        section1.setDescription("just a test");
        section1.setType("blankQuizzes");

        List<Section> sections = new ArrayList();

        sections.add(section1);

        Section section2 = new Section();
        section2.setId(2);
        section2.setDescription("just a test 2");
        section2.setType("homeworkQuizzes");

        sections.add(section2);

        when(paper.getSections()).thenReturn(sections);

        Response response = target(basePath + "/1/papers/2").request().get();

        assertThat(response.getStatus(), is(200));

    }

    @Test
    public void should_list_all_papers_by_programId() throws Exception {

        when(paperAndOperationMapper.findPapersByProgramId(6))
                .thenReturn(Arrays.asList(firstPaper, secondPaper));

        when(firstPaper.getPaperId()).thenReturn(1);
        when(firstPaper.getPaperName()).thenReturn("简单的试卷");
        when(firstPaper.getDescription()).thenReturn("easy");
        when(firstPaper.getCreateTime()).thenReturn(1111111);
        when(firstPaper.getMakerId()).thenReturn(3);
        when(firstPaper.getOperatorId()).thenReturn(3);
        when(firstPaper.getOperationId()).thenReturn(2);
        when(firstPaper.getOperationType()).thenReturn("DISTRIBUTION");

        Map data = new HashMap();
        data.put("id", 1);
        data.put("paperName", "简单的试卷");
        data.put("description", "easy");
        data.put("createTime", 1111111);
        data.put("makerId", 3);
        data.put("uri", "/papers/1");
        data.put("operatorId", 3);
        data.put("operationId", 2);
        data.put("operationType", "DISTRIBUTION");

        when(firstPaper.toMap()).thenReturn(data);

        when(secondPaper.getPaperId()).thenReturn(5);
        when(secondPaper.getPaperName()).thenReturn("普通的试卷");
        when(secondPaper.getDescription()).thenReturn("common");
        when(secondPaper.getCreateTime()).thenReturn(2222222);
        when(secondPaper.getMakerId()).thenReturn(2);
        when(secondPaper.getOperationId()).thenReturn(1);
        when(secondPaper.getOperatorId()).thenReturn(2);
        when(secondPaper.getOperationType()).thenReturn("UNDISTRIBUTION");


        Map m2 = new HashMap();
        m2.put("id", 1);
        m2.put("paperName", "简单的试卷");
        m2.put("description", "easy");
        m2.put("createTime", 1111111);
        m2.put("makerId", 3);
        m2.put("uri", "/papers/1");
        m2.put("operatorId", 2);
        m2.put("operationId", 1);
        m2.put("operationType", "UNDISTRIBUTION");

        when(secondPaper.toMap()).thenReturn(m2);

        Response response = target(basePath + "/6/papers").request().get();
        Assert.assertThat(response.getStatus(), is(200));

        Gson gson = new GsonBuilder().create();

        Map result = response.readEntity(Map.class);
        String jsonStr = gson.toJson(result);
        Assert.assertThat(jsonStr, is("{\"paperList\":[{"
                + "\"createTime\":1111111,"
                + "\"paperName\":\"简单的试卷\","
                + "\"description\":\"easy\","
                + "\"operationId\":2,"
                + "\"operationType\":\"DISTRIBUTION\","
                + "\"id\":1,"
                + "\"uri\":\"/papers/1\","
                + "\"operatorId\":3,"
                + "\"makerId\":3},"
                + "{"
                + "\"createTime\":1111111,"
                + "\"paperName\":\"简单的试卷\","
                + "\"description\":\"easy\","
                + "\"operationId\":1,"
                + "\"operationType\":\"UNDISTRIBUTION\","
                + "\"id\":1,"
                + "\"uri\":\"/papers/1\","
                + "\"operatorId\":2,"
                + "\"makerId\":3}]}"));
    }

    @Test
    public void should_create_papers() throws Exception {

        Map data = new HashMap();
        data.put("makerId", 1);
        data.put("createTime", 111111);
        data.put("programId", 1);
        data.put("paperName", "paperName");
        data.put("description", "paper desc");

        List sections = new ArrayList();
        data.put("sections", sections);

        Map sectionOne = new HashMap();
        Map sectionTwo = new HashMap();
        sections.add(sectionOne);
        sections.add(sectionTwo);

        sectionOne.put("type", "blankQuizzes");
        sectionOne.put("description", "blankQuizzes description");

        Map itemsOne = new HashMap();
        sectionOne.put("items", itemsOne);
        itemsOne.put("easyCount", 1);
        itemsOne.put("normalCount", 1);
        itemsOne.put("hardCount", 1);
        itemsOne.put("exampleCount", 1);

        sectionTwo.put("type", "homeworkQuizzes");
        sectionTwo.put("description", "blankQuizzes description");

        List itemsTwo = new ArrayList();
        sectionTwo.put("items", itemsTwo);

        Map homeworkOne = new HashMap();
        homeworkOne.put("id", 1);
        homeworkOne.put("uri", "homeworkQuizzes/1");

        Map homeworkTwo = new HashMap();
        homeworkTwo.put("id", 2);
        homeworkTwo.put("uri", "homeworkQuizzes/2");

        itemsTwo.add(homeworkOne);
        itemsTwo.add(homeworkTwo);

        Entity entity = Entity.entity(data, MediaType.APPLICATION_JSON_TYPE);
        Response response = target(basePath + "/1/papers").request().post(entity);

        assertThat(response.getStatus(), is(201));

    }

    @Test
    public void should_return_users_uri_by_program_id() throws Exception {

        when(programMapper.findUsersIdByProgramId(1))
                .thenReturn(Arrays.asList(1, 2, 3));
        Response response = target(basePath + "/1/users").request().get();

        assertThat(response.getStatus(), is(200));
        Gson gson = new GsonBuilder().create();

        Map result = response.readEntity(Map.class);
        String jsonStr = gson.toJson(result);
        Assert.assertThat(jsonStr, is("{"
                + "\"usersUri\":[\"users/1\",\"users/2\",\"users/3\"]}"));
    }

    @Test
    public void should_list_all_programs() throws Exception {

        when(firstProgram.getId()).thenReturn(1);
        when(firstProgram.getName()).thenReturn("111");
        when(secondProgram.getId()).thenReturn(2);
        when(secondProgram.getName()).thenReturn("222");

        Map m1 = new HashMap();
        m1.put("id", 1);
        m1.put("name", "111");

        Map m2 = new HashMap();
        m2.put("id", 2);
        m2.put("name", "222");
        when(firstProgram.toMap()).thenReturn(m1);
        when(secondProgram.toMap()).thenReturn(m2);

        when(programMapper.getAllPrograms(0, 15))
                .thenReturn(Arrays.asList(firstProgram, secondProgram));

        Response response = target("/programs").request().get();
        assertThat(response.getStatus(), is(200));

        Gson gson = new GsonBuilder().create();

        Map result = response.readEntity(Map.class);
        String jsonStr = gson.toJson(result);

        Assert.assertThat(jsonStr, is("{\"programs\":"
                + "[{\"name\":\"111\",\"id\":1},"
                + "{\"name\":\"222\",\"id\":2}]}"));
    }

    @Test
    public void should_insert_programs() {

        Map data = new HashMap();
        data.put("name", "五年级");
        data.put("uriEnable", false);

        Entity entityProgram = Entity.entity(data,
                MediaType.APPLICATION_JSON_TYPE);
        Response response = target(basePath).request().post(
                entityProgram);

        Assert.assertThat(response.getStatus(), is(201));
    }

    @Test
    public void should_update_programs_by_id() throws Exception {

        Map data = new HashMap();
        data.put("name", "五年级");
        data.put("uriEnable", false);

        Entity entityProgram = Entity.entity(data,
                MediaType.APPLICATION_JSON_TYPE);
        Response response = target(basePath + "/1").request().put(
                entityProgram);

        Assert.assertThat(response.getStatus(), is(204));
    }
}

