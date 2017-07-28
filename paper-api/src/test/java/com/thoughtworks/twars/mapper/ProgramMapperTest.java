package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.Program;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;


public class ProgramMapperTest extends TestBase {

    private ProgramMapper programMapper;

    @Before
    public void setUp() throws Exception {
        super.setUp();
        programMapper = session.getMapper(ProgramMapper.class);
    }

    @Test
    public void should_return_users_uri_by_program_id() {
        List<Integer> usersId = programMapper.findUsersIdByProgramId(1);
        assertThat(usersId.size(), is(3));
    }

    @Test
    public void should_return_all_programs() {
        List<Program> programs = programMapper.getAllPrograms(0, 3);
        assertThat(programs.size(), is(3));

        assertEquals(programMapper.getAllPrograms(0, 0).size(), 0);
    }

    @Test
    public void should_insert_programs() {
        Program program = new Program();
        program.setName("五年级");

        programMapper.insertPrograms(program);

        assertThat(program.getId(), is(5));
    }

    @Test
    public void should_update_programs() {
        Program program = new Program();
        program.setId(1);
        program.setName("五年级");

        int reslut = programMapper.updatePrograms(program);

        assertThat(reslut, is(1));
    }

}