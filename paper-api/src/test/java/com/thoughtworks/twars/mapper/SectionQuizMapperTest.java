package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.SectionQuiz;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;

public class SectionQuizMapperTest extends TestBase {

    private SectionQuizMapper sectionQuizMapper;

    @Before
    public void setUp() throws Exception {
        super.setUp();
        sectionQuizMapper = session.getMapper(SectionQuizMapper.class);
    }

    @Test
    public void should_return_one_section_quiz_when_find_by_section_id() {
        List<SectionQuiz> sectionQuizs = sectionQuizMapper.findBySectionId(1);

        assertThat(sectionQuizs.size(), is(2));
    }

    @Test
    public void should_return_id_when_insert_section_quiz() {
        SectionQuiz sectionQuiz = new SectionQuiz();
        sectionQuiz.setQuizId(1);
        sectionQuiz.setSectionId(2);
        sectionQuiz.setQuizType("blankQuiz");

        sectionQuizMapper.insertSectionQuiz(sectionQuiz);

        assertThat(sectionQuiz.getId(), is(32));
    }

    @Test
    public void should_return_sectionQuizId_by_sectionId_and_quizId() {
        Integer id = sectionQuizMapper.getSectionQuizIdBySectionIdAndQuizId(1, 1);
        assertThat(id, is(1));
    }

    @Test
    public void should_return_quiz_count_by_section_id() {
        Integer count = sectionQuizMapper.getQuizCountByPaperIdAndSectionId(1);
        assertThat(count, is(2));
    }
}
