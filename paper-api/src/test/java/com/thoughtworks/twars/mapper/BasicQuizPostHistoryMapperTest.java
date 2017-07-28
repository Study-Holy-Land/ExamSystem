package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.BasicQuizPostHistory;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;

public class BasicQuizPostHistoryMapperTest extends TestBase {

    private BasicQuizPostHistoryMapper basicQuizPostHistoryMapper;

    @Before
    public void setUp() throws Exception {
        super.setUp();
        basicQuizPostHistoryMapper = session.getMapper(BasicQuizPostHistoryMapper.class);
    }

    @Test
    public void should_return_basic_quiz_submit_all_by_scoreSheetId() {
        List<BasicQuizPostHistory> basicQuizPostHistoryList =
                basicQuizPostHistoryMapper.findByBasicQuizSubmitId(1);
        assertThat(basicQuizPostHistoryList.size(), is(1));
    }

    @Test
    public void should_insert_basic_post_history() {

        BasicQuizPostHistory basicQuizPostHistory = new BasicQuizPostHistory();
        basicQuizPostHistory.setBasicQuizItemId(1);
        basicQuizPostHistory.setBasicQuizSubmitId(1);
        basicQuizPostHistory.setType("SINGLE_CHOICE");
        basicQuizPostHistory.setUserAnswer("343");

        Integer id = basicQuizPostHistoryMapper.insertBasicQuizHistory(basicQuizPostHistory);
        assertThat(id, is(1));
    }

}
