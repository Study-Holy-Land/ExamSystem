package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.MultipleChoice;
import com.thoughtworks.twars.bean.SingleChoice;
import org.junit.Before;
import org.junit.Test;


import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;

public class MultipleChoiceMapperTest extends TestBase {

    private MultipleChoiceMapper multipleChoiceMapper;

    @Before
    public void setUp() throws Exception {
        super.setUp();
        multipleChoiceMapper = session.getMapper(MultipleChoiceMapper.class);
    }

    @Test
    public void should_insert_multipleChoice() throws Exception {
        MultipleChoice multipleChoice = new MultipleChoice();
        multipleChoice.setOptions("ss,aa,cc,bb");
        multipleChoice.setType("MULTIPLE_CHOICE");
        multipleChoice.setDescription("这是第三道多选题");
        multipleChoice.setAnswer("ss");

        multipleChoiceMapper.insertMultipleChoice(multipleChoice);
        assertThat(multipleChoice.getId(), is(3));
    }

    @Test
    public void should_get_multipleChoice() throws Exception {
        MultipleChoice multipleChoice = multipleChoiceMapper.getMultipleChoiceById(1);
        assertThat(multipleChoice.getDescription(), is("这是第一道多选题"));
        assertThat(multipleChoice.getAnswer(), is("3,4"));
        assertThat(multipleChoice.getOptions(), is("1,2,3,4"));
        assertThat(multipleChoice.getType(), is("MULTIPLE_CHOICE"));
    }

    @Test
    public void should_update_multipleChoice_by_id() throws Exception {

        MultipleChoice multipleChoice = new MultipleChoice();
        multipleChoice.setOptions("ss,aa,cc,bb");
        multipleChoice.setType("MULTIPLE_CHOICE");
        multipleChoice.setDescription("这是第三道多选题");
        multipleChoice.setAnswer("33");
        multipleChoice.setId(1);

        Integer id = multipleChoiceMapper.updateMultipleChoice(multipleChoice);

        assertThat(id, is(1));
    }

    @Test
    public void should_return_answer_by_id() throws Exception {
        String answer = multipleChoiceMapper.findAnswerById(2);
        assertThat(answer, is("5,6"));

    }
}