package com.thoughtworks.twars.resource.quiz.scoresheet;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.thoughtworks.twars.bean.HomeworkPostHistory;
import com.thoughtworks.twars.bean.HomeworkSubmit;
import com.thoughtworks.twars.mapper.HomeworkPostHistoryMapper;
import com.thoughtworks.twars.mapper.HomeworkSubmitMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.*;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)

public class HomeworkQuizScoreSheetTest {

    @Mock
    HomeworkPostHistoryMapper homeworkPostHistoryMapper;

    @Mock
    HomeworkSubmitMapper homeworkSubmitMapper;

    @Mock
    HomeworkPostHistory homeworkPostHistory;

    @Mock
    HomeworkSubmit homeworkSubmit;

    @InjectMocks
    HomeworkQuizScoreSheetService homeworkQuizScoreSheet;

    @Test
    public void should_return_homework_list() {
        Gson gson = new GsonBuilder().create();
        when(homeworkSubmitMapper.findByScoreSheetId(1))
                .thenReturn(Arrays.asList(homeworkSubmit));
        when(homeworkSubmit.getHomeworkQuizId()).thenReturn(3);
        when(homeworkSubmit.getId()).thenReturn(3);
        when(homeworkPostHistoryMapper.findByHomeworkSubmitId(3))
                .thenReturn(Arrays.asList(homeworkPostHistory));
        when(homeworkPostHistory.getId()).thenReturn(3);
        when(homeworkPostHistory.getStartTime()).thenReturn(123);
        when(homeworkPostHistory.getCommitTime()).thenReturn(123);
        when(homeworkPostHistory.getStatus()).thenReturn(2);

        List<Map> homeworkList = homeworkQuizScoreSheet.getQuizScoreSheet(1);
        String str = gson.toJson(homeworkList);
        assertThat(str, is("[{\"homeworkQuiz\":{\"uri\":\"3\"},\"homeworkSubmitPostHistory\":[{"
                +
                "\"commitTime\":123,\"startTime\":123,\"status\":2}]}]"));
    }

    @Test
    public void should_return_homework_post_history_list() {
        when(homeworkPostHistoryMapper.findByHomeworkSubmitId(1))
                .thenReturn(Arrays.asList(homeworkPostHistory));
        when(homeworkPostHistory.getBranch()).thenReturn("dev");
        when(homeworkPostHistory.getVersion()).thenReturn("ghjkl");
        when(homeworkPostHistory.getStatus()).thenReturn(7);
        when(homeworkPostHistory.getCommitTime()).thenReturn(5678);
        when(homeworkPostHistory.getUserAnswerRepo())
                .thenReturn("github.com/jingjing");
        when(homeworkPostHistory.getStartTime()).thenReturn(123456);
        Gson gson = new GsonBuilder().create();
        List<Map> homeworkPostHistoryList = homeworkQuizScoreSheet
                .findByHomeworkSubmitId(1);
        String homeworkPostHistoryStr = gson.toJson(homeworkPostHistoryList);
        assertThat(homeworkPostHistoryStr,
                is("[{\"commitTime\":5678,\"startTime\":123456,\"userAnswerRepo\":"
                        +
                        "\"github.com/jingjing\",\"branch\":\"dev\",\"version\":\"ghjkl\","
                        +
                        "\"status\":7}]"));
    }

    @Test
    public void insert_homework_score_sheet() {
        Map homeworkSubmitPostHistory = new HashMap<>();
        homeworkSubmitPostHistory.put("homeworkURL","fghjk");
        homeworkSubmitPostHistory.put("version","jkl");
        homeworkSubmitPostHistory.put("branch","dev");
        homeworkSubmitPostHistory.put("status", 9);
        homeworkSubmitPostHistory.put("commitTime", 56789);
        homeworkSubmitPostHistory.put("startTime", 90739);
        homeworkSubmitPostHistory.put("resultURL", "twer");

        Map homeworkSubmit = new HashMap<>();

        List homeworkPostHistoryList = new ArrayList<>();
        homeworkPostHistoryList.add(homeworkSubmitPostHistory);

        homeworkSubmit.put("homeworkQuizId", 8);
        homeworkSubmit.put("homeworkSubmitPostHistory",homeworkPostHistoryList);

        List<Map> homeworkSubmits = new ArrayList<>();
        homeworkSubmits.add(homeworkSubmit);
        Map data = new HashMap<>();
        data.put("examerId", 2);
        data.put("paperId", 4);
        data.put("homeworkSubmits",homeworkSubmits);
        homeworkQuizScoreSheet.insertQuizScoreSheet(data, 3, 1);
    }
}