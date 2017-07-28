package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.PaperAndOperation;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;

public class PaperAndOperationMapperTest extends TestBase {
    private PaperAndOperationMapper paperAndOperationMapper;

    @Before
    public void setUp() throws Exception {
        super.setUp();
        paperAndOperationMapper = session.getMapper(PaperAndOperationMapper.class);
    }

    @Test
    public void should_return_papers_by_programId() throws Exception {
        List<PaperAndOperation> papers = paperAndOperationMapper.findPapersByProgramId(1);
        assertThat(papers.size(), is(1));
    }
}
