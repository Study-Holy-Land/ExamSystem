import {Component} from "react";
const PaperList = require("./PaperList.jsx");
const JoinProgram = require("./JoinProgram.jsx");


var PaperListPage = React.createClass({
 getInitialState:function(){
   return {
      result: ''
    };
  },

  JoinProgramResult(data) {
    //这里的result从＜JoinProgram　／＞组件中获得后，再传给PaperList的目的是：
    // 让＜PaperList／＞在result有改变的时候再次重新加载获取PaperList
    this.setState({result: data});
  },

  render:function() {
    return (
        <div>
          <JoinProgram onJoinProgramResult={this.JoinProgramResult}/>
          <PaperList result={this.state.result}/>
        </div>
    )
  }
});

module.exports =PaperListPage;