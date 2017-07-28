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
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class PaperResourceTest extends TestBase {

    String basePath = "/papers";

    @Mock
    Section firstSection;

    @Mock
    Section secondSection;

    @Mock
    Paper firstPaper;

    @Mock
    Paper secondPaper;

    @Mock
    BlankQuiz firstBlankQuiz;

    @Mock
    HomeworkQuiz firstHomeworkQuiz;

    @Mock
    List list;

    @Mock
    PaperOperation paperOperation;

    @Mock
    Paper paper;

    @Test
    public void should_list_all_papers_by_page_and_pageSize() throws Exception {

        when(paperMapper.getAllPapers(0, 2)).thenReturn(Arrays.asList(firstPaper, secondPaper));
        when(paperMapper.findAll()).thenReturn(list);
        when(list.size()).thenReturn(2);

        when(firstPaper.getId()).thenReturn(1);
        when(firstPaper.getPaperName()).thenReturn("简单的试卷");
        when(firstPaper.getDescription()).thenReturn("easy");
        when(firstPaper.getCreateTime()).thenReturn(1111111);
        when(firstPaper.getMakerId()).thenReturn(3);

        Map m1 = new HashMap();
        m1.put("uri", "papers/1");
        m1.put("paperName", "简单的试卷");
        m1.put("description", "easy");
        m1.put("createTime", "1111111");
        m1.put("makerId", 3);

        when(firstPaper.getPapersInfo()).thenReturn(m1);

        when(secondPaper.getId()).thenReturn(5);
        when(secondPaper.getPaperName()).thenReturn("普通的试卷");
        when(secondPaper.getDescription()).thenReturn("common");
        when(secondPaper.getCreateTime()).thenReturn(2222222);
        when(secondPaper.getMakerId()).thenReturn(2);

        Map m2 = new HashMap();
        m2.put("uri", "papers/5");
        m2.put("paperName", "普通的试卷");
        m2.put("description", "common");
        m2.put("createTime", "2222222");
        m2.put("makerId", 2);

        when(secondPaper.getPapersInfo()).thenReturn(m2);

        Response response = target(basePath).queryParam("page", 1)
                .queryParam("pageSize", 2).request().get();
        assertThat(response.getStatus(), is(200));

        Gson gson = new GsonBuilder().create();

        Map result = response.readEntity(Map.class);
        String jsonStr = gson.toJson(result);
        System.out.println(jsonStr);

        assertThat(jsonStr, is("{\"paperInfo\":[{"
                + "\"createTime\":\"1111111\","
                + "\"paperName\":\"简单的试卷\","
                + "\"description\":\"easy\","
                + "\"uri\":\"papers/1\","
                + "\"makerId\":3},"
                + "{\"createTime\":\"2222222\","
                + "\"paperName\":\"普通的试卷\","
                + "\"description\":\"common\","
                + "\"uri\":\"papers/5\","
                + "\"makerId\":2}],"
                + "\"paperCount\":2}"));
    }

    @Test
    public void should_list_all_papers_by_page_0_and_pageSize_15() throws Exception {

        when(paperMapper.getAllPapers(0, 15)).thenReturn(Arrays.asList(firstPaper, secondPaper));
        when(paperMapper.findAll()).thenReturn(list);
        when(list.size()).thenReturn(2);
        when(firstPaper.getId()).thenReturn(1);
        when(firstPaper.getPaperName()).thenReturn("简单的试卷");
        when(firstPaper.getDescription()).thenReturn("easy");
        when(firstPaper.getCreateTime()).thenReturn(1111111);
        when(firstPaper.getMakerId()).thenReturn(3);

        Map m1 = new HashMap();
        m1.put("uri", "papers/1");
        m1.put("paperName", "简单的试卷");
        m1.put("description", "easy");
        m1.put("createTime", "1111111");
        m1.put("makerId", 3);

        when(firstPaper.getPapersInfo()).thenReturn(m1);

        when(secondPaper.getId()).thenReturn(5);
        when(secondPaper.getPaperName()).thenReturn("普通的试卷");
        when(secondPaper.getDescription()).thenReturn("common");
        when(secondPaper.getCreateTime()).thenReturn(2222222);
        when(secondPaper.getMakerId()).thenReturn(2);


        Map m2 = new HashMap();
        m2.put("uri", "papers/1");
        m2.put("paperName", "简单的试卷");
        m2.put("description", "easy");
        m2.put("createTime", "1111111");
        m2.put("makerId", 3);
        when(secondPaper.getPapersInfo()).thenReturn(m2);

        Response response = target(basePath).request().get();
        assertThat(response.getStatus(), is(200));

        Gson gson = new GsonBuilder().create();

        Map result = response.readEntity(Map.class);
        String jsonStr = gson.toJson(result);

        assertThat(jsonStr, is("{\"paperInfo\":[{"
                + "\"createTime\":\"1111111\""
                + ",\"paperName\":\"简单的试卷\""
                + ",\"description\":\"easy\""
                + ",\"uri\":\"papers/1\""
                + ",\"makerId\":3}"
                + ",{"
                + "\"createTime\":\"1111111\""
                + ",\"paperName\":\"简单的试卷\""
                + ",\"description\":\"easy\""
                + ",\"uri\":\"papers/1\""
                + ",\"makerId\":3}]"
                + ",\"paperCount\":2}"));
    }

    @Test
    public void should_return_404_when_request_one_paper() throws Exception {

        when(paperMapper.getOnePaper(3)).thenReturn(null);

        Response response = target(basePath + "/3").request().get();
        assertThat(response.getStatus(), is(404));
    }


    @Test
    public void should_return_uri_when_request_enrollment() throws Exception {

        Paper paper = new Paper();
        when(paperMapper.getOnePaper(1)).thenReturn(paper);

        Map map1 = new HashMap();
        map1.put("quizId", 1);
        map1.put("quizType", "singleChoices");

        Map map2 = new HashMap();
        map2.put("quizId", 1);
        map2.put("quizType", "multipleChoices");

        List<Map> quizzes = new ArrayList<>();
        quizzes.add(map1);
        quizzes.add(map2);
        Section section = new Section();
        section.setId(3);
        section.setDescription("it is a description!");
        section.setPaperId(1);
        section.setQuizzes(quizzes);
        section.setType("basicQuizzes");

        List<Section> sections = new ArrayList<>();
        sections.add(section);
        paper.setId(1);
        paper.setMakerId(2);
        paper.setSections(sections);
        Map responseInfoSections = new HashMap<>();
        responseInfoSections.put("sections", sections);

        Response response = target(basePath + "/enrollment").request().get();

        Gson gson = new GsonBuilder().create();

        assertThat(response.getStatus(), is(200));
        Map result = response.readEntity(Map.class);
        String jsonStr = gson.toJson(result);

        assertThat(jsonStr, is("{\"id\":1,"
                + "\"sections\":[{\"description\":\"it is a description!\","
                + "\"id\":3,"
                + "\"quizzes\":[{\"definition_uri\":\"singleChoices/1\","
                + "\"id\":1},"
                + "{\"definition_uri\":\"multipleChoices/1\","
                + "\"id\":1}],"
                + "\"sectionType\":\"basicQuizzes\"}]}"));

    }


    @Test
    public void should_return_uri_when_insert_paper_definition() {
        Map item = new HashMap<>();
        item.put("easyCount", 1);
        item.put("normalCount", 2);
        item.put("hardCount", 7);

        List<Map> items = new ArrayList<>();
        items.add(item);

        Map map1 = new HashMap<>();
        map1.put("items", items);
        map1.put("quizType", "blankQuizzes");
        map1.put("description", "blankQuizzes描述");

        Map definition = new HashMap<>();
        definition.put("description", "找出数组 A 中与对象 B 中相同的数据");
        definition.put("evaluateScript", "https://github.com/zhangsan/pos_inspection");
        definition.put("templateRepository", "https://github.com/zhangsan/pos_template");

        List<Map> definitions = new ArrayList<>();
        definitions.add(definition);

        Map quiz = new HashMap<>();
        quiz.put("definitions", definitions);

        List<Map> quizzes = new ArrayList<>();
        quizzes.add(quiz);

        Map map2 = new HashMap<>();
        map2.put("description", "homework 描述");
        map2.put("quizType", "homeworkQuizzes");
        map2.put("quizzes", quizzes);

        Map sections = new HashMap<>();
        sections.put("blankQuizzes", map1);
        sections.put("homeworkQuizzes", map2);

        Map map = new HashMap<>();
        map.put("makerId", 1);
        map.put("programId", 1);
        map.put("paperName", "思沃特训营第n次测验");
        map.put("sections", sections);

        Entity entity = Entity.entity(map, MediaType.APPLICATION_JSON_TYPE);

        Response response = target(basePath).request().post(entity);
        assertThat(response.getStatus(), is(200));
    }

    @Test
    public void should_return_logic_puzzle_info_by_paper_id() {
        ScoreSheet scoreSheet = new ScoreSheet();
        scoreSheet.setExamerId(1);
        scoreSheet.setId(2);
        when(scoreSheetMapper.findByPaperId(1, null)).thenReturn(Arrays.asList(
                scoreSheet));

        BlankQuizSubmit blankQuizSubmit = new BlankQuizSubmit();
        blankQuizSubmit.setId(4);
        blankQuizSubmit.setBlankQuizId(5);
        blankQuizSubmit.setEndTime(123456);
        blankQuizSubmit.setStartTime(123456);
        blankQuizSubmit.setScoreSheetId(2);
        when(blankQuizSubmitMapper.findByScoreSheetId(2)).thenReturn(Arrays
                .asList(blankQuizSubmit));

        ItemPost itemPost = new ItemPost();
        itemPost.setId(6);
        itemPost.setBlankQuizSubmitsId(4);
        itemPost.setAnswer("111");
        itemPost.setQuizItemId(7);
        when(itemPostMapper.findByBlankQuizSubmit(4)).thenReturn(Arrays
                .asList(itemPost));

        QuizItem quizItem = new QuizItem();
        quizItem.setId(7);
        quizItem.setAnswer("111");
        when(quizItemMapper.getQuizItemById(7)).thenReturn(quizItem);

        BlankQuiz blankQuiz = new BlankQuiz();
        blankQuiz.setEasyCount(3);
        blankQuiz.setNormalCount(2);
        blankQuiz.setHardCount(1);
        when(blankQuizMapper.findOne(anyInt())).thenReturn(blankQuiz);

        Response response = target(basePath + "/1/logicPuzzle").request().get();
        assertThat(response.getStatus(), is(200));
    }


    @Test
    public void should_return_user_detail_list() {
        int examerId = 1;
        when(scoreSheetMapper.findUserIdsByPaperId(1)).thenReturn(Arrays.asList(examerId));
        UserDetail userDetail = new UserDetail();
        userDetail.setMajor("computer");
        userDetail.setDegree("benke");
        userDetail.setGender("F");
        userDetail.setUserId(1);
        userDetail.setName("purple");
        userDetail.setSchool("siwo");
        User user = new User();
        user.setEmail("test@qq.com");
        user.setMobilePhone("13804030030");
        when(userMapper.findUserDetailsByUserIds(Arrays.asList(examerId)))
                .thenReturn(Arrays.asList(userDetail));
        when(userMapper.findUsersByUserIds(Arrays.asList(examerId)))
                .thenReturn(Arrays.asList(user));

        Response response = target(basePath + "/1/usersDetail").request().get();
        List<Map> result = response.readEntity(List.class);
        assertThat(response.getStatus(), is(200));
        assertThat(result.size(), is(1));
    }

    @Test
    public void should_return_user_count_by_paper_id() {

        Response response = target(basePath + "/1/userCount").request().get();
        assertThat(response.getStatus(), is(200));
    }

    @Test
    public void should_update_paper_operation() {

        when(paperMapper.getPaperById(5)).thenReturn(paper);
        PaperOperation paperOperation = mock(PaperOperation.class);
        when(paperOperationMapper.insertPaperOperation(paperOperation)).thenReturn(1);

        Map items = new HashMap();
        items.put("operatingTime", 23343434);
        items.put("operatorId", 3);
        items.put("operationType", "DELETE");
        items.put("paperId", 5);

        Entity entity = Entity.entity(items, MediaType.APPLICATION_JSON);
        Response response = target(basePath + "/5").request().put(entity);

        assertThat(response.getStatus(), is(204));
    }

    @Test
    public void shuold_return_homework_history_about_user() {
        Map item = new HashMap();
        item.put("result", "jasmine not found");
        item.put("homeworkQuizId", 1);
        item.put("commitTime", 1453287441);
        item.put("startTime", 1453287449);
        item.put("id", 1);
        item.put("homeworkSubmitId", 1);
        item.put("userAnswerRepo", "github.com/purple/1");
        item.put("version", "d8160f56ebbb5d40368048f271328eefa87cb97d");
        item.put("branch", "master");
        item.put("status", 3);
        item.put("examerId", 1);

        List items = new ArrayList();
        items.add(item);

        when(homeworkPostHistoryMapper.getHistoryByExamerIdAndPaperId(1, 1)).thenReturn(items);

        Response response = target(basePath + "/1/users/1/homeworkHistory")
                .request().get();
        String jsonStr = new Gson().toJson(response.readEntity(Map.class));
        assertThat(response.getStatus(), is(200));
        assertThat(jsonStr, is("{\"items\":[{\"result\":\"jasmine not found\","
                + "\"homeworkQuizId\":1,"
                + "\"commitTime\":1453287441,"
                + "\"startTime\":1453287449,"
                + "\"id\":1,"
                + "\"homeworkSubmitId\":1,"
                + "\"userAnswerRepo\":\"github.com/purple/1\","
                + "\"version\":\"d8160f56ebbb5d40368048f271328eefa87cb97d\","
                + "\"branch\":\"master\","
                + "\"status\":3,"
                + "\"examerId\":1}]}"));
    }

    @Test
    public void should_return_basic_quiz_history() {
        when(sectionQuizMapper.getQuizCountByPaperIdAndSectionId(1)).thenReturn(2);
        when(basicQuizMapper.getBasicQuizIdById(1, 1, 1)).thenReturn(1);

        Map result = new HashMap();
        result.put("id", 1);
        result.put("startTime", 232334);
        result.put("endTime", 1234);
        when(basicQuizSubmitMapper.getBaiscQuizSubmitByBasicQuizId(1)).thenReturn(result);

        BasicQuizPostHistory basicQuizPostHistory = new BasicQuizPostHistory();
        basicQuizPostHistory.setUserAnswer("3456");
        basicQuizPostHistory.setType("SINGLE_CHOICE");
        basicQuizPostHistory.setBasicQuizItemId(1);
        basicQuizPostHistory.setId(1);

        List<BasicQuizPostHistory> basicQuizPostHistories = new ArrayList();
        basicQuizPostHistories.add(basicQuizPostHistory);
        when(basicQuizPostHistoryMapper.findByBasicQuizSubmitId(1))
                .thenReturn(basicQuizPostHistories);

        when(singleChoiceMapper.findAnswerById(1)).thenReturn("3");
        Response response = target(basePath + "/1/basicQuizzes")
                .queryParam("sectionId", 1).queryParam("userId", 1)
                .request().get();
        assertThat(response.getStatus(), is(200));
        String jsonStr = new Gson().toJson(response.readEntity(Map.class));
        assertThat(jsonStr, is("{\"correctCount\":0,"
                + "\"startTime\":232334,"
                + "\"endTime\":1234,"
                + "\"totalCount\":2}"));

    }
}



