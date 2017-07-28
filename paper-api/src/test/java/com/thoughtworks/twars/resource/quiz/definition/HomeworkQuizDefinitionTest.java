package com.thoughtworks.twars.resource.quiz.definition;

import com.thoughtworks.twars.bean.HomeworkQuiz;
import com.thoughtworks.twars.mapper.HomeworkQuizMapper;
import com.thoughtworks.twars.mapper.SectionMapper;
import com.thoughtworks.twars.mapper.SectionQuizMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.*;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class HomeworkQuizDefinitionTest {

    @Mock
    HomeworkQuizMapper mapper;

    @Mock
    HomeworkQuiz firstQuiz;

    @Mock
    HomeworkQuiz secondQuiz;

    @Mock
    SectionMapper sectionMapper;

    @Mock
    SectionQuizMapper sectionQuizMapper;

    @InjectMocks
    HomeworkQuizDefinitionService homeworkQuizDefinitionService;

    @Test
    public void should_return_correct_uri_list() throws Exception {
        when(mapper.findBySectionId(1)).thenReturn(Arrays.asList(firstQuiz, secondQuiz));

        when(firstQuiz.getId()).thenReturn(1);
        when(secondQuiz.getId()).thenReturn(2);

        List<Map> result = homeworkQuizDefinitionService.getQuizDefinition(1);

        assertThat(result.get(0).get("id"), is(1));
        assertThat(result.get(0).get("definition_uri"), is("homeworkQuizzes/1"));

        assertThat(result.get(1).get("id"), is(2));
        assertThat(result.get(1).get("definition_uri"), is("homeworkQuizzes/2"));
    }

    @Test
    public void should_return_uri_when_insert_paper_definition() {
        Map definition = new HashMap<>();
        definition.put("description", "找出数组 A 中与对象 B 中相同的数据");
        definition.put("evaluateScript","https://github.com/zhangsan/pos_inspection");
        definition.put("templateRepository", "https://github.com/zhangsan/pos_template");

        List<Map> definitions = new ArrayList<>();

        definitions.add(definition);

        Map quiz = new HashMap<>();
        quiz.put("definitions",definitions);

        List<Map> quizzes = new ArrayList<>();
        quizzes.add(quiz);

        Map homeworkQuiz = new HashMap<>();
        homeworkQuiz.put("quizType", "homeworkQuizzes");
        homeworkQuiz.put("description","homework 描述");
        homeworkQuiz.put("quizzes", quizzes);
        int paperId = 2;
        int returnId = homeworkQuizDefinitionService.insertQuizDefinition(homeworkQuiz, paperId);
        assertThat(returnId, is(2));
    }
}