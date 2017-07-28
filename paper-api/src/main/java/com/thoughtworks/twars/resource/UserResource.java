package com.thoughtworks.twars.resource;

import com.thoughtworks.twars.bean.*;
import com.thoughtworks.twars.mapper.*;
import io.swagger.annotations.Api;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.*;
import java.util.stream.Collectors;

@Path("/users")
@Api
public class UserResource extends Resource {

    @Inject
    private UserMapper userMapper;

    @Inject
    private PasswordRetrieveDetailMapper passwordRetrieveDetailMapper;

    @Inject
    private ScoreSheetMapper scoreSheetMapper;

    @Inject
    private BlankQuizSubmitMapper blankQuizSubmitMapper;

    @Inject
    private ItemPostMapper itemPostMapper;

    @Inject
    private QuizItemMapper quizItemMapper;


    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUsers(
            @DefaultValue("1") @QueryParam("page") Integer page,
            @DefaultValue("15") @QueryParam("pageSize") Integer pageSize,
            @QueryParam("email") String email,
            @QueryParam("mobilePhone") String mobilePhone,
            @QueryParam("role") Integer role) {
        Integer startPage = Math.max(page - 1, 0);
        Integer newPage = startPage * pageSize;

        List<User> users;

        int totalCount = 0;
        if (role != null) {
            users = userMapper.getUsersByRole(role, newPage, pageSize);
            totalCount = userMapper.getUserCountByRole(role);

        } else {
            users = userMapper.getAll(email, mobilePhone, newPage, pageSize);
            totalCount = userMapper.getUserCount(email, mobilePhone);
        }

        List<Map> userList = users.stream()
                .map(item -> item.toMap())
                .collect(Collectors.toList());

        Map result = new HashMap();

        result.put("items", userList);
        result.put("totalCount", totalCount);
        return Response.status(Response.Status.OK).entity(result).build();

    }

    @GET
    @Path("/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUser(
            @PathParam("userId") Integer userId) {

        User user = userMapper.getUserById(userId);

        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.status(Response.Status.OK).entity(user.toMap()).build();
    }


    @GET
    @Path("/roleCount")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRoleCount() {

        List<Map> allRolesAndCount = userMapper.getAllRolesAndCount();
        Integer userCount = userMapper.getUserCount(null, null);

        Map result = new HashMap<>();
        result.put("roleCount", allRolesAndCount);
        result.put("totalCount", userCount);

        return Response.status(Response.Status.OK).entity(result).build();
    }


    @GET
    @Path("/{userId}/logicPuzzle")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserLogicPuzzle(
            @PathParam("userId") Integer userId) {
        ScoreSheet scoreSheet = scoreSheetMapper.findOneByUserId(userId);

        if (scoreSheet == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        BlankQuizSubmit blankQuizSubmit =
                blankQuizSubmitMapper.findByScoreSheetId(scoreSheet.getId()).get(0);

        List<ItemPost> itemPostList = itemPostMapper.findByBlankQuizSubmit(blankQuizSubmit.getId());

        Map result = new HashMap();
        result.put("startTime", blankQuizSubmit.getStartTime());
        result.put("endTime", blankQuizSubmit.getEndTime());
        result.put("itemNumber", itemPostList.size());
        result.put("correctNumber", calculateCorrectNumber(itemPostList));

        return Response.status(Response.Status.OK).entity(result).build();
    }

    public int calculateCorrectNumber(List<ItemPost> itemPostList) {
        List<String> correctList = new ArrayList<>();

        itemPostList.forEach(val -> {
            String answer = quizItemMapper.getQuizItemById(val.getQuizItemId()).getAnswer();
            if (val.getAnswer() != null && val.getAnswer().equals(answer)) {
                correctList.add("true");
            }
        });
        return correctList.size();
    }

    @GET
    @Path("/{userIds}/detail")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserDetail(
            @PathParam("userIds") String userIds) {
        String[] ids = userIds.split(",");
        List userList = new ArrayList();
        for (String i : ids) {

            Integer userId = Integer.parseInt(i);
            User user = userMapper.getUserById(userId);

            if (null == user) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }

            Map map = user.toMap();
            UserDetail detail = userMapper.getUserDetailById(userId);
            if (null != detail) {
                map.put("userId", detail.getUserId());
                map.put("school", detail.getSchool());
                map.put("major", detail.getMajor());
                map.put("degree", detail.getDegree());
                map.put("name", detail.getName());
                map.put("gender", detail.getGender());
                map.put("schoolProvince", detail.getSchoolProvince());
                map.put("schoolCity", detail.getSchoolCity());
                map.put("entranceYear", detail.getEntranceYear());
            }
            userList.add(map);
        }

        Map result = new HashMap<>();
        if (userList.size() == 1) {
            result = (Map) userList.get(0);
            return Response.status(Response.Status.OK).entity(result).build();
        }

        result.put("userList", userList);
        return Response.status(Response.Status.OK).entity(result).build();

    }

    @GET
    @Path("/{userId}/programs")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProgramById(
            @PathParam("userId") Integer userId) {
        List<Map> programs = userMapper.findProgramsById(userId);

        if (programs == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.status(Response.Status.OK).entity(programs).build();
    }

    @GET
    @Path("/{studentId}/mentors")
    @Produces(MediaType.APPLICATION_JSON)
    public Response findMentorIdsByStudentId(
            @PathParam("studentId") Integer id) {
        List<Integer> mentorIds = userMapper.findMentorIdsByStudentId(id);
        if (mentorIds == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        Map result = new HashMap<>();
        result.put("mentorIds", mentorIds);

        return Response.status(Response.Status.OK).entity(result).build();
    }

    @GET
    @Path("/{mentorId}/mentees")
    @Produces(MediaType.APPLICATION_JSON)
    public Response findStudentIdsByMentorId(
            @PathParam("mentorId") Integer id,
            @DefaultValue("1") @QueryParam("page") Integer page,
            @DefaultValue("15") @QueryParam("pageSize") Integer pageSize) {

        Integer startPage = Math.max(page - 1, 0);
        Integer newPage = startPage * pageSize;


        List<Integer> studentIds = userMapper.findStudentIdsByMentorId(id, newPage, pageSize);
        Integer totalCount = userMapper.getStudentCountByUserId(id);
        if (studentIds == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        Map result = new HashMap<>();
        result.put("studentIds", studentIds);
        result.put("totalCount", totalCount);

        return Response.status(Response.Status.OK).entity(result).build();
    }


    @PUT
    @Path("/{userId}/detail")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateUserDetail(
            @PathParam("userId") Integer userId,
            UserDetail userDetail
    ) {
        userMapper.updateUserDetail(userDetail);

        Map<String, Object> result = new HashMap<>();
        result.put("uri", "userDetail/" + userDetail.getUserId());

        return Response.status(Response.Status.OK).entity(result).build();
    }

    @PUT
    @Path("/{userId}/password")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateUserPassword(
            @PathParam("userId") Integer userId,
            Map userPasswordMap
    ) {
        String oldPassword = (String) userPasswordMap.get("oldPassword");
        String password = (String) userPasswordMap.get("password");

        int id = userMapper.updatePassword(userId, oldPassword, password);

        if (1 == id) {
            Map<String, Object> result = new HashMap<>();
            result.put("uri", "users/" + userId);

            return Response.status(Response.Status.OK).entity(result).build();
        }

        return Response.status(Response.Status.BAD_REQUEST).build();
    }

    @GET
    @Path("/password/retrieve")
    @Produces(MediaType.APPLICATION_JSON)
    public Response findUserByField(
            @QueryParam("field") String field,
            @QueryParam("value") String value
    ) {
        User user = userMapper.getUserByEmail(value);
        Map<String, String> result = new HashMap<>();
        String token = null;

        if (null == user) {
            result.put("status", "404");
            result.put("token", token);

            return Response.status(Response.Status.OK).entity(result).build();
        }

        PasswordRetrieveDetail passwordRetrieveDetail =
                passwordRetrieveDetailMapper.getDetailByEmail(value);

        if (passwordRetrieveDetail != null) {
            token = passwordRetrieveDetail.getToken();
            result.put("status", "200");
            result.put("token", token);

            return Response.status(Response.Status.OK).entity(result).build();
        } else {
            passwordRetrieveDetailMapper.updateDetailByEmail(value);
            token = passwordRetrieveDetailMapper.getDetailByEmail(value).getToken();
            result.put("status", "200");
            result.put("token", token);

            return Response.status(Response.Status.OK).entity(result).build();
        }
    }


    @POST
    @Path("/{userId}/programs/{programId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response resetPassword(
            @PathParam("userId") Integer userId,
            @PathParam("programId") Integer programId) {

        if (null != userMapper.findByProgramIdAndUserId(programId, userId)) {
            return Response.status(Response.Status.CONFLICT).build();

        } else {
            userMapper.insertUserProgram(userId, programId);
            return Response.status(Response.Status.CREATED).build();
        }
    }


    @POST
    @Path("/password/reset")
    @Produces(MediaType.APPLICATION_JSON)
    public Response resetPassword(Map data) {
        String newPasword = (String) data.get("newPassword");
        String token = (String) data.get("token");
        int timeLimit = 1800;

        Map result = new HashMap<>();

        PasswordRetrieveDetail passwordRetrieveDetail =
                passwordRetrieveDetailMapper.getDetailByToken(token);

        if (passwordRetrieveDetail == null) {
            result.put("status", "403");
            return Response.status(Response.Status.OK).entity(result).build();
        }

        long timeInterval = Calendar.getInstance().getTimeInMillis() / 1000
                - passwordRetrieveDetail.getRetrieveDate();

        if (timeLimit > timeInterval) {
            User user = new User();
            user.setEmail(passwordRetrieveDetail.getEmail());
            user.setPassword(newPasword);

            userMapper.resetPassword(user);

            passwordRetrieveDetailMapper.setNullToken(user.getEmail());
            result.put("status", "201");
        } else {
            result.put("status", "412");
        }

        return Response.status(Response.Status.OK).entity(result).build();
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertUser(Map data) {

        User user = new User();
        user.setEmail((String) data.get("email"));
        user.setMobilePhone((String) data.get("mobilePhone"));
        user.setPassword((String) data.get("password"));
        user.setUserName((String) data.get("userName"));

        ArrayList<Integer> roles = (ArrayList<Integer>) data.get("role");

        userMapper.insertUser(user);

        if (roles.size() == 0) {
            return Response.status(Response.Status.CREATED).build();
        }

        for (Integer userRole : roles) {
            userMapper.insertUserRole(user.getId(), userRole);
        }

        Map result = new HashMap();
        result.put("uri", "users/" + user.getId());

        return Response.status(Response.Status.CREATED).entity(result).build();
    }

    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateUser(Map data, @QueryParam("id") Integer id) {

        User user = userMapper.getUserById(id);
        user.setEmail((String) data.get("email"));
        user.setMobilePhone((String) data.get("mobilePhone"));
        user.setUserName((String) data.get("userName"));
        user.setPassword((String) data.get("password"));

        userMapper.updateUser(user);

        ArrayList<Integer> roles = (ArrayList<Integer>) data.get("role");
        if (roles.size() == 0) {
            return Response.status(Response.Status.CREATED).build();
        }
        userMapper.deleteUserRole(id);
        for (Integer userRole : roles) {
            userMapper.insertUserRole(id, userRole);
        }
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @GET
    @Path("/verification")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserByField(
            @QueryParam("field") String field,
            @QueryParam("value") String value
    ) {
        User user = null;

        if ("email".equals(field)) {
            user = userMapper.getUserByEmail(value);
        } else if ("mobilePhone".equals(field)) {
            user = userMapper.getUserByMobilePhone(value);
        }

        Map<String, String> map = new HashMap<>();

        if (null != user) {
            map.put("uri", "users/" + user.getId());
            return Response.status(Response.Status.OK).entity(map).build();
        }
        map.put("uri", null);

        return Response.status(Response.Status.OK).entity(map).build();
    }

    @GET
    @Path("/{userId}/homeworkSubmitCount")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getHomeworkSubmitCount(@PathParam("userId") Integer userId) {
        Integer count = userMapper.getHomeworkSubmitCount(userId);

        Map result = new HashMap();
        result.put("homeworkSubmitCount", count);
        return Response.status(Response.Status.OK).entity(result).build();

    }
}
