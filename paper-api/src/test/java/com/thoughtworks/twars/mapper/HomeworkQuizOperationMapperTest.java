package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.HomeworkQuizOperation;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;

public class HomeworkQuizOperationMapperTest extends TestBase {
    private HomeworkQuizOperationMapper homeworkQuizOperationMapper;

    @Before
    public void setUp() throws Exception {
        super.setUp();
        homeworkQuizOperationMapper = session.getMapper(HomeworkQuizOperationMapper.class);
    }

    @Test
    public void should_insert_homework_quiz_operation() {
        HomeworkQuizOperation homeworkQuizOperation = new HomeworkQuizOperation();
        homeworkQuizOperation.setOperationType("delete");
        homeworkQuizOperation.setOperatorId(1);
        homeworkQuizOperation.setHomeworkQuizId(2);

        int result = homeworkQuizOperationMapper.insertHomeworkQuizOperation(homeworkQuizOperation);

        assertThat(result, is(1));
    }
}
