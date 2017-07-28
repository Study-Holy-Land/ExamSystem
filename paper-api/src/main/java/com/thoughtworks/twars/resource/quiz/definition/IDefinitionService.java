package com.thoughtworks.twars.resource.quiz.definition;

import java.util.List;
import java.util.Map;

public interface IDefinitionService {

    public int insertQuizDefinition(Map quiz, int paperId);

    public List<Map> getQuizDefinition(int sectionId);
}
