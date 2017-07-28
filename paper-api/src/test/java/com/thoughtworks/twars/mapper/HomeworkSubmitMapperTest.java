package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.HomeworkSubmit;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;

public class HomeworkSubmitMapperTest extends com.thoughtworks.twars.mapper.TestBase {
    private com.thoughtworks.twars.mapper.HomeworkSubmitMapper homeworkSubmitMapper;

    @Before
    public void setUp() throws Exception {
        super.setUp();
        homeworkSubmitMapper = session.getMapper(HomeworkSubmitMapper.class);
    }

    @Test
    public void should_return_id_when_insert_homework_submit() {
        HomeworkSubmit homeworkSubmit = new HomeworkSubmit();
        homeworkSubmit.setScoreSheetId(1);
        homeworkSubmit.setHomeworkQuizId(3);

        homeworkSubmitMapper.insertHomeworkSubmit(homeworkSubmit);
        assertThat(homeworkSubmit.getId(), is(8));
    }

    @Test
    public void should_return_one_homework_submit_by_quiz_id_and_scoresheet_id() {
        HomeworkSubmit homeworkSubmit = homeworkSubmitMapper.findByScoreSheetIdAndQuizId(1,1);

        assertThat(homeworkSubmit.getId(), is(1));
    }

    @Test
    public void should_return_homework_submit_list_by_scoresheet_id() {
        List<HomeworkSubmit> homeworkSubmitList = homeworkSubmitMapper.findByScoreSheetId(1);

        assertThat(homeworkSubmitList.size(), is(3));
    }

}
