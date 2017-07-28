package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.PaperOperation;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;

public class PaperOperationMapperTest extends TestBase {
    private PaperOperationMapper paperOperationMapper;

    @Before
    public void setUp() throws Exception {
        super.setUp();
        paperOperationMapper = session.getMapper(PaperOperationMapper.class);
    }

    @Test
    public void should_insert_paper_operation() {
        PaperOperation paperOperation = new PaperOperation();
        paperOperation.setOperationType("delete");
        paperOperation.setOperatorId(1);
        paperOperation.setPaperId(2);

        int result = paperOperationMapper.insertPaperOperation(paperOperation);
        assertThat(result, is(1));
    }
}
