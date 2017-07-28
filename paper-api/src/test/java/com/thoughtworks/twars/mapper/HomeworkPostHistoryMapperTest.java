package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.HomeworkPostHistory;
import org.junit.Before;
import org.junit.Test;

import java.util.List;
import java.util.Map;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;

public class HomeworkPostHistoryMapperTest extends TestBase {
    private HomeworkPostHistoryMapper homeworkPostHistoryMapper;

    @Before
    public void setUp() throws Exception {
        super.setUp();
        homeworkPostHistoryMapper = session.getMapper(HomeworkPostHistoryMapper.class);
    }

    @Test
    public void should_return_id_when_insert_homework_post_history() {
        HomeworkPostHistory homeworkPostHistory = new HomeworkPostHistory();
        homeworkPostHistory.setHomeworkSubmitId(1);
        homeworkPostHistory.setStatus(3);
        homeworkPostHistory.setUserAnswerRepo("github.com/anlihuer/1");
        homeworkPostHistory.setVersion("d8160f56ebbb5d40368048f271328eefa87cb");
        homeworkPostHistory.setBranch("master");
        homeworkPostHistory.setCommitTime(1453287441);
        homeworkPostHistory.setStartTime(12345634);
        homeworkPostHistory.setResult("ufaififiifoe");

        homeworkPostHistoryMapper.insertHomeworkPostHistory(homeworkPostHistory);

        assertThat(homeworkPostHistory.getId(), is(5));
    }

    @Test
    public void should_return_all_homework_post_history() {
        List<HomeworkPostHistory> homeworkPostHistoryList =
                homeworkPostHistoryMapper.findByHomeworkSubmitId(1);

        assertThat(homeworkPostHistoryList.get(0).getBranch(), is("master"));
        assertThat(homeworkPostHistoryList.get(0).getVersion(),
                is("d8160f56ebbb5d40368048f271328eefa87cb97d"));
        assertThat(homeworkPostHistoryList.get(0).getUserAnswerRepo(), is("github.com/purple/1"));
        assertThat(homeworkPostHistoryList.get(0).getId(), is(1));
        assertThat(homeworkPostHistoryList.get(0).getStatus(), is(4));
        assertThat(homeworkPostHistoryList.get(0).getCommitTime(), is(1563287441));
    }

    @Test
    public void should_return_user_homework_post_history() {
        List<Map> homeworkPostHistoryList =
                homeworkPostHistoryMapper.getHistoryByExamerIdAndPaperId(1,1);
        assertThat(homeworkPostHistoryList.size(), is(3));
    }

}
