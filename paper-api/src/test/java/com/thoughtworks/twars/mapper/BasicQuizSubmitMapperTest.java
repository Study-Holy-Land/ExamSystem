package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.BasicQuizSubmit;
import org.junit.Before;
import org.junit.Test;

import java.util.List;
import java.util.Map;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;

public class BasicQuizSubmitMapperTest extends TestBase {

    private BasicQuizSubmitMapper basicQuizSubmitMapper;

    @Before
    public void setUp() throws Exception {
        super.setUp();
        basicQuizSubmitMapper = session.getMapper(BasicQuizSubmitMapper.class);
    }

    @Test
    public void should_insert_basic_quiz_submit() {
        BasicQuizSubmit basicQuizSubmit = new BasicQuizSubmit();
        basicQuizSubmit.setBasicQuizId(1);
        basicQuizSubmit.setStartTime(4343433);
        basicQuizSubmit.setEndTime(5443423);
        basicQuizSubmitMapper.insertBasicQuizSubmit(basicQuizSubmit);

        Integer id = basicQuizSubmit.getId();
        assertThat(id, is(2));
    }

    @Test
    public void should_return_basic_quiz_submit_all_by_scoreSheetId() {
        List<BasicQuizSubmit> basicQuizSubmits =
                basicQuizSubmitMapper.findByBasicQuizId(1);
        assertThat(basicQuizSubmits.size(), is(1));
    }

    @Test
    public void should_return_basic_quiz_submit_by_basic_quiz_id() {
        Map result = basicQuizSubmitMapper.getBaiscQuizSubmitByBasicQuizId(1);
        assertThat(result.get("id"), is(1));
        assertThat(result.get("startTime"), is(4343433));
        assertThat(result.get("endTime"), is(5443423));
    }
}
