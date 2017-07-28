package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.HomeworkQuiz;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;


public class HomeworkQuizMapperTest extends TestBase {
    private HomeworkQuizMapper homeworkQuizMapper;

    @Before
    public void setUp() throws Exception {
        super.setUp();
        homeworkQuizMapper = session.getMapper(HomeworkQuizMapper.class);
    }

    @Test
    public void should_insert_homework_quiz() {
        HomeworkQuiz homeworkQuiz = new HomeworkQuiz();

        homeworkQuiz.setDescription("找出两个数组相同的数据");
        homeworkQuiz.setEvaluateScript("https://github.com/zhangsan/pos_inspection");
        homeworkQuiz.setTemplateRepository("https://github.com/zhangsan/pos_template");
        homeworkQuiz.setMakerId(1);
        homeworkQuiz.setCreateTime(1234);
        homeworkQuiz.setHomeworkName("test");
        homeworkQuiz.setStackId(1);
        homeworkQuiz.setAnswerPath("/homework-answer/collection");
        homeworkQuiz.setRawId(0);
        homeworkQuizMapper.insertHomeworkQuiz(homeworkQuiz);

        assertThat(homeworkQuiz.getId(), is(10));
    }

    @Test
    public void should_return_homework_list_when_by_section_id() {
        List<HomeworkQuiz> homeworkQuizList = homeworkQuizMapper.findBySectionId(2);

        assertThat(homeworkQuizList.size(), is(8));
    }

    @Test
    public void should_return_one_homework_quiz_when_by_id() {
        HomeworkQuiz homeworkQuiz = homeworkQuizMapper.findById(1);

        assertThat(homeworkQuiz.getEvaluateScript(), is("/homework-script/check-readme.sh"));
        assertThat(homeworkQuiz.getTemplateRepository(), is(""));
    }

    @Test
    public void should_return_homework_quizzes_by_search_name_and_stackId() {
        List<HomeworkQuiz> homeworkQuizzes = homeworkQuizMapper
                .findHomeworkQuizzes("hom", 1, 0, 15);

        assertThat(homeworkQuizzes.size(), is(1));
    }

    @Test
    public void should_return_homework_quizzes_by_search_homework_name() {
        List<HomeworkQuiz> homeworkQuizzes = homeworkQuizMapper
                .findHomeworkQuizzes("hom", null, 0, 15);
        assertThat(homeworkQuizzes.size(), is(4));
    }

    @Test
    public void should_return_homework_quizzes_by_search_homework_stackId() {
        List<HomeworkQuiz> homeworkQuizzes = homeworkQuizMapper
                .findHomeworkQuizzes(null, 1, 0, 15);
        assertThat(homeworkQuizzes.size(), is(1));
    }

    @Test
    public void should_return_homework_quizzes_by_search() {
        List<HomeworkQuiz> homeworkQuizzes = homeworkQuizMapper
                .findHomeworkQuizzes(null, null, 0, 15);
        assertThat(homeworkQuizzes.size(), is(4));
    }

    @Test
    public void should_return_none_when_search_homework_quizzes() {
        List<HomeworkQuiz> homeworkQuizzes = homeworkQuizMapper
                .findHomeworkQuizzes("test", 5, 0, 15);
        assertThat(homeworkQuizzes.size(), is(0));
    }

    @Test
    public void should_insert_rawId() {

        HomeworkQuiz homeworkQuiz = new HomeworkQuiz();

        homeworkQuiz.setDescription("找出两个数组相同的数据");
        homeworkQuiz.setEvaluateScript("https://github.com/zhangsan/pos_inspection");
        homeworkQuiz.setTemplateRepository("https://github.com/zhangsan/pos_template");
        homeworkQuiz.setMakerId(1);
        homeworkQuiz.setCreateTime(1234);
        homeworkQuiz.setHomeworkName("test");
        homeworkQuiz.setStackId(1);
        homeworkQuiz.setAnswerPath("/homework-answer/collection");
        homeworkQuiz.setRawId(0);

        homeworkQuizMapper.insertHomeworkQuiz(homeworkQuiz);
        Integer id = homeworkQuiz.getId();
        homeworkQuizMapper.updateRawId(id);


        assertThat(homeworkQuizMapper.findById(id).getRawId(), is(id));
    }
}