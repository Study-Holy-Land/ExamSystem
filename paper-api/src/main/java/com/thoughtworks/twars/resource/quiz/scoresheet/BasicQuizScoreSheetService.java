package com.thoughtworks.twars.resource.quiz.scoresheet;


import com.thoughtworks.twars.bean.BasicQuiz;
import com.thoughtworks.twars.bean.BasicQuizPostHistory;
import com.thoughtworks.twars.bean.BasicQuizSubmit;
import com.thoughtworks.twars.mapper.BasicQuizMapper;
import com.thoughtworks.twars.mapper.BasicQuizPostHistoryMapper;
import com.thoughtworks.twars.mapper.BasicQuizSubmitMapper;
import com.thoughtworks.twars.mapper.SectionMapper;

import javax.inject.Inject;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class BasicQuizScoreSheetService implements IScoreSheetService {
    @Inject
    private BasicQuizPostHistoryMapper basicQuizPostHistoryMapper;

    @Inject
    private BasicQuizSubmitMapper basicQuizSubmitMapper;

    @Inject
    private BasicQuizMapper basicQuizMapper;

    @Inject
    private SectionMapper sectionMapper;

    public void setBasicQuizPostHistoryMapper(
            BasicQuizPostHistoryMapper basicQuizPostHistoryMapper) {
        this.basicQuizPostHistoryMapper = basicQuizPostHistoryMapper;
    }

    public void setBasicQuizSubmitMapper(BasicQuizSubmitMapper basicQuizSubmitMapper) {
        this.basicQuizSubmitMapper = basicQuizSubmitMapper;
    }

    public void setBasicQuizMapper(BasicQuizMapper basicQuizMapper) {
        this.basicQuizMapper = basicQuizMapper;
    }

    public void setSectionMapper(SectionMapper sectionMapper) {
        this.sectionMapper = sectionMapper;
    }

    @Override
    public List<Map> getQuizScoreSheet(int scoreSheetId) {
        Integer basicQuizId =  basicQuizMapper.findByScoreSheetId(scoreSheetId);
        return basicQuizSubmitMapper.findByBasicQuizId(basicQuizId)
                .stream()
                .map(basicQuizSubmit -> {
                    Map<String, Object> basicQuizUri = new HashMap<>();
                    basicQuizUri.put("uri", "/basicQuiz/" + basicQuizSubmit.getBasicQuizId());
                    Map<String, Object> basicQuizSubmitUri = new HashMap<>();
                    basicQuizSubmitUri.put("basicQuiz", basicQuizUri);
                    basicQuizSubmitUri.put("startTime", basicQuizSubmit.getStartTime());
                    basicQuizSubmitUri.put("endTime", basicQuizSubmit.getEndTime());
                    basicQuizSubmitUri.put("basicQuizPostHistory",
                            getByBasicQuizSubmitId(basicQuizSubmit.getId()));
                    return basicQuizSubmitUri;
                })
                .collect(Collectors.toList());
    }

    public List<Map> getByBasicQuizSubmitId(int basicQuizSubmitId) {
        return basicQuizPostHistoryMapper.findByBasicQuizSubmitId(basicQuizSubmitId)
                .stream()
                .map(basicQuizPost -> {

                    Map<String, Object> basicQuizItemUri = new HashMap<>();
                    if (basicQuizPost.getType().equals("SINGLE_CHOICE")) {
                        basicQuizItemUri.put("uri",
                                "singleChoices/" + basicQuizPost.getBasicQuizItemId());
                    }
                    if (basicQuizPost.getType().equals("MULTIPLE_CHOICE")) {
                        basicQuizItemUri.put("uri",
                                "multipleChoices/" + basicQuizPost.getBasicQuizItemId());
                    }
                    if (basicQuizPost.getType().equals("BASIC_BLANK_QUIZ")) {
                        basicQuizItemUri.put("uri",
                                "basicBlankQuizzes/" + basicQuizPost.getBasicQuizItemId());
                    }
                    Map<String, Object> basicQuizPostHistoryUri = new HashMap<>();
                    basicQuizPostHistoryUri.put("answer", basicQuizPost.getUserAnswer());
                    basicQuizPostHistoryUri.put("quizItem", basicQuizItemUri);
                    return basicQuizPostHistoryUri;
                })
                .collect(Collectors.toList());
    }

    @Override
    public void insertQuizScoreSheet(Map data, int scoreSheetId, int paperId) {
        BasicQuiz basicQuiz = new BasicQuiz();

        basicQuiz.setSectionId((Integer) data.get("sectionId"));
        basicQuiz.setScoreSheetId(scoreSheetId);

        basicQuizMapper.insertBasicQuiz(basicQuiz);
        Integer basicQuizId = basicQuiz.getId();

        List<Map> basicQuizSubmits = (List<Map>) data.get("basicQuizSubmits");
        basicQuizSubmits.forEach(submitItem -> {
            BasicQuizSubmit basicQuizSubmit = new BasicQuizSubmit();
            basicQuizSubmit.setStartTime((Integer) submitItem.get("startTime"));
            basicQuizSubmit.setEndTime((Integer) submitItem.get("endTime"));
            basicQuizSubmit.setBasicQuizId(basicQuizId);

            basicQuizSubmitMapper.insertBasicQuizSubmit(basicQuizSubmit);

            Integer basicQuizSubmitId = basicQuizSubmit.getId();

            List<Map> basicQuizPosts = (List<Map>) submitItem.get("basicQuizPosts");

            basicQuizPosts.forEach(postItem -> {
                BasicQuizPostHistory basicQuizPostHistory = new BasicQuizPostHistory();
                basicQuizPostHistory.setBasicQuizSubmitId(basicQuizSubmitId);
                basicQuizPostHistory.setBasicQuizItemId((Integer) postItem.get("id"));
                basicQuizPostHistory.setType((String) postItem.get("type"));
                basicQuizPostHistory.setUserAnswer((String) postItem.get("answer"));

                basicQuizPostHistoryMapper.insertBasicQuizHistory(basicQuizPostHistory);
            });

        });
    }


}
