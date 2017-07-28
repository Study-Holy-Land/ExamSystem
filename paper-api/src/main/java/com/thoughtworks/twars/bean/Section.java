package com.thoughtworks.twars.bean;


import java.lang.String;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class Section {
    private int id;
    private int paperId;
    private String description;
    private String type;
    private List<Map> quizzes;

    public int getPaperId() {
        return paperId;
    }

    public void setPaperId(int paperId) {
        this.paperId = paperId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<Map> getQuizzes() {
        return quizzes;
    }

    public void setQuizzes(List<Map> quizzes) {
        this.quizzes = quizzes;
    }

    public Map toMap() {
        Map result = new HashMap<>();
        result.put("id", id);
        result.put("description", description);
        result.put("sectionType", type);

        List<Map> quizzesInfo = quizzes.stream()
                .map(item -> {
                    Map quiz = new HashMap();
                    quiz.put("id", item.get("quizId"));
                    quiz.put("definition_uri", getDefinition(item));
                    quiz.put("items_uri", getItemsUri(item));
                    return quiz;
                }).collect(Collectors.toList());

        result.put("quizzes", quizzesInfo);

        return result;
    }

    private String getItemsUri(Map item) {
        if ("blankQuizzes".equals(type)) {
            return "blankQuizzes/" + item.get("quizId") + "/items";
        }
        return null;
    }

    private String getDefinition(Map item) {
        if ("blankQuizzes".equals(type)) {
            return "blankQuizzes/" + item.get("quizId");
        } else if ("homeworkQuizzes".equals(type)) {
            return "homeworkQuizzes/" + item.get("quizId");
        } else if ("basicQuizzes".equals(type)) {
            if (item.get("quizType").equals("singleChoices")) {
                return "singleChoices/" + item.get("quizId");
            } else if (item.get("quizType").equals("multipleChoices")) {
                return "multipleChoices/" + item.get("quizId");
            } else if (item.get("quizType").equals("basicBlankQuizzes")) {
                return "basicBlankQuizzes/" + item.get("quizId");
            }
        }
        return null;
    }


}
