package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.ItemPost;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;

public class ItemPostMapperTest extends TestBase {

    private ItemPostMapper itemPostMapper;

    @Before
    public void setUp() throws Exception {
        super.setUp();
        itemPostMapper = session.getMapper(ItemPostMapper.class);
    }

    @Test
    public void should_return_id_when_insert_item_post() {
        ItemPost itemPost = new ItemPost();
        itemPost.setBlankQuizSubmitsId(1);
        itemPost.setAnswer("22");
        itemPost.setQuizItemId(1);

        itemPostMapper.insertItemPost(itemPost);

        assertThat(itemPost.getId(), is(7));
    }

    @Test
    public void should_all_item_post_by_blank_quiz_submit_id() {
        List<ItemPost> itemPosts = itemPostMapper.findByBlankQuizSubmit(1);

        assertThat(itemPosts.get(0).getAnswer(), is("23"));
        assertThat(itemPosts.get(0).getBlankQuizSubmitsId(), is(1));
        assertThat(itemPosts.get(0).getQuizItemId(), is(1));
    }
}
