package com.thoughtworks.twars.resource;

import org.apache.ibatis.session.SqlSessionManager;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.sql.Connection;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;


@Path("/inspector")
public class InspectorResource {

    @Inject
    private SqlSessionManager session;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getConnectionInfo() {
        Connection conn;
        Map result = new HashMap<String, String>();
        result.put("api", "connected");
        try {
            conn = session.getConfiguration().getEnvironment().getDataSource().getConnection();
            Statement st = conn.createStatement();
            st.execute("show tables");
            result.put("mysql", "connected");
        } catch (Exception exception) {
            result.put("mysql", exception.getMessage());
        }

        return Response.status(javax.ws.rs.core.Response
                .Status.OK).entity(result).build();
    }
}
