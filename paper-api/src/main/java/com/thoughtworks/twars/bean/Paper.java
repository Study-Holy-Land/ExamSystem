package com.thoughtworks.twars.bean;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class Paper {
    private int id;
    private int makerId;
    private List<Section> sections;
    private String paperName;
    private String description;
    private Integer createTime;
    private Integer programId;

    public Integer getProgramId() {
        return programId;
    }

    public void setProgramId(Integer programId) {
        this.programId = programId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getMakerId() {
        return makerId;
    }

    public void setMakerId(int makerId) {
        this.makerId = makerId;
    }

    public List<Section> getSections() {
        return sections;
    }

    public void setSections(List<Section> sections) {
        this.sections = sections;
    }

    public Map toMap() {
        Map result = new HashMap<>();
        result.put("paperName", getPaperName());
        result.put("id", getId());

        List<Map> sectionsInfo = sections.stream()
                .map(section -> section.toMap())
                .collect(Collectors.toList());

        result.put("sections", sectionsInfo);

        return result;
    }


    public String getPaperName() {
        return paperName;
    }


    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Integer createTime) {
        this.createTime = createTime;
    }

    public void setPaperName(String paperName) {
        this.paperName = paperName;
    }

    public Map getPapersInfo() {
        Map result = new HashMap<>();

        result.put("uri", "papers/" + getId());
        result.put("makerId", getMakerId());
        result.put("paperName", getPaperName());
        result.put("description", getDescription());
        result.put("createTime", getCreateTime());
        result.put("id", getId());
        result.put("programId", getProgramId());

        return result;
    }


}


