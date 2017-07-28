package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.Stack;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

public class StackMapperTest extends TestBase {
    private StackMapper stackMapper;

    @Before
    public void setUp() throws Exception {
        super.setUp();
        stackMapper = session.getMapper(StackMapper.class);
    }

    @Test
    public void should_return_all_stack() {
        List<Stack> stackList = stackMapper.getAllStack();
        assertThat(stackList.size(), is(3));
    }

    @Test
    public void should_add_stack() {
        Stack stack = new Stack();

        stack.setTitle("JavaScript");
        stack.setDescription("这是JavaScript");
        stack.setDefinition("node:5.8");

        stackMapper.insertStack(stack);
        assertThat(stack.getStackId(), is(4));
    }

    @Test
    public void should_return_stack_by_stackId() {
        Stack stack = stackMapper.getStackById(1);
        assertThat(stack.getTitle(), is("PHP"));
    }
}
