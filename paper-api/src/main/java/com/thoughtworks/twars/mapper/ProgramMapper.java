package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.Program;
import org.apache.ibatis.annotations.*;

import java.util.List;

public interface ProgramMapper {

    @Select("SELECT userId FROM userProgram WHERE userProgram.programId = #{id}")
    List<Integer> findUsersIdByProgramId(Integer id);

    @Select(" SELECT * FROM programs LIMIT #{newPage},#{pageSize};")
    @Results(value = {
            @Result(property = "id", column = "id"),
            @Result(property = "name", column = "name")
            })
    List<Program> getAllPrograms(
            @Param("newPage") Integer newPage,
            @Param("pageSize") Integer pageSize);

    @Insert(" INSERT INTO programs (name) VALUES (#{name});")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertPrograms(Program program);

    @Update("UPDATE programs SET name = #{name} WHERE id = #{id};")
    int updatePrograms(Program program);

}
