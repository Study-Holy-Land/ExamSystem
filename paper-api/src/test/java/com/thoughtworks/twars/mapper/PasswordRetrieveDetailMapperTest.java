package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.PasswordRetrieveDetail;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

public class PasswordRetrieveDetailMapperTest extends TestBase {

    private PasswordRetrieveDetailMapper passwordRetrieveDetailMapper;

    @Before
    public void setUp() throws Exception {
        super.setUp();
        passwordRetrieveDetailMapper = session.getMapper(PasswordRetrieveDetailMapper.class);
    }

    @Test
    public void should_insert_detail() {
        PasswordRetrieveDetail passwordRetrieveDetail = new PasswordRetrieveDetail();
        passwordRetrieveDetail.setEmail("123456@qq.com");

        passwordRetrieveDetailMapper.insertDetail(passwordRetrieveDetail);
        assertThat(passwordRetrieveDetail.getId(), is(4));
    }

    @Test
    public void should_return_detail_by_token() {
        PasswordRetrieveDetail passwordRetrieveDetail =
                passwordRetrieveDetailMapper.getDetailByToken("e652621b9bd77a2ea4a4495ab03e3cc8");

        assertThat(passwordRetrieveDetail.getId(), is(2));
    }

    @Test
    public void should_return_detail_by_email() {
        PasswordRetrieveDetail passwordRetrieveDetail =
                passwordRetrieveDetailMapper.getDetailByEmail("wjj@qq.com");

        assertThat(passwordRetrieveDetail.getId(), is(2));
    }

    @Test
    public void should_update_when_not_exist_detail() {
        int id = passwordRetrieveDetailMapper.updateDetailByEmail("123@qq.com");

        assertThat(id, is(1));
    }

    @Test
    public void should_update_when_token_is_null() {
        int id = passwordRetrieveDetailMapper.updateDetailByEmail("ydp@qq.com");

        assertThat(id , is(1));
    }

    @Test
    public void should_set_token_null_when_password_reset_success() {
        int id = passwordRetrieveDetailMapper.setNullToken("test@163.com");

        assertThat(id, is(1));
    }

}
