package com.thoughtworks.twars.resource;

import com.thoughtworks.twars.mapper.*;
import com.thoughtworks.twars.resource.quiz.definition.BlankQuizDefinitionService;
import com.thoughtworks.twars.resource.quiz.definition.HomeworkQuizDefinitionService;
import com.thoughtworks.twars.resource.quiz.scoresheet.BasicQuizScoreSheetService;
import com.thoughtworks.twars.resource.quiz.scoresheet.BlankQuizScoreSheetService;
import com.thoughtworks.twars.resource.quiz.scoresheet.HomeworkQuizScoreSheetService;
import org.apache.ibatis.session.SqlSessionManager;
import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.test.JerseyTest;
import org.glassfish.jersey.test.TestProperties;

import javax.ws.rs.core.Application;

import static org.mockito.Mockito.mock;

public class TestBase extends JerseyTest {

    protected SqlSessionManager sqlSessionManager = mock(SqlSessionManager.class);
    protected PaperMapper paperMapper = mock(PaperMapper.class);
    protected PaperOperationMapper paperOperationMapper = mock(PaperOperationMapper.class);
    protected PaperAndOperationMapper paperAndOperationMapper = mock(PaperAndOperationMapper.class);
    protected UserMapper userMapper = mock(UserMapper.class);
    protected QuizItemMapper quizItemMapper = mock(QuizItemMapper.class);
    protected SectionMapper sectionMapper = mock(SectionMapper.class);
    protected SectionQuizMapper sectionQuizMapper = mock(SectionQuizMapper.class);
    protected BlankQuizMapper blankQuizMapper = mock(BlankQuizMapper.class);
    protected ScoreSheetMapper scoreSheetMapper = mock(ScoreSheetMapper.class);
    protected BlankQuizSubmitMapper blankQuizSubmitMapper = mock(BlankQuizSubmitMapper.class);
    protected ItemPostMapper itemPostMapper = mock(ItemPostMapper.class);
    protected HomeworkQuizMapper homeworkQuizMapper = mock(HomeworkQuizMapper.class);
    protected HomeworkSubmitMapper homeworkSubmitMapper = mock(HomeworkSubmitMapper.class);
    protected LoginDetailMapper loginDetailMapper = mock(LoginDetailMapper.class);
    protected PasswordRetrieveDetailMapper passwordRetrieveDetailMapper =
            mock(PasswordRetrieveDetailMapper.class);
    protected HomeworkPostHistoryMapper homeworkPostHistoryMapper =
            mock(HomeworkPostHistoryMapper.class);
    protected ThirdPartyMapper thirdPartyMapper = mock(ThirdPartyMapper.class);
    protected HomeworkQuizDefinitionService homeworkQuizDefinition =
            mock(HomeworkQuizDefinitionService.class);
    protected BlankQuizDefinitionService blankQuizDefinition =
            mock(BlankQuizDefinitionService.class);
    protected BlankQuizScoreSheetService blankQuizScoreSheet =
            mock(BlankQuizScoreSheetService.class);
    protected HomeworkQuizScoreSheetService homeworkQuizScoreSheet =
            mock(HomeworkQuizScoreSheetService.class);
    protected BasicQuizScoreSheetService basicQuizScoreSheet =
            mock(BasicQuizScoreSheetService.class);
    protected ProgramMapper programMapper = mock(ProgramMapper.class);
    protected StackMapper stackMapper = mock(StackMapper.class);
    protected HomeworkQuizOperationMapper homeworkQuizOperationMapper =
            mock(HomeworkQuizOperationMapper.class);
    protected BasicBlankQuizMapper basicBlankQuizMapper = mock(BasicBlankQuizMapper.class);
    protected SingleChoiceMapper singleChoiceMapper = mock(SingleChoiceMapper.class);
    protected MultipleChoiceMapper multipleChoiceMapper = mock(MultipleChoiceMapper.class);
    protected BasicQuizMapper basicQuizMapper = mock(BasicQuizMapper.class);
    protected BasicQuizSubmitMapper basicQuizSubmitMapper = mock(BasicQuizSubmitMapper.class);
    protected BasicQuizPostHistoryMapper basicQuizPostHistoryMapper =
            mock(BasicQuizPostHistoryMapper.class);

    @Override
    protected Application configure() {

        enable(TestProperties.DUMP_ENTITY);

        return new ResourceConfig().register(new AbstractBinder() {

            @Override
            protected void configure() {
                bind(paperMapper).to(PaperMapper.class);
                bind(paperOperationMapper).to(PaperOperationMapper.class);
                bind(paperAndOperationMapper).to(PaperAndOperationMapper.class);
                bind(userMapper).to(UserMapper.class);
                bind(quizItemMapper).to(QuizItemMapper.class);
                bind(sectionMapper).to(SectionMapper.class);
                bind(sectionQuizMapper).to(SectionQuizMapper.class);
                bind(blankQuizMapper).to(BlankQuizMapper.class);
                bind(scoreSheetMapper).to(ScoreSheetMapper.class);
                bind(blankQuizSubmitMapper).to(BlankQuizSubmitMapper.class);
                bind(itemPostMapper).to(ItemPostMapper.class);
                bind(homeworkQuizMapper).to(HomeworkQuizMapper.class);
                bind(homeworkSubmitMapper).to(HomeworkSubmitMapper.class);
                bind(homeworkPostHistoryMapper).to(HomeworkPostHistoryMapper.class);
                bind(loginDetailMapper).to(LoginDetailMapper.class);
                bind(passwordRetrieveDetailMapper).to(PasswordRetrieveDetailMapper.class);
                bind(homeworkQuizDefinition).to(HomeworkQuizDefinitionService.class);
                bind(blankQuizDefinition).to(BlankQuizDefinitionService.class);
                bind(blankQuizScoreSheet).to(BlankQuizScoreSheetService.class);
                bind(basicQuizScoreSheet).to(BasicQuizScoreSheetService.class);
                bind(homeworkQuizScoreSheet).to(HomeworkQuizScoreSheetService.class);
                bind(sqlSessionManager).to(SqlSessionManager.class);
                bind(thirdPartyMapper).to(ThirdPartyMapper.class);
                bind(programMapper).to(ProgramMapper.class);
                bind(stackMapper).to(StackMapper.class);
                bind(homeworkQuizOperationMapper).to(HomeworkQuizOperationMapper.class);
                bind(basicBlankQuizMapper).to(BasicBlankQuizMapper.class);
                bind(singleChoiceMapper).to(SingleChoiceMapper.class);
                bind(multipleChoiceMapper).to(MultipleChoiceMapper.class);
                bind(basicQuizMapper).to(BasicQuizMapper.class);
                bind(basicQuizSubmitMapper).to(BasicQuizSubmitMapper.class);
                bind(basicQuizPostHistoryMapper).to(BasicQuizPostHistoryMapper.class);
            }
        }).packages("com.thoughtworks.twars.resource");
    }

}
