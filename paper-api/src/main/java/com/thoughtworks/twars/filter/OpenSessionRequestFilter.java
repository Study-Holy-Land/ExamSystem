package com.thoughtworks.twars.filter;

import org.apache.ibatis.session.SqlSessionManager;

import javax.inject.Inject;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;

public class OpenSessionRequestFilter  implements ContainerResponseFilter {
    @Inject
    SqlSessionManager session;

    @Override
    public void filter(ContainerRequestContext requestContext,
                       ContainerResponseContext responseContext) {
        session.startManagedSession();
    }
}
