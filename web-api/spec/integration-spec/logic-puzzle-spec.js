require('./spec-base');
var userSession = global.userSession;

describe("GET /logic-puzzle", ()=> {
  it.skip("shoule be return 200: GET /logic-puzzle", function (done) {
    userSession
        .get("/logic-puzzle")
        .query({orderId: 3, id: '584f527cb63ad230d43c5fa1'})
        .expect(200)
        .expect({
          item: {
            id: 21,
            initializedBox: [0, 2, 7, 2, 1, 5, 7, 1, 4, 8],
            question: '6号盒子的数字是多少?',
            description: ['',
              '更改指令9：将该指令中的第1个盒子的编号加1',
              '更改指令4：将该指令中的第2个盒子的编号加2',
              '判断：指令4中第1个盒子的编号比4号盒子中的数字大吗',
              '相乘：3号盒子中的数字*2号盒子中的数字，将结果放在4号盒子中。',
              '判断：指令9中第2个盒子的编号比4号盒子中的数字大吗',
              '将5号盒子中的数字放在4号盒子中',
              '判断：指令4中第2个盒子的编号比8号盒子中的数字大吗',
              '更改指令9：将该指令中的第2个盒子的编号加1',
              '将4号盒子中的数字放在3号盒子中',
              ''],
            chartPath: 'http://192.168.99.100:8888/fs/logic-puzzle/17.png'
          },
          itemsCount: 7,
          isExample: false,
          "userAnswer": "9"
        })
        .end(done);
  });
});

//describe("POST /logic-puzzle", ()=> {
//  it("should insert one paper: POST /logic-puzzle", function(done) {
//    userSession
//    .post("/logic-puzzle")
//        .send()
//    .expect(200)
//    .end(done);
//  });
//});
