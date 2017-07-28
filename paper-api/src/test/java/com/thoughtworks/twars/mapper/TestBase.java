package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.util.DatabaseUtil;
import com.thoughtworks.twars.util.EnvUtil;
import org.apache.ibatis.session.SqlSessionManager;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;

import java.io.IOException;

public class TestBase {

    protected SqlSessionManager session;

    {
        String env = EnvUtil.getVariable("ci_test") != null ? "ci_test" : "test";
        session = DatabaseUtil.getSession(env);
        session.getConfiguration().getEnvironment().getDataSource();
    }

    @BeforeClass
    public static void oneTimeSetUp() {
        try {
            Process exec = Runtime.getRuntime().exec(new String[]{"/bin/sh", "-c",
                "docker exec -i assembly_mysql_1 mysqldump -u root "
                            + "-pthoughtworks -t BronzeSword > ./data.sql"
                            + "docker exec -i assembly_mysql_1 mysqldump "
                            + "-u root -pthoughtworks -d BronzeSword > ./BronzeSword.sql;"
                            + "sed -i \"s/InnoDB/MEMORY/g\" BronzeSword.sql;"
                            + "docker exec -i assembly_mysql_1 mysql -u root"
                            + " -pthoughtworks BronzeSword < ./BronzeSword.sql;"});
            exec.waitFor();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    @Before
    public void setUp() throws Exception {
        Process exec = Runtime.getRuntime().exec(new String[]{"/bin/sh", "-c",
            "docker exec -i assembly_mysql_1 mysql -u root -pthoughtworks"
                        + "  BronzeSword < ./data.sql;"});
        exec.waitFor();
        session.startManagedSession();

    }

    @After
    public void tearDown() throws Exception {
        session.close();
    }
}
