package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.ThirdParty;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

public class ThirdPartyMapperTest extends TestBase {
    private ThirdPartyMapper thirdPartyMapper;

    @Before
    public void setUp() throws Exception {
        super.setUp();
        thirdPartyMapper = session.getMapper(ThirdPartyMapper.class);
    }

    @Test
    public void should_add_third_party_user() throws Exception {
        ThirdParty thirdParty = new ThirdParty();

        thirdParty.setThirdPartyUserId("1");
        thirdParty.setUserId(1);
        thirdParty.setType("github");

        thirdPartyMapper.insertThirdPartyUser(thirdParty);

        assertThat(thirdParty.getUserId(), is(1));
    }

    @Test
    public void should_get_third_party_user() throws Exception {
        ThirdParty thirdParty = new ThirdParty();
        thirdParty.setThirdPartyUserId("1");
        thirdParty.setType("weChat");

        ThirdParty result = thirdPartyMapper.getByThirdPartyUserIdAndType(thirdParty);

        assertThat(result.getUserId(), is(1));
    }
}
