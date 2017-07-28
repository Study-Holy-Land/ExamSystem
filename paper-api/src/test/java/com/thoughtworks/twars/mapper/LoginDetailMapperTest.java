package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.LoginDetail;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;

public class LoginDetailMapperTest extends TestBase {

    private LoginDetailMapper loginDetailMapper;

    @Before
    public void setUp() throws Exception {
        super.setUp();
        loginDetailMapper = session.getMapper(LoginDetailMapper.class);
    }

    @Test
    public void should_insert_login_detail() {
        int id = loginDetailMapper.insertLoginDetail(3);

        assertThat(id, is(1));
    }

    @Test
    public void should_update_login_detail_by_token() {

        int result = loginDetailMapper.updateLoginDetail("8c87895409e7e8c6f7d3f4a42ee0ae15");

        assertThat(result, is(1));
    }

    @Test
    public void should_update_login_detail_by_Id() {

        int result = loginDetailMapper.updateLoginDetailById(2);

        assertThat(result, is(1));
    }

    @Test
    public void should_return_login_detail_by_user_id() {
        List<LoginDetail> loginDetails = loginDetailMapper.getLoginDetailByUserId(1);

        assertThat(loginDetails.size(), is(2));
    }

    @Test
    public void should_return_login_detail_by_token() {
        LoginDetail loginDetails =
                loginDetailMapper.getLoginDetailByToken("e652621b9bd77a2ea4a4495ab03e3cc8");

        assertThat(loginDetails.getUserId(), is(1));
    }

}


