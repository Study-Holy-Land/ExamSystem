package com.thoughtworks.twars;

import com.thoughtworks.twars.filter.CacheContorlFilter;
import com.thoughtworks.twars.filter.CloseSessionResponseFilter;
import com.thoughtworks.twars.filter.OpenSessionRequestFilter;
import com.thoughtworks.twars.mapper.*;
import com.thoughtworks.twars.resource.quiz.definition.BlankQuizDefinitionService;
import com.thoughtworks.twars.resource.quiz.definition.HomeworkQuizDefinitionService;
import com.thoughtworks.twars.resource.quiz.scoresheet.BasicQuizScoreSheetService;
import com.thoughtworks.twars.resource.quiz.scoresheet.BlankQuizScoreSheetService;
import com.thoughtworks.twars.resource.quiz.scoresheet.HomeworkQuizScoreSheetService;
import com.thoughtworks.twars.util.DatabaseUtil;
import org.apache.ibatis.session.SqlSessionManager;
import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.server.ResourceConfig;

import javax.ws.rs.ApplicationPath;

@ApplicationPath("resources")
public class App extends ResourceConfig {

    public App() {

        SqlSessionManager session = DatabaseUtil.getSession();

        final UserMapper userMapper = session
                .getMapper(UserMapper.class);

        final PaperMapper paperMapper =
                session.getMapper(PaperMapper.class);

        final BlankQuizMapper blankQuizMapper = session
                .getMapper(BlankQuizMapper.class);

        final QuizItemMapper quizItemMapper = session
                .getMapper(QuizItemMapper.class);

        final SectionMapper sectionMapper = session
                .getMapper(SectionMapper.class);

        final SectionQuizMapper sectionQuizMapper = session
                .getMapper(SectionQuizMapper.class);

        final ScoreSheetMapper scoreSheetMapper = session
                .getMapper(ScoreSheetMapper.class);

        final BlankQuizSubmitMapper blankQuizSubmitMapper = session
                .getMapper(BlankQuizSubmitMapper.class);

        final ItemPostMapper itemPostMapper = session
                .getMapper(ItemPostMapper.class);

        final HomeworkQuizMapper homeworkQuizMapper = session
                .getMapper(HomeworkQuizMapper.class);

        final HomeworkSubmitMapper homeworkSubmitMapper = session
                .getMapper(HomeworkSubmitMapper.class);

        final HomeworkPostHistoryMapper homeworkPostHistoryMapper = session
                .getMapper(HomeworkPostHistoryMapper.class);

        final LoginDetailMapper loginDetailMapper = session
                .getMapper(LoginDetailMapper.class);

        final PasswordRetrieveDetailMapper passwordRetrieveDetailMapper = session
                .getMapper(PasswordRetrieveDetailMapper.class);

        final ThirdPartyMapper thirdPartyMapper = session
                .getMapper(ThirdPartyMapper.class);

        final PaperOperationMapper paperOperationMapper = session
                .getMapper(PaperOperationMapper.class);

        final PaperAndOperationMapper paperAndOperationMapper = session
                .getMapper(PaperAndOperationMapper.class);

        final BasicQuizPostHistoryMapper basicQuizPostHistoryMapper = session
                .getMapper(BasicQuizPostHistoryMapper.class);

        final BasicQuizSubmitMapper basicQuizSubmitMapper = session
                .getMapper(BasicQuizSubmitMapper.class);

        final BasicQuizMapper basicQuizMapper = session
                .getMapper(BasicQuizMapper.class);

        final BasicQuizScoreSheetService basicQuizScoreSheet = new BasicQuizScoreSheetService();
        basicQuizScoreSheet.setBasicQuizPostHistoryMapper(basicQuizPostHistoryMapper);
        basicQuizScoreSheet.setBasicQuizSubmitMapper(basicQuizSubmitMapper);
        basicQuizScoreSheet.setBasicQuizMapper(basicQuizMapper);
        basicQuizScoreSheet.setSectionMapper(sectionMapper);
        

        final BlankQuizScoreSheetService blankQuizScoreSheet = new BlankQuizScoreSheetService();
        blankQuizScoreSheet.setBlankQuizSubmitMapper(blankQuizSubmitMapper);
        blankQuizScoreSheet.setItemPostMapper(itemPostMapper);

        final HomeworkQuizScoreSheetService homeworkQuizScoreSheet =
                new HomeworkQuizScoreSheetService();
        homeworkQuizScoreSheet.setHomeworkPostHistoryMapper(homeworkPostHistoryMapper);
        homeworkQuizScoreSheet.setHomeworkSubmitMapper(homeworkSubmitMapper);

        final HomeworkQuizDefinitionService homeworkQuizDefinition =
                new HomeworkQuizDefinitionService();
        homeworkQuizDefinition.setMapper(homeworkQuizMapper);
        homeworkQuizDefinition.setSectionMapper(sectionMapper);
        homeworkQuizDefinition.setSectionQuizMapper(sectionQuizMapper);

        final BlankQuizDefinitionService blankQuizDefinition = new BlankQuizDefinitionService();
        blankQuizDefinition.setBlankQuizMapper(blankQuizMapper);
        blankQuizDefinition.setSectionMapper(sectionMapper);
        blankQuizDefinition.setSectionQuizMapper(sectionQuizMapper);

        final ProgramMapper programMapper = session
                .getMapper(ProgramMapper.class);
        final StackMapper stackMapper = session
                .getMapper(StackMapper.class);
        final HomeworkQuizOperationMapper homeworkQuizOperationMapper = session
                .getMapper(HomeworkQuizOperationMapper.class);
        final SingleChoiceMapper singleChoiceMapper = session
                .getMapper(SingleChoiceMapper.class);
        final MultipleChoiceMapper multipleChoiceMapper = session
                .getMapper(MultipleChoiceMapper.class);
        final BasicBlankQuizMapper basicBlankQuizMapper = session
                .getMapper(BasicBlankQuizMapper.class);

        register(OpenSessionRequestFilter.class);
        register(CloseSessionResponseFilter.class);
        register(CacheContorlFilter.class);

        packages("com.thoughtworks.twars.resource")
                .register(new AbstractBinder() {
                    @Override
                    protected void configure() {
                        bind(userMapper).to(UserMapper.class);
                        bind(paperMapper).to(PaperMapper.class);
                        bind(blankQuizMapper).to(BlankQuizMapper.class);
                        bind(quizItemMapper).to(QuizItemMapper.class);
                        bind(sectionMapper).to(SectionMapper.class);
                        bind(sectionQuizMapper).to(SectionQuizMapper.class);
                        bind(scoreSheetMapper).to(ScoreSheetMapper.class);
                        bind(blankQuizSubmitMapper).to(BlankQuizSubmitMapper.class);
                        bind(itemPostMapper).to(ItemPostMapper.class);
                        bind(homeworkQuizMapper).to(HomeworkQuizMapper.class);
                        bind(homeworkSubmitMapper).to(HomeworkSubmitMapper.class);
                        bind(homeworkPostHistoryMapper).to(HomeworkPostHistoryMapper.class);
                        bind(loginDetailMapper).to(LoginDetailMapper.class);
                        bind(basicQuizPostHistoryMapper).to(BasicQuizPostHistoryMapper.class);
                        bind(basicQuizSubmitMapper).to(BasicQuizSubmitMapper.class);
                        bind(basicQuizScoreSheet).to(BasicQuizScoreSheetService.class);
                        bind(blankQuizScoreSheet).to(BlankQuizScoreSheetService.class);
                        bind(homeworkQuizScoreSheet).to(HomeworkQuizScoreSheetService.class);
                        bind(homeworkQuizDefinition).to(HomeworkQuizDefinitionService.class);
                        bind(blankQuizDefinition).to(BlankQuizDefinitionService.class);
                        bind(passwordRetrieveDetailMapper).to(PasswordRetrieveDetailMapper.class);
                        bind(thirdPartyMapper).to(ThirdPartyMapper.class);
                        bind(paperOperationMapper).to(PaperOperationMapper.class);
                        bind(paperAndOperationMapper).to(PaperAndOperationMapper.class);
                        bind(programMapper).to(ProgramMapper.class);
                        bind(stackMapper).to(StackMapper.class);
                        bind(homeworkQuizOperationMapper).to(HomeworkQuizOperationMapper.class);
                        bind(singleChoiceMapper).to(SingleChoiceMapper.class);
                        bind(multipleChoiceMapper).to(MultipleChoiceMapper.class);
                        bind(basicBlankQuizMapper).to(BasicBlankQuizMapper.class);
                        bind(basicQuizMapper).to(BasicQuizMapper.class);
                        bind(session).to(SqlSessionManager.class);
                    }
                });
    }
}
