package com.thoughtworks.twars.resource.quiz.scoresheet;

import com.thoughtworks.twars.bean.HomeworkPostHistory;
import com.thoughtworks.twars.bean.HomeworkSubmit;
import com.thoughtworks.twars.mapper.HomeworkPostHistoryMapper;
import com.thoughtworks.twars.mapper.HomeworkSubmitMapper;

import javax.inject.Inject;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class HomeworkQuizScoreSheetService implements IScoreSheetService {
    @Inject
    private HomeworkSubmitMapper homeworkSubmitMapper;

    @Inject
    private HomeworkPostHistoryMapper homeworkPostHistoryMapper;

    public void setHomeworkSubmitMapper(HomeworkSubmitMapper homeworkSubmitMapper) {
        this.homeworkSubmitMapper = homeworkSubmitMapper;
    }

    public void setHomeworkPostHistoryMapper(HomeworkPostHistoryMapper homeworkPostHistoryMapper) {
        this.homeworkPostHistoryMapper = homeworkPostHistoryMapper;
    }

    @Override
    public List<Map> getQuizScoreSheet(int scoreSheetId) {
        return homeworkSubmitMapper.findByScoreSheetId(scoreSheetId)
                .stream()
                .map(homeworkQuizSubmit -> {
                    Map<String, Object> homeworkQuizUri = new HashMap<>();
                    homeworkQuizUri.put("uri", "homeworkQuiz/"
                            + homeworkQuizSubmit.getHomeworkQuizId());
                    homeworkQuizUri.put("uri", "" + homeworkQuizSubmit.getHomeworkQuizId());
                    Map<String, Object> homeworkQuizSubmitUri = new HashMap<>();
                    homeworkQuizSubmitUri.put("homeworkQuiz", homeworkQuizUri);
                    homeworkQuizSubmitUri.put("homeworkSubmitPostHistory",
                            findByHomeworkSubmitId(homeworkQuizSubmit.getId()));
                    return homeworkQuizSubmitUri;
                })
                .collect(Collectors.toList());
    }

    public List<Map> findByHomeworkSubmitId(int homeworkSubmitId) {
        return homeworkPostHistoryMapper.findByHomeworkSubmitId(homeworkSubmitId)
                .stream()
                .map(homeworkPostHistory -> {
                    Map<String, Object> homeworkPostHistoryUri = new HashMap<>();
                    homeworkPostHistoryUri.put("userAnswerRepo",
                            homeworkPostHistory.getUserAnswerRepo());
                    homeworkPostHistoryUri.put("branch", homeworkPostHistory.getBranch());
                    homeworkPostHistoryUri.put("version", homeworkPostHistory.getVersion());
                    homeworkPostHistoryUri.put("commitTime", homeworkPostHistory.getCommitTime());
                    homeworkPostHistoryUri.put("startTime", homeworkPostHistory.getStartTime());
                    homeworkPostHistoryUri.put("status", homeworkPostHistory.getStatus());
                    homeworkPostHistoryUri.put("result", homeworkPostHistory.getResult());
                    return homeworkPostHistoryUri;
                })
                .collect(Collectors.toList());
    }

    @Override
    public void insertQuizScoreSheet(Map data, int scoreSheetId, int paperId) {

        List<Map> homeworkSubmits = (List<Map>) data.get("homeworkSubmits");

        homeworkSubmits.forEach(item -> {
            int homeworkQuizId = (int) item.get("homeworkQuizId");

            HomeworkSubmit homeworkSubmit =
                    homeworkSubmitMapper.findByScoreSheetIdAndQuizId(scoreSheetId, homeworkQuizId);
            if (null == homeworkSubmit) {
                homeworkSubmit = new HomeworkSubmit();
                homeworkSubmit.setScoreSheetId(scoreSheetId);
                homeworkSubmit.setHomeworkQuizId(homeworkQuizId);

                homeworkSubmitMapper.insertHomeworkSubmit(homeworkSubmit);
            }

            final HomeworkSubmit existHomeworkSubmit = homeworkSubmit;


            List<Map> homeworkSubmitPostHistoryList =
                    (List<Map>) item.get("homeworkSubmitPostHistory");

            homeworkSubmitPostHistoryList.forEach(h -> {
                HomeworkPostHistory homeworkPostHistory = new HomeworkPostHistory();

                homeworkPostHistory.setBranch((String) h.get("branch"));
                homeworkPostHistory.setVersion((String) h.get("version"));
                homeworkPostHistory.setUserAnswerRepo((String) h
                        .get("userAnswerRepo"));
                homeworkPostHistory.setStatus((Integer) h.get("status"));
                homeworkPostHistory.setHomeworkSubmitId(existHomeworkSubmit.getId());
                homeworkPostHistory.setStartTime((Integer) h.get("startTime"));
                homeworkPostHistory.setCommitTime(
                        (Integer) h.get("commitTime"));
                homeworkPostHistory.setResult((String) h.get("result"));

                homeworkPostHistoryMapper.insertHomeworkPostHistory(homeworkPostHistory);
            });
        });
    }

}
