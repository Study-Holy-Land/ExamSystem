package com.thoughtworks.twars.resource.quiz.scoresheet;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.thoughtworks.twars.bean.BlankQuizSubmit;
import com.thoughtworks.twars.bean.ItemPost;
import com.thoughtworks.twars.mapper.BlankQuizSubmitMapper;
import com.thoughtworks.twars.mapper.ItemPostMapper;
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
public class BlankQuizScoreSheetTest {

    @Mock
    BlankQuizSubmitMapper blankQuizSubmitMapper;

    @Mock
    ItemPostMapper itemPostMapper;

    @Mock
    ItemPost itemPost;

    @Mock
    BlankQuizSubmit blankQuizSubmit;

    @InjectMocks
    BlankQuizScoreSheetService blankQuizScoreSheet;

    @Test
    public void should_return_blank_quiz_list() {
        Gson gson = new GsonBuilder().create();
        when(blankQuizSubmitMapper.findByScoreSheetId(1))
                .thenReturn(Arrays.asList(blankQuizSubmit));
        when(blankQuizSubmit.getBlankQuizId()).thenReturn(2);
        when(blankQuizSubmit.getStartTime()).thenReturn(123456);
        when(blankQuizSubmit.getEndTime()).thenReturn(123456);
        List<Map> blankQuizList = blankQuizScoreSheet.getQuizScoreSheet(1);
        String str = gson.toJson(blankQuizList);
        assertThat(str, is("[{\"blankQuiz\":{\"uri\":\"/blankQuiz/2\"},"
                +
                "\"startTime\":123456,\"endTime\":123456,\"itemPosts\":[]}]"));
    }

    @Test
    public void should_return_item_post_list() {
        when(itemPostMapper.findByBlankQuizSubmit(1))
                .thenReturn(Arrays.asList(itemPost));
        when(itemPost.getAnswer()).thenReturn("success");
        when(itemPost.getQuizItemId()).thenReturn(3);

        Gson gson = new GsonBuilder().create();
        List<Map> itemPosts = blankQuizScoreSheet.getByBlankQuizSubmitId(1);
        String itemPostStr = gson.toJson(itemPosts);
        assertThat(itemPostStr, is("[{\"answer\":\"success\",\"quizItem\":{"
                +
                "\"uri\":\"quizItem/3\"}}]"));
    }

    @Test
    public void should_return_score_sheet_uri() {
        List<Map> itemPosts = new ArrayList<>();
        Map itemPost = new HashMap<>();
        itemPost.put("answer", "10");
        itemPost.put("quizItemId", 8);
        itemPosts.add(itemPost);
        Map blankQuizSubmit = new HashMap<>();
        blankQuizSubmit.put("blankQuizId", 9);
        blankQuizSubmit.put("startTime", 123456);
        blankQuizSubmit.put("endTime", 123456);
        blankQuizSubmit.put("itemPosts", itemPosts);
        List<Map> blankQuizSubmits = new ArrayList<>();
        blankQuizSubmits.add(blankQuizSubmit);
        Map data = new HashMap<>();
        data.put("examerId", 2);
        data.put("paperId", 4);
        data.put("blankQuizSubmits", blankQuizSubmits);
        blankQuizScoreSheet.insertQuizScoreSheet(data, 2, 1);
    }
}