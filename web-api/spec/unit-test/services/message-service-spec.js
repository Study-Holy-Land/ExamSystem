require ('should');
var ToggleToReadHandler = require('../../../services/message-service/ToggleToReadHandler');
var DisagreementRequestAnswerHandler = require('../../../services/message-service/DisagreementRequestAnswerHandler');
var AgreementRequestAnswerHandler = require('../../../services/message-service/AgreementRequestAnswerHandler');
var AgreementInvitationHandler = require('../../../services/message-service/AgreementInvitationHandler');
var MessagService = require('../../../services/message-service');
var Message = require('../../../models/messages');
require ('../base');

describe('MessageService', () => {
  it('should change state to 1 ', () => {
    const msgObj = {
      '_id': '585bc4e613c65e2f61fede25',
      type: 'REQUEST_ANSWER',
      operation: 'disagreement',
      state: 0
    };
    new MessagService().operate(msgObj, (err, data) => {

      Message.findById(msgObj._id, (err, doc) => {
        let data = doc.toJSON();
        let newData = {from: data.to, to: data.from, type: 'DISAGREE_REQUEST_ANSWER'};
        Message.findOne(newData, (err, doc) => {
          const {from, to, type, state} = doc.toJSON();
          from.should.equal(data.to);
          to.should.equal(data.from);
          type.should.equal('DISAGREE_REQUEST_ANSWER');
          state.should.equal(1);
          done(err);
        });
      });
    });
  });
});

describe('ToggleToReadHandler', () => {
  it('check whether state is 0', () => {
    const msgObj = {
      messageId: '585bc4e613c65e2f61fede25',
      operation: 'read',
      state: 0
    };

    const ToggleToRead = new ToggleToReadHandler();
    const result = ToggleToRead.check(msgObj);
    result.should.equal(true);
  });

  it('check whether state is not 0', () => {
    const msgObj = {
      messageId: '585bc4e613c65e2f61fede25',
      operation: 'agreement',
      state: 1
    };

    const ToggleToRead = new ToggleToReadHandler();
    const result = ToggleToRead.check(msgObj);
    result.should.equal(false);
  });

  it('change state from 0 to 1', () => {
    const msgObj = {
      messageId: '585bc4e613c65e2f61fede25',
      operation: 'read',
      state: 0
    };

    const ToggleToRead = new ToggleToReadHandler();
    ToggleToRead.handle(msgObj, (err, data) => {
      Message.findById('585bc4e613c65e2f61fede25', (err, doc) => {
        const {state} = doc.toJSON();
        state.should.equal(1);
        done(err);
      });
    });

  });
});

describe('DisagreementRequestAnswerHandler', () => {

  it('check should return false when input operation is not disagreement', () => {
    const msgObj = {
      type: 'REQUEST_ANSWER',
      operation: 'agreement'
    };
    let disagreementRequestAnswerHandler = new DisagreementRequestAnswerHandler();
    const result = disagreementRequestAnswerHandler.check(msgObj);
    result.should.equal(false);
  });

  it('check should return true when input operation is disagreement', () => {
    const msgObj = {
      type: 'REQUEST_ANSWER',
      operation: 'disagreement'
    };
    let disagreementRequestAnswerHandler = new DisagreementRequestAnswerHandler();
    const result = disagreementRequestAnswerHandler.check(msgObj);
    result.should.equal(true);
  });

  it('handle should make type to requestAnser & state to 0', (done) => {
    const msgObj = {
      '_id': '585bc4e613c65e2f61fede25',
      type: 'REQUEST_ANSWER',
      operation: 'disagreement'
    };
    let disagreementRequestAnswerHandler = new DisagreementRequestAnswerHandler();
    disagreementRequestAnswerHandler.handle(msgObj, (err, data) => {

      Message.findById(msgObj._id, (err, doc) => {
        let data = doc.toJSON();
        let newData = {from: data.to, to: data.from, type: 'DISAGREE_REQUEST_ANSWER', state: 0};
        Message.findOne(newData, (err, doc) => {
          const {from, to, type, state} = doc.toJSON();
          from.should.equal(data.to);
          to.should.equal(data.from);
          type.should.equal('DISAGREE_REQUEST_ANSWER');
          state.should.equal(0);
          done(err);
        });
      });
    });

  });

});

describe('AgreementRequestAnswerHandler', () => {
  it('check should return true when input operation is not agreement', () => {
    const msgObj = {
      operation: 'agreement',
      type: 'REQUEST_ANSWER'
    };
    let agreementRequestAnswerHandler = new AgreementRequestAnswerHandler();
    const checkAnswer = agreementRequestAnswerHandler.check(msgObj);
    checkAnswer.should.equal(true);
  });

  it('check should return false when input operaion is not agreement', () => {
    "use strict";
    const msgObj = {
      operation: 'disagreement',
      type: 'REQUEST_ANSWER'
    };
    let agreementRequestAnswerHandler = new AgreementRequestAnswerHandler();
    const checkAnswer = agreementRequestAnswerHandler.check(msgObj);
    checkAnswer.should.equal(false);
  });

  it('handle should make type to agreementRequestAnser and state to 0', () => {
    const msgId = '585bc4e613c65e2f61fede26';
    let agreementRequestAnswerHandler = new AgreementRequestAnswerHandler();
    agreementRequestAnswerHandler.handle(msgId, (err, data) => {
      Message.findById(msgId, (err, doc) => {
        let data = doc.toJSON();
        let newMessage = {
          from: data.to,
          to: data.from,
          deeplink: data.deeplink,
          type: 'AGREE_REQUEST_ANSWER',
          state: 0
        };
        Message.findOne(newMessage, (err, doc) => {
          const {from, to, type, state} = doc.toJSON();
          from.should.equal(data.to);
          to.should.equal(data.from);
          type.should.equal('AGREE_REQUEST_ANSWER');
          state.should.equal(0);
          done(err);
        });
      });
    });
  });
});

describe('AgreementInvitationHandler',()=>{
  it('check should return false when input operation is not agreement', () => {
    const msgObj = {
      type: 'INVITATION',
      operation: 'disagreement'
    };
    let agreementInvitationHandler = new AgreementInvitationHandler();
    const result = agreementInvitationHandler.check(msgObj);
    result.should.equal(false);
  });

  it('check should return true when input operation is agreement', () => {
    const msgObj = {
      type: 'INVITATION',
      operation: 'agreement'
    };
    let agreementInvitationHandler = new AgreementInvitationHandler();
    const result = agreementInvitationHandler.check(msgObj);
    result.should.equal(true);
  });

  it('handle should make type to invitation & state to 0', (done) => {
    const msgObj = {
      '_id': '585bc4e613c65e2f61fede43',
      type: 'INVITATION',
      operation: 'agreement',
      from:3,
      to:4
    };
    let agreementInvitationHandler = new AgreementInvitationHandler();
    agreementInvitationHandler.handle(msgObj, (err, data) => {

      Message.findById(msgObj._id, (err, doc) => {
        let data = doc.toJSON();
        let newData = {from: data.to, to: data.from, type: 'AGREE_INVITATION', state: 0};
        Message.findOne(newData, (err, doc) => {
          const {from, to, type, state} = doc.toJSON();
          from.should.equal(data.to);
          to.should.equal(data.from);
          type.should.equal('AGREE_INVITATION');
          state.should.equal(0);
          done(err);
        });
      });
    });

  });

});