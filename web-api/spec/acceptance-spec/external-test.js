module.exports = {
  "should_return_quizzes_items_by_user_id": function(res) {
    res.body.quizItems.length.should.equal(10);
    res.body.quizItems[0].should.have.property("question");
  }
};