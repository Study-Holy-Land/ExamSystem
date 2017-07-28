const ProgramService = require('../services/program-service/index');
const programService = new ProgramService();

class ProgramController {
  create(req, res, next) {
    programService.create(req, (err, result) => {
      if (err) {
        return next(err);
      }
      return res.status(201).send(result);
    });
  }

  update(req, res, next) {
    const data = {
      _id: req.params.programId,
      programInfo: req.body
    };
    programService.update(data, (err, doc) => {
      if (err && err.status) {
        res.sendStatus(404);
      }
      res.sendStatus(204);
    });
  }

  getList(req, res, next) {
    const {currentPage, pageCount} = req.query;
    programService.getList({markId: req.session.user.id, currentPage, pageCount}, (err, data) => {
      if (err) {
        return next(err);
      }
      return res.status(200).send(data);
    });
  }

  addProgramByProgramCode(req, res, next) {
    programService.addProgramByProgramCode(req, (err, data) => {
      if (err && !err.status) {
        return next(err);
      }
      if (err && err.status) {
        return res.sendStatus(err.status);
      }
      return res.sendStatus(201);
    });
  }

  addProgramByInvitationCode(req, res, next) {
    programService.addProgramByInvitationCode(req, err => {
      if (err && !err.status) {
        return next(err);
      }
      if (err && err.status) {
        return res.sendStatus(err.status);
      }
      return res.sendStatus(201);
    });
  }

  getInvitationCode(req, res, next) {
    programService.getInvitationCode(req, (err, result) => {
      if (err) {
        return next(err);
      } else {
        return res.status(200).send(result);
      }
    });
  }

  getInvitationCodeCount(req, res, next) {
    programService.getInvitationCodeCount(req, (err, result) => {
      if (err) {
        return next(err);
      } else {
        return res.status(200).send(result);
      }
    });
  }

  addInvitationCode(req, res, next) {
    programService.addInvitationCode(req, (err, result) => {
      if (err) {
        return next(err);
      } else {
        return res.sendStatus(201);
      }
    });
  }

}

module.exports = ProgramController;
