package com.thoughtworks.twars.resource;

import org.apache.ibatis.session.SqlSessionManager;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.inject.Inject;

public class Resource {

    @Inject
    protected SqlSessionManager session;

    protected Logger logger;

    public Resource() {
        logger = LogManager.getRootLogger();
    }
}
