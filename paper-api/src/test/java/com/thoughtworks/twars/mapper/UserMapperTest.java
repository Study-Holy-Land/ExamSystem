package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.User;
import com.thoughtworks.twars.bean.UserDetail;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;

public class UserMapperTest extends TestBase {

    private UserMapper userMapper;

    @Before
    public void setUp() throws Exception {
        super.setUp();
        userMapper = session.getMapper(UserMapper.class);
    }

    @Test
    public void should_return_user_by_id() throws Exception {
        User user = userMapper.getUserById(1);
        assertThat(user.getMobilePhone(), is("18798037893"));
    }

    @Test
    public void should_return_user_by_email() throws Exception {
        User user = userMapper.getUserByEmail("test@163.com");
        assertThat(user.getMobilePhone(), is("18798037893"));
    }

    @Test
    public void should_return_user_by_mobile_phone() throws Exception {
        User user = userMapper.getUserByMobilePhone("18798037893");
        assertThat(user.getEmail(), is("test@163.com"));
    }

    @Test
    public void should_return_user_by_email_and_password() throws Exception {
        User user = new User();
        user.setEmail("test@163.com");
        user.setPassword("25d55ad283aa400af464c76d713c07ad");

        User resultUser = userMapper.getUserByEmailAndPassWord(user);
        assertThat(resultUser.getMobilePhone(), is("18798037893"));
    }

    @Test
    public void should_return_user_by_mobile_phone_and_password() throws Exception {
        User user = new User();
        user.setMobilePhone("12345678901");
        user.setPassword("25d55ad283aa400af464c76d713c07ad");
    }

    @Test
    public void should_add_user() throws Exception {
        User user = new User();

        user.setEmail("test3@163.com");
        user.setMobilePhone("123456789012");
        user.setPassword("18928392811");
        user.setUserName("hah");
        userMapper.insertUser(user);

        assertThat(user.getId(), is(10));
    }

    @Test
    public void should_update_user_detail() throws Exception {
        UserDetail userDetail = new UserDetail();

        userDetail.setGender("F");
        userDetail.setUserId(1);
        userDetail.setDegree("benke");
        userDetail.setMajor("cs");
        userDetail.setSchool("xi'an");
        userDetail.setName("purple");
        userDetail.setSchoolProvince("陕西");
        userDetail.setSchoolCity("西安");
        userDetail.setEntranceYear("2016");

        userMapper.updateUserDetail(userDetail);

        assertThat(userDetail.getUserId(), is(1));
        assertThat(userDetail.getSchoolCity(), is("西安"));
        assertThat(userDetail.getEntranceYear(), is("2016"));
    }

    @Test
    public void should_insert_user_detail() throws Exception {
        UserDetail userDetail = new UserDetail();

        userDetail.setGender("F");
        userDetail.setDegree("benke");
        userDetail.setSchool("shannxi");
        userDetail.setUserId(5);
        userDetail.setMajor("sc");
        userDetail.setName("purple");
        userDetail.setSchoolProvince("陕西");
        userDetail.setSchoolCity("西安");
        userDetail.setEntranceYear("2015");

        userMapper.updateUserDetail(userDetail);

        assertThat(userDetail.getUserId(), is(5));
        assertThat(userDetail.getSchoolProvince(), is("陕西"));
        assertThat(userDetail.getEntranceYear(), is("2015"));
    }

    @Test
    public void should_return_user_detail_by_id() throws Exception {
        UserDetail detail = userMapper.getUserDetailById(1);

        assertThat(detail.getUserId(), is(1));
        assertThat(detail.getSchool(), is("思沃学院"));
        assertThat(detail.getName(), is("测试一"));
        assertThat(detail.getMajor(), is("计算机"));
        assertThat(detail.getDegree(), is("本科"));
        assertThat(detail.getGender(), is("F"));
        assertThat(detail.getSchoolProvince(), is("陕西"));
        assertThat(detail.getSchoolCity(), is("西安"));
        assertThat(detail.getEntranceYear(), is("2016"));
    }

    @Test
    public void should_encrypt_password_when_create_new_user() throws Exception {
        User newUser = new User();
        newUser.setEmail("jingjing@qq.com");
        newUser.setMobilePhone("13576826262");
        newUser.setPassword("123");
        newUser.setUserName("liu");

        int result = userMapper.insertUser(newUser);
        int userId = newUser.getId();
        User addedUser = userMapper.getUserById(userId);

        assertThat(result, is(1));

        assertThat(addedUser.getPassword(), is("202cb962ac59075b964b07152d234b70"));
    }


    @Test
    public void should_update_password() throws Exception {

        int id = 1;
        String oldPassword = "25d55ad283aa400af464c76d713c07ad";
        String password = "123";

        int result = userMapper.updatePassword(id, oldPassword, password);

        User resultUser = userMapper.getUserById(1);

        assertThat(result, is(1));
        assertThat(resultUser.getPassword(), is("202cb962ac59075b964b07152d234b70"));
    }

    @Test
    public void should_reset_password() throws Exception {

        User user = new User();
        user.setPassword("1bbd886460827015e5d605ed44252251");
        user.setEmail("test@163.com");

        int result = userMapper.resetPassword(user);

        User resultUser = userMapper.getUserById(1);

        assertThat(result, is(1));
        assertThat(resultUser.getPassword(), is("d0521106f6ba7f9ac0a7370fb28d0ec6"));
    }

    @Test
    public void should_return_userDetails() {
        List<Integer> userIds = new ArrayList<>();
        userIds.add(1);
        userIds.add(2);
        userIds.add(3);

        List<UserDetail> userDetails = userMapper.findUserDetailsByUserIds(userIds);

        assertThat(userDetails.size(), is(3));
        assertThat(userDetails.get(0).getUserId(), is(1));
        assertThat(userDetails.get(0).getSchool(), is("思沃学院"));
        assertThat(userDetails.get(0).getSchoolCity(), is("西安"));
        assertThat(userDetails.get(1).getUserId(), is(2));
    }

    @Test
    public void should_return_users() {
        List<Integer> userIds = new ArrayList<>();
        userIds.add(1);
        userIds.add(2);
        userIds.add(3);

        List<User> users = userMapper.findUsersByUserIds(userIds);

        assertThat(users.size(), is(3));
    }

    @Test
    public void should_return_programs() {
        Integer userId = 1;
        List programs = userMapper.findProgramsById(userId);

        assertThat(programs.size(), is(2));
    }

    @Test
    public void should_return_relationship_create_success() {
        Integer mentorId = 7;
        Integer studentId = 2;
        Integer result = userMapper.insertStudentMentor(mentorId, studentId);
        assertThat(result, is(1));
    }

    @Test
    public void should_create_relationship_with_program() {
        Integer programId = 1;
        Integer userId = 4;
        Integer result = userMapper.insertUserProgram(userId, programId);
        assertThat(result, is(1));
    }

    @Test
    public void should_return_mentorIds_by_studentId() {
        List<Integer> mentorIds = userMapper.findMentorIdsByStudentId(1);
        assertThat(mentorIds.size(), is(2));
    }

    @Test
    public void should_return_studentIds_by_mentorId() {
        List<Integer> mentorIds = userMapper.findStudentIdsByMentorId(1, 0, 15);
        assertThat(mentorIds.size(), is(2));
    }


    @Test
    public void should_return_users_count() {
        Integer count = userMapper.getUserCount(null, null);
        assertThat(count, is(8));
    }

    @Test
    public void should_return_roles_and_roleCount() {
        List<Map> items = userMapper.getAllRolesAndCount();
        assertThat(items.size(), is(6));
        assertThat(items.get(0).get("count"), is(new Long(1)));
        assertThat(items.get(3).get("count"), is(new Long(1)));
        assertThat(items.get(4).get("count"), is(new Long(1)));
    }

    @Test
    public void should_return_all_users() {
        List<User> items = userMapper.getAll("test@163.com", "", 1, 3);
        assertThat(items.size(), is(0));
    }

    @Test
    public void should_return_users_by_mobile_phone_and_password() {
        List<Integer> roles = userMapper.getUserRoleByUserId(1);
        assertThat(roles.size(), is(2));
    }

    @Test
    public void should_insert_user_role() {
        Integer id = userMapper.insertUserRole(1, 2);
        assertThat(id, is(1));
    }

    @Test
    public void should_return_users_by_role() {
        List<User> users = userMapper.getUsersByRole(1, 0, 2);
        assertThat(users.size(), is(2));
    }

    @Test
    public void should_return_users_count_by_role() {
        Integer count = userMapper.getUserCountByRole(1);
        assertThat(count, is(3));
    }

    @Test
    public void should_return_count_of_homeworkSubmit() {
        Integer count = userMapper.getHomeworkSubmitCount(1);
        assertThat(count, is(3));
    }

    @Test
    public void should_return_count_of_student_by_userId() {
        Integer count = userMapper.getStudentCountByUserId(1);
        assertThat(count, is(2));
    }

    @Test
    public void should_return_id_by_userId_and_programId() {
        Integer programId = userMapper.findByProgramIdAndUserId(1, 1);
        assertThat(programId, is(1));
    }
}

