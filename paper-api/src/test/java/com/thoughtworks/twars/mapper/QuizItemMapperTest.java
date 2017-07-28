package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.QuizItem;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.hamcrest.core.Is.is;
import static org.hamcrest.number.OrderingComparison.lessThan;
import static org.junit.Assert.assertThat;

public class QuizItemMapperTest extends TestBase {
    private QuizItemMapper quizItemMapper;

    @Before
    public void setUp() throws Exception {
        super.setUp();
        quizItemMapper = session.getMapper(QuizItemMapper.class);
    }

    @Test
    public void should_return_all_quizItems() throws Exception {

        List<QuizItem> quizItemList = quizItemMapper.getAllQuizItems();
        assertThat(quizItemList.size(), is(50));
    }

    @Test
    public void should_insert_quizItem() throws Exception {
        QuizItem quizItem = new QuizItem();
        quizItem.setMaxUpdateTimes(10);
        quizItem.setInitializedBox("[0,2,7,2,5,7,1,1,4,8]");
        quizItem.setStepsString("Steps(%20Begin(),%20%0APut"
                +
                "(number_in_box(4),%20into_box(4)),%0AChange_Box_Number"
                +
                "(the_instruction_box(step_number(9),%202),%20increase(1)),"
                +
                "%0AVerify(greater_than(instruction_box_number(step_number(9),%202),"
                +
                "%20number_in_box(2)),%20then_go_to_step(7),%20then_go_to_step(6)),"
                +
                "%0AOperation(Multiply(),%20number_in_box(6),%20number_in_box(9),"
                +
                "%20put_result_into_box(6)),%0AVerify(greater_than"
                +
                "(instruction_box_number(step_number(9),%201),"
                +
                "%20number_in_box(5)),%20then_go_to_step(3),"
                +
                "%20then_go_to_step(2)),%0AVerify(greater_than"
                +
                "(instruction_box_number(step_number(9),%202),%20number_in_box(2)),"
                +
                "%20then_go_to_step(8),%20then_go_to_step(4)),%0AChange_Box_Number"
                +
                "(the_instruction_box(step_number(9),%201),%20increase(1)),"
                +
                "%0AChange_Box_Number(the_instruction_box(step_number(1),%202),"
                +
                "%20increase(1)),%0APut(number_in_box(4),%20into_box(2)),%20End())");
        quizItem.setCount(10);
        quizItem.setQuestionZh("经过以上操作之后，现在6号盒子中的数字是多少?");
        quizItem.setStepsLength(11);
        quizItem.setAnswer("10");
        quizItem.setDescriptionZh("[\"\",\"更改指令9：将该指令中的第2个盒子的编号加1\","
                +
                "\"判断：指令9中第2个盒子的编号比2号盒子中的数字大吗\",\"相乘：6号盒子中的数字*9号盒子中的数字，将结果放在6号盒子中。\","
                +
                "\"判断：指令9中第1个盒子的编号比5号盒子中的数字大吗\",\"判断：指令9中第2个盒子的编号比2号盒子中的数字大吗\","
                +
                "\"更改指令9：将该指令中的第1个盒子的编号加1\",\"更改指令1：将该指令中的第2个盒子的编号加1\",\"将4号盒子中的数字放在2号盒子中\",\"\"]");
        quizItem.setChartPath("logic-puzzle/1.png");
        quizItem.setInfoPath("logic-puzzle/1.json");

        quizItemMapper.insertQuizItem(quizItem);

        assertThat(quizItem.getId(), is(51));
    }

    @Test
    public void should_return_a_quizItem() throws Exception {
        QuizItem quizItem = quizItemMapper.getQuizItemById(1);

        assertThat(quizItem.getInitializedBox(), is("[0,2,7,2,1,5,7,1,4,8]"));
        assertThat(quizItem.getCount(), is(33));
    }

    @Test
    public void should_return_quizItem_list() throws Exception {
        List<QuizItem> easyItems = quizItemMapper.getEasyItems(3);
        List<QuizItem> normalItems = quizItemMapper.getNormalItems(4);
        List<QuizItem> hardItems = quizItemMapper.getHardItems(3);

        assertThat(easyItems.size(), is(3));
        assertThat(normalItems.size(), is(4));
        assertThat(hardItems.size(), is(3));
    }

    @Test
    public void should_return_example_item() throws Exception {

        List<QuizItem> exampleItems = quizItemMapper.getExampleItems(2);
        assertThat(exampleItems.size(), is(2));
        assertThat(exampleItems.size(), is(lessThan(15)));
    }

    @Test
    public void should_return_example() throws Exception {
        List<QuizItem> exampleItems = quizItemMapper.getExamples();
        assertThat(exampleItems.size(), is(2));
        assertThat(exampleItems.get(0).getId(), is(9));
        assertThat(exampleItems.get(1).getId(), is(27));
    }
}
