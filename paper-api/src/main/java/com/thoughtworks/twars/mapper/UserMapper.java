package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.User;
import com.thoughtworks.twars.bean.UserDetail;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;

public interface UserMapper {

    @Insert("INSERT INTO users(email, mobilePhone, password, userName,createDate)"
            + "VALUES (#{email}, #{mobilePhone}, MD5(#{password}),#{userName}"
            + ",UNIX_TIMESTAMP())")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertUser(User user);

    @Select("SELECT * FROM users WHERE id = #{id};")
    @Results(value = {
            @Result(id = true, property = "id", column = "id"),
            @Result(property = "mobilePhone", column = "mobilePhone"),
            @Result(property = "email", column = "email"),
            @Result(property = "userName", column = "userName"),
            @Result(property = "roles", column = "id", javaType = List.class,
                    many = @Many(select = "getUserRoleByUserId"))
            })
    User getUserById(Integer id);

    @Select("DELETE from userRole where userId = #{id};")
    Integer deleteUserRole(Integer id);

    @Select("SELECT * FROM users WHERE binary email = #{email} LIMIT 1;")
    User getUserByEmail(String email);

    @Select("SELECT count(*) FROM userRole WHERE role = #{role} ORDER BY userId DESC;")
    Integer getUserCountByRole(Integer role);

    @Select("SELECT * FROM users WHERE mobilePhone = #{mobilePhone} LIMIT 1;")
    User getUserByMobilePhone(String mobilePhone);

    @Select(" SELECT * FROM users WHERE email regexp binary #{email} AND"
            + " password = MD5(#{password}) LIMIT 1;")
    User getUserByEmailAndPassWord(User user);

    @Select("SELECT * FROM users WHERE mobilePhone = #{mobilePhone} LIMIT 1;")
    User getUserByMobilePhoneAndPassWord(User user);

    @Select("SELECT * FROM userDetail WHERE userId = #{userId};")
    UserDetail getUserDetailById(Integer userId);

    @Insert("REPLACE INTO userDetail(userId,name,major,school,gender,"
            + "degree,schoolProvince,schoolCity,entranceYear)"
            + "values(#{userId}, #{name},#{major}, #{school}, #{gender},"
            + "#{degree},#{schoolProvince},#{schoolCity},#{entranceYear})")
    @Options(useGeneratedKeys = true, keyProperty = "userId")
    int updateUserDetail(UserDetail detail);

    @Update("UPDATE users SET password=MD5(#{password}) WHERE id = #{id} "
            + "AND password=MD5(#{oldPassword});")
    int updatePassword(
            @Param("id") int id,
            @Param("oldPassword") String oldPassword,
            @Param("password") String password);


    @Update("UPDATE users SET password=MD5(#{password}) WHERE binary email= #{email};")
    int resetPassword(User user);


    @Select({"<script>",
            "SELECT * FROM userDetail WHERE userId IN",
            "<foreach item= 'userIds' index= 'index' collection='list' ",
            "open='(' separator= ',' close= ')'>",
            "#{userIds}",
            "</foreach>",
            "</script>"
             })
    List<UserDetail> findUserDetailsByUserIds(List<Integer> userIds);


    @Select({"<script>",
            "SELECT * FROM users WHERE id IN",
            "<foreach item= 'userIds' index='index' collection='list' ",
            "open='(' separator= ','  close= ')'>",
            "#{userIds}",
            "</foreach>",
            "</script>"
            })
    @Results(value = {
            @Result(id = true, property = "id", column = "id"),
            @Result(property = "mobilePhone", column = "mobilePhone"),
            @Result(property = "email", column = "email"),
            @Result(property = "userName", column = "userName")
              })
    List<User> findUsersByUserIds(List<Integer> userIds);


    @Select(" SELECT id as programId,name as programName FROM programs WHERE id "
            + "IN (SELECT programId FROM userProgram WHERE userId = #{id});")
    List<Map> findProgramsById(Integer id);


    @Insert("INSERT INTO studentMentor VALUES(#{mentorId},#{studentId});")
    Integer insertStudentMentor(
            @Param("mentorId") Integer mentorId,
            @Param("studentId") Integer studentId);

    @Insert("INSERT INTO userProgram VALUES(#{userId},#{programId});")
    Integer insertUserProgram(
            @Param("userId") Integer userId,
            @Param("programId") Integer programId);

    @Select("SELECT mentorId FROM studentMentor WHERE studentId = #{id};")
    List<Integer> findMentorIdsByStudentId(Integer id);

    @Select("SELECT studentId FROM studentMentor WHERE "
            + "mentorId = #{id} LIMIT #{page},#{pageSize};")
    List<Integer> findStudentIdsByMentorId(@Param("id") Integer id,
                                           @Param("page") Integer page,
                                           @Param("pageSize") Integer pageSize);


    @Select({"<script>",
            "SELECT count(*) FROM users",
            "<where>",
            "<if test='email != null'>",
            "   email LIKE concat('%',#{email},'%')",
            "</if>",
            "<if test='mobilePhone != null'>",
            "   AND mobilePhone = #{mobilePhone}",
            "</if>",
            "</where>",
            "</script>"
            })
    Integer getUserCount(@Param("email") String email,
                         @Param("mobilePhone") String mobilePhone);

    @Select("SELECT role, COUNT(userId) AS count FROM userRole "
            + "WHERE role IS NOT NULL GROUP BY role ;")
    List<Map> getAllRolesAndCount();


    @Select({"<script>",
            "SELECT * FROM users",
            "<where>",
            "<if test='email != null'>",
            "email LIKE concat('%',#{email},'%')",
            "</if>",
            "<if test='mobilePhone != null'>",
            "AND mobilePhone = #{mobilePhone}",
            "</if>",
            "</where>",
            "ORDER BY createDate DESC",
            "LIMIT #{page} ,#{pageSize};",
            "</script>"
            })
    @Results(value = {
            @Result(id = true, property = "id", column = "id"),
            @Result(property = "mobilePhone", column = "mobilePhone"),
            @Result(property = "email", column = "email"),
            @Result(property = "userName", column = "userName"),
            @Result(property = "roles", column = "id", javaType = List.class,
                    many = @Many(select = "getUserRoleByUserId"))
            })
    List<User> getAll(
            @Param("email") String email,
            @Param("mobilePhone") String mobilePhone,
            @Param("page") Integer page,
            @Param("pageSize") Integer pageSize);


    @Select({"<script>",
            "SELECT * FROM ",
            "(SELECT userId FROM userRole WHERE role = #{role}) tmp , users ",
            "WHERE tmp.userId = users.id",
            "ORDER BY createDate DESC",
            "LIMIT #{page} ,#{pageSize};",
            "</script>"
            })
    @Results(value = {
            @Result(id = true, property = "id", column = "id"),
            @Result(property = "mobilePhone", column = "mobilePhone"),
            @Result(property = "email", column = "email"),
            @Result(property = "userName", column = "userName"),
            @Result(property = "roles", column = "id", javaType = List.class,
                    many = @Many(select = "getUserRoleByUserId"))
            })
    List<User> getUsersByRole(
            @Param("role") Integer role,
            @Param("page") Integer page,
            @Param("pageSize") Integer pageSize);


    @Select("SELECT role FROM userRole WHERE userId= #{id};")
    List<Integer> getUserRoleByUserId(Integer id);

    @Insert("INSERT INTO userRole VALUES(#{userId},#{role});")
    int insertUserRole(@Param("userId") Integer userId, @Param("role") Integer role);

    @Update({"<script>",
            "UPDATE users SET email =#{email}, mobilePhone = #{mobilePhone},userName=#{userName}",
            "<if test= 'password != null'>",
            "   ,password=MD5(#{password})",
            "</if>",
            "where id = #{id};",
            "</script>"
            })
    Integer updateUser(User user);

    @Select("SELECT COUNT(homeworkQuizId) FROM homeworkSubmit WHERE scoreSheetId IN"
            + "(SELECT id FROM scoreSheet WHERE examerId = #{userId})")
    Integer getHomeworkSubmitCount(Integer userId);

    @Select("select count(*) from studentMentor where mentorId = #{userId};")
    Integer getStudentCountByUserId(Integer userId);

    @Select("select programId from userProgram where userId = #{userId} "
            + "and programId = #{programId}")
    Integer findByProgramIdAndUserId(@Param("programId") Integer programId,
                                     @Param("userId") Integer userId);

}
