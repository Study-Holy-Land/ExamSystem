package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.BasicQuiz;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;

public class BasicQuizMapperTest extends TestBase {

    private BasicQuizMapper basicQuizMapper;

    @Before
    public void setUp() throws Exception {
        super.setUp();
        basicQuizMapper = session.getMapper(BasicQuizMapper.class);
    }

    @Test
    public void should_insert_basic_quiz() {
        BasicQuiz basicQuiz = new BasicQuiz();
        basicQuiz.setScoreSheetId(24);
        basicQuiz.setSectionId(1);
        basicQuizMapper.insertBasicQuiz(basicQuiz);
        Integer id = basicQuiz.getId();
        assertThat(id, is(8));
    }


    @Test
    public void should_return_sectionId_by_paperId() {
        List<Integer> sectionIds = basicQuizMapper.findSectionIdsByScoreSheetId(1);
        assertThat(sectionIds.size(), is(1));
    }

    @Test
    public void should_return_basic_quiz_By_ids() {
        Integer id = basicQuizMapper.getBasicQuizIdById(1, 1, 1);
        assertThat(id,is(7));
    }
}
