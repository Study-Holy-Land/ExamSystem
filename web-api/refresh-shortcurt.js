var xlsx = require("node-xlsx");
var fs = require("fs");
var superagent = require("superagent");
var async = require("async");

var workSheetsFromBuffer = xlsx.parse(fs.readFileSync(`${__dirname}/short-cart.xlsx`));
var cutsData = workSheetsFromBuffer[0].data;
var singlechoiceItems = [];

var intentions = [];

cutsData.forEach(curt => {
  intentions.push(curt[0]);
});

cutsData.forEach(curt => {
  var currentIntention = curt[0];
  var macCut = curt[1];
  var windowsCut = curt[2];

  var type = "SINGLE_CHOICE";
  var description = `在使用Intellij时，${macCut}(mac)/${windowsCut}(windows)的意图是`;
  var answer = parseInt(Math.random() * 4);
  var options = convertOptions(intentions, answer, currentIntention);

  singlechoiceItems.push({description, answer, options, type});
});

function convertOptions(intentions, answer, currentIntention) {
  var array = [];
  var wrongIntentions = intentions.filter(item => item !== currentIntention);

  wrongIntentions.forEach(wrong => {
    var number = parseInt(Math.random() * (wrongIntentions.length - 1));
    var isExist = array.some(item => item === wrongIntentions[number]);
    if (!isExist && array.length < 4) {
      array.push(wrongIntentions[number]);
    }
  });

  array[answer] = currentIntention;
  return array;
}

singlechoiceItems[0].description = `### 本试卷主要考察快捷键的使用,共分为3个模块，请认真观看视频后开始作答，完成一个模块后即可解锁下一模块

<video width="100%" height="500" src="http://7xlgq2.com1.z0.glb.clouddn.com/001.mp4"  controls="controls"></video>

${singlechoiceItems[0].description}`;

singlechoiceItems[11].description = `<video width="100%" height="500"  controls="controls" src="http://7xlgq2.com1.z0.glb.clouddn.com/002.mp4"></video>

${singlechoiceItems[11].description}`;

singlechoiceItems[20].description = `<video width="100%" height="500"  controls="controls" src="http://7xlgq2.com1.z0.glb.clouddn.com/004.mp4"></video>

${singlechoiceItems[20].description}`;

async.map(singlechoiceItems, (item, callback) => {
  item.answer = item.answer.toString();
  superagent.post("localhost:3000/single-choices")
      .send(item)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        callback(null, res.body);
      });
}, (error, result) => {
  if (error) {
    throw error;
  }
  var section1 = result.slice(0, 11);
  var section2 = result.slice(11, 20);
  var section3 = result.slice(20);

  var data = {
    "sections": [
      {
        "quizzes": section1,
        "title": "挑战快捷键第一部分",
        "type": "basicQuiz"
      },
      {
        "quizzes": section2,
        "title": "挑战快捷键第二部分",
        "type": "basicQuiz"
      },
      {
        "quizzes": section3,
        "title": "挑战快捷键第三部分",
        "type": "basicQuiz"
      }
    ],
    "paperName": "挑战快捷键",
    "programId": 5,
    "description": "这是一套测试快捷键的试卷",
  };

  superagent
      .post("localhost:3000/paper-definitions")
      .set("Content-Type", "application/json")
      .send({
        data: data
      })
      .end((err, res) => {
        if (err) {
          throw err;
        }
        superagent
            .put(`localhost:3000/paper-definitions/${res.body.paperId}/distribution`)
            .set("Content-Type", "application/json")
            .send({
              data: data
            })
            .end((error, resp) => {
              if (error) {
                throw error;
              } else {
                console.log("refresh shortCurt success!");
              }
            });
      });
});
