package com.thoughtworks.twars.resource;

import com.google.gson.Gson;
import com.thoughtworks.twars.bean.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.*;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.anyInt;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class UserResourceTest extends TestBase {

    User user = mock(User.class);
    User user01 = mock(User.class);
    User user02 = mock(User.class);

    UserDetail theDetail = mock(UserDetail.class);
    UserDetail theDetail01 = mock(UserDetail.class);

    String basePath = "/users";

    @Test
    public void should_return_user() {

        when(userMapper.getUsersByRole(1, 0, 1)).thenReturn(Arrays.asList(user));
        when(userMapper.getUserCountByRole(1)).thenReturn(1);
        Map map = new HashMap<>();
        map.put("id", 2);
        map.put("email", "z@z.com");
        map.put("mobilePhone", "18829290271");
        map.put("userName", "tom");
        map.put("role", null);
        when(user.toMap()).thenReturn(map);

        Response response = target(basePath).queryParam("role", 1).request().get();

        Map result = response.readEntity(Map.class);
        assertThat(response.getStatus(), is(200));
        assertThat(result.get("totalCount"), is(1));

    }

    @Test
    public void should_return_404_when_get_user() {
        when(userMapper.getUserById(90)).thenReturn(null);

        Response response = target(basePath + "/90").request().get();
        assertThat(response.getStatus(), is(404));
    }

    @Test
    public void should_return_404_when_get_user_detail() {
        when(userMapper.getUserDetailById(90)).thenReturn(null);

        Response response = target(basePath + "/7/detail").request().get();
        assertThat(response.getStatus(), is(404));
    }

    @Test
    public void should_200_when_get_user_by_email() {
        when(userMapper.getUserByEmail(anyString())).thenReturn(null);

        Response response = target(basePath)
                .queryParam("field", "email")
                .queryParam("value", "abc@test.com")
                .request().get();

        Map result = response.readEntity(Map.class);

        assertThat(response.getStatus(), is(200));
        assertEquals(result.get("uri"), null);
    }

    @Test
    public void should_200_when_get_user_by_mobile_phone() {
        when(userMapper.getUserByMobilePhone(anyString())).thenReturn(null);

        Response response = target(basePath)
                .queryParam("field", "mobilePhone")
                .queryParam("value", "4585295152")
                .request().get();

        Map result = response.readEntity(Map.class);

        assertThat(response.getStatus(), is(200));
        assertEquals(result.get("uri"), null);
    }

    @Test
    public void should_return_user_detail_by_user_id() throws Exception {

        UserDetail theDetail = mock(UserDetail.class);

        when(userMapper.getUserDetailById(1)).thenReturn(theDetail);
        when(userMapper.getUserById(1)).thenReturn(user);
        when(user.getMobilePhone()).thenReturn("123456");
        when(user.getEmail()).thenReturn("11@qq.com");

        when(theDetail.getUserId()).thenReturn(1);
        when(theDetail.getSchool()).thenReturn("哈佛");
        when(theDetail.getMajor()).thenReturn("宗教");
        when(theDetail.getDegree()).thenReturn("博士");
        when(theDetail.getName()).thenReturn("狗剩");
        when(theDetail.getGender()).thenReturn("男");
        when(theDetail.getSchoolProvince()).thenReturn("陕西");
        when(theDetail.getSchoolCity()).thenReturn("西安");
        when(theDetail.getEntranceYear()).thenReturn("2016");

        Response response = target(basePath + "/1/detail").request().get();

        assertThat(response.getStatus(), is(200));

    }

    @Test
    public void should_return_user_detail_by_user_ids() throws Exception {

        when(userMapper.getUserDetailById(1)).thenReturn(theDetail);
        when(userMapper.getUserById(1)).thenReturn(user);
        when(user.getMobilePhone()).thenReturn("123456");
        when(user.getEmail()).thenReturn("11@qq.com");

        when(theDetail.getUserId()).thenReturn(1);
        when(theDetail.getSchool()).thenReturn("哈佛");
        when(theDetail.getMajor()).thenReturn("宗教");
        when(theDetail.getDegree()).thenReturn("博士");
        when(theDetail.getName()).thenReturn("狗剩");
        when(theDetail.getGender()).thenReturn("男");
        when(theDetail.getSchoolProvince()).thenReturn("陕西");
        when(theDetail.getSchoolCity()).thenReturn("西安");
        when(theDetail.getEntranceYear()).thenReturn("2016");

        when(userMapper.getUserDetailById(2)).thenReturn(theDetail01);
        when(userMapper.getUserById(2)).thenReturn(user01);
        when(user01.getMobilePhone()).thenReturn("78910");
        when(user01.getEmail()).thenReturn("22@qq.com");

        when(theDetail01.getUserId()).thenReturn(2);
        when(theDetail01.getSchool()).thenReturn("麻省理工");
        when(theDetail01.getMajor()).thenReturn("计算机科学");
        when(theDetail01.getDegree()).thenReturn("硕士");
        when(theDetail01.getName()).thenReturn("李明");
        when(theDetail01.getGender()).thenReturn("男");
        when(theDetail01.getSchoolProvince()).thenReturn("陕西");
        when(theDetail01.getSchoolCity()).thenReturn("西安");
        when(theDetail01.getEntranceYear()).thenReturn("2016");

        Response response = target(basePath + "/1,2/detail").request().get();
        Map result = response.readEntity(Map.class);

        List<Map> userDetailList = (List) result.get("userList");

        assertThat(response.getStatus(), is(200));
        assertThat(userDetailList.size(), is(2));
    }

    @Test
    public void should_update_user_detail() throws Exception {
        UserDetail updateUserDetail = new UserDetail();

        updateUserDetail.setUserId(2);

        Entity<UserDetail> entityUserDetail = Entity.entity(updateUserDetail,
                MediaType.APPLICATION_JSON_TYPE);
        Response response = target(basePath + "/2/detail").request().put(
                entityUserDetail);

        assertThat(response.getStatus(), is(200));

        Map result = response.readEntity(Map.class);
        assertThat(result.get("uri"), is("userDetail/2"));

    }

    @Test
    public void should_insert_user_detail() throws Exception {
        UserDetail insertUserDetail = new UserDetail();

        insertUserDetail.setUserId(18);
        insertUserDetail.setDegree("benke");
        insertUserDetail.setGender("F");
        insertUserDetail.setMajor("cs");
        insertUserDetail.setName("purple");
        insertUserDetail.setSchool("shannxi");
        insertUserDetail.setSchoolProvince("陕西");
        insertUserDetail.setSchoolCity("西安");
        insertUserDetail.setEntranceYear("2016");

        Entity<UserDetail> entityUserDetail = Entity.entity(insertUserDetail,
                MediaType.APPLICATION_JSON_TYPE);
        Response response = target(basePath + "/18/detail").request().put(
                entityUserDetail);

        assertThat(response.getStatus(), is(200));

        Map result = response.readEntity(Map.class);
        assertThat(result.get("uri"), is("userDetail/18"));
    }

    @Test
    public void should_return_404_when_get_no_detail() throws Exception {

        when(userMapper.getUserDetailById(anyInt())).thenReturn(null);

        Response response = target(basePath + "/99/detail").request().get();

        assertThat(response.getStatus(), is(404));
    }

    @Test
    public void should_change_user_password() throws Exception {
        Map userMap = new HashMap<String, String>();

        userMap.put("oldPassword", "25d55ad283aa400af464c76d713c07ad");
        userMap.put("password", "123");

        when(userMapper.updatePassword(1, "25d55ad283aa400af464c76d713c07ad", "123")).thenReturn(1);

        Entity entity = Entity.entity(userMap, MediaType.APPLICATION_JSON);

        Response response = target(basePath + "/1/password").request().put(entity);

        assertThat(response.getStatus(), is(200));
    }

    @Test
    public void should_retrieve_password() throws Exception {

        Response response = target(basePath + "/password/retrieve")
                .queryParam("field", "email")
                .queryParam("value", "test@163.com")
                .request().get();

        Map result = response.readEntity(Map.class);

        assertThat(response.getStatus(), is(200));
    }

    @Test
    public void should_return_logic_puzzle_result() throws Exception {

        ScoreSheet scoreSheet = new ScoreSheet();
        scoreSheet.setExamerId(1);
        scoreSheet.setId(2);
        when(scoreSheetMapper.findOneByUserId(1)).thenReturn(scoreSheet);

        BlankQuizSubmit blankQuizSubmit = new BlankQuizSubmit();
        blankQuizSubmit.setId(4);
        blankQuizSubmit.setBlankQuizId(5);
        blankQuizSubmit.setEndTime(123456);
        blankQuizSubmit.setStartTime(123456);
        blankQuizSubmit.setScoreSheetId(2);
        when(blankQuizSubmitMapper.findByScoreSheetId(2))
                .thenReturn(Arrays.asList(blankQuizSubmit));

        ItemPost itemPost = new ItemPost();
        itemPost.setId(6);
        itemPost.setBlankQuizSubmitsId(4);
        itemPost.setAnswer("111");
        itemPost.setQuizItemId(7);
        when(itemPostMapper.findByBlankQuizSubmit(4)).thenReturn(Arrays.asList(itemPost));

        QuizItem quizItem = new QuizItem();
        quizItem.setId(7);
        quizItem.setAnswer("111");
        when(quizItemMapper.getQuizItemById(7)).thenReturn(quizItem);

        Response response = target(basePath + "/1/logicPuzzle").request().get();
        assertThat(response.getStatus(), is(200));
    }

    @Test
    public void should_return_programs() throws Exception {

        Map map1 = new HashMap();
        map1.put("programId", 1);
        map1.put("programName", "一年级");
        Map map2 = new HashMap();
        map2.put("programId", 2);
        map2.put("programName", "二年级");

        List<Map> programs = new ArrayList<>();
        programs.add(map1);
        programs.add(map2);
        when(userMapper.findProgramsById(1)).thenReturn(programs);

        Response response = target(basePath + "/1/programs").request().get();
        assertThat(response.getStatus(), is(200));

        List result = response.readEntity(List.class);

        assertThat(result.size(), is(2));
    }


    @Test
    public void should_return_mentorIds_by_studentId() {
        when(userMapper.findMentorIdsByStudentId(1)).thenReturn(Arrays.asList(1, 2));

        Response response = target(basePath + "/1/mentors").request().get();
        assertThat(response.getStatus(), is(200));

        Map map = response.readEntity(Map.class);
        List result = (List) map.get("mentorIds");

        assertThat(result.size(), is(2));
    }

    @Test
    public void should_return_studentIds_by_mentorId() {
        when(userMapper.findStudentIdsByMentorId(1,0,15)).thenReturn(Arrays.asList(1, 2));

        Response response = target(basePath + "/1/mentees").request().get();
        assertThat(response.getStatus(), is(200));

        Map map = response.readEntity(Map.class);
        List result = (List) map.get("studentIds");

        assertThat(result.size(), is(2));
    }

    @Test
    public void should_return_create_user_and_programs_relationship() {

        when(userMapper.findByProgramIdAndUserId(7, 1)).thenReturn(null);
        when(userMapper.insertUserProgram(1, 7)).thenReturn(1);

        Entity entity = Entity.entity(null, MediaType.APPLICATION_JSON_TYPE);
        Response response = target(basePath + "/1/programs/7").request().post(entity);
        
        assertThat(response.getStatus(), is(201));
    }

    @Test
    public void should_return_201_when_admin_create_user() {

        Map data = new HashMap();
        data.put("email", "test.com");
        data.put("mobliePhone", "13999999999");
        data.put("password", "123456");
        data.put("userName", "zh");
        ArrayList<Integer> role = new ArrayList();
        role.add(1);
        role.add(2);
        data.put("role", role);

        Entity entity = Entity.entity(data, MediaType.APPLICATION_JSON_TYPE);
        Response response = target(basePath).request().post(entity);

        assertThat(response.getStatus(), is(201));
    }

    @Test
    public void should_return_201_when_admin_create_user_and_role_is_null() {

        Map data = new HashMap();
        data.put("email", "test.com");
        data.put("mobliePhone", "13999999999");
        data.put("password", "123456");
        data.put("userName", "zh");
        ArrayList<Integer> role = new ArrayList();
        data.put("role", role);

        Entity entity = Entity.entity(data, MediaType.APPLICATION_JSON_TYPE);
        Response response = target(basePath).request().post(entity);

        assertThat(response.getStatus(), is(201));
    }

    @Test
    public void should_return_204_when_admin_update_role_by_email() {

        Map data = new HashMap();
        data.put("email", "test.com");
        data.put("mobilePhone", "13999999999");
        data.put("password", "123456");
        data.put("userName", "zh");
        ArrayList<Integer> role = new ArrayList();
        role.add(2);
        role.add(3);
        data.put("role", role);

        user.setRoles(role);
        user.setEmail("test.com");
        user.setMobilePhone("13999999999");
        user.setPassword("123456");
        user.setUserName("zh");
        when(userMapper.getUserById(1)).thenReturn(user);
        when(userMapper.updateUser(user)).thenReturn(1);
        when(userMapper.deleteUserRole(1)).thenReturn(1);
        when(userMapper.insertUserRole(1, 2)).thenReturn(1);

        Entity entity = Entity.entity(data, MediaType.APPLICATION_JSON_TYPE);
        Response response = target(basePath)
                .queryParam("id", 1).request().put(entity);

        assertThat(response.getStatus(), is(204));
    }

    @Test
    public void should_return_all_user() {


        when(user.getEmail()).thenReturn("email");

        Map map = new HashMap();
        map.put("email", "email");
        map.put("userName", "userName");
        map.put("mobilePhone", "11111");
        map.put("role", "1");


        when(user.toMap()).thenReturn(map);

        ArrayList roles = new ArrayList();
        roles.add("1");
        roles.add("2");

        when(userMapper.getUserCount(null, null)).thenReturn(2);
        Map item = new HashMap();
        item.put("role", "1");
        item.put("count", 2);
        ArrayList roleCount = new ArrayList();
        roleCount.add(item);
        when(userMapper.getAllRolesAndCount()).thenReturn(roleCount);

        Map map1 = new HashMap();
        map1.put("email", "email");
        map1.put("userName", "userName");
        map1.put("mobilePhone", "11111");
        map1.put("role", "1");


        when(user02.toMap()).thenReturn(map1);

        Response response = target(basePath)
                .queryParam("page", 1).queryParam("pageSize", 1).request().get();
        Map result = response.readEntity(Map.class);
        String jsonStr = new Gson().toJson(result);
        System.out.println(jsonStr);
        assertThat(response.getStatus(),
                is(200));
    }


    @Test
    public void should_return_user_by_field() {
        when(userMapper.getUserByEmail(anyString())).thenReturn(user);
        when(user.getId()).thenReturn(10);

        Response response = target(basePath + "/verification")
                .queryParam("field", "email")
                .queryParam("value", "abc@test.com")
                .request().get();

        assertThat(response.getStatus(), is(200));

        Map result = response.readEntity(Map.class);

        assertThat((String) result.get("uri"), is("users/10"));

    }


    @Test
    public void should_return_role_count() throws Exception {

        List<Map> roleCount = new ArrayList<>();
        Map map = new HashMap<>();
        map.put("role", 1);
        map.put("count", 1);
        when(userMapper.getAllRolesAndCount()).thenReturn(roleCount);
        Integer userCount = 1;
        when(userMapper.getUserCount(null, null)).thenReturn(userCount);

        Response response = target(basePath + "/roleCount").request().get();
        assertThat(response.getStatus(), is(200));

        Map result = response.readEntity(Map.class);
        assertThat(result.get("totalCount"), is(1));

    }

    @Test
    public void should_return_count_of_homeworkSubmit() throws Exception {
        when(userMapper.getHomeworkSubmitCount(3)).thenReturn(2);
        Response response = target(basePath + "/3/homeworkSubmitCount").request().get();
        assertThat(response.getStatus(), is(200));

        Map result = response.readEntity(Map.class);
        assertThat(result.get("homeworkSubmitCount"), is(2));


    }
}
