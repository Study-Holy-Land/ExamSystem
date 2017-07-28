package com.thoughtworks.twars.filter;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.core.HttpHeaders;
import java.io.IOException;
import java.util.Date;

public class CacheContorlFilter implements ContainerResponseFilter {

    @Override
    public void filter(ContainerRequestContext requestContext,
                       ContainerResponseContext responseContext) throws IOException {

        Date expirationDate = new Date(System.currentTimeMillis() - 1);
        responseContext.getHeaders().putSingle(HttpHeaders.CACHE_CONTROL, expirationDate);

    }
}
