var apiRequest = require('../services/api-request');
var MentorService = require('../services/mentor-service/MentorService');

const mentorService = new MentorService();

class MentorsController {

  search(req, res, next) {
    const email = req.url.split('=')[1];
    const result = [];
    apiRequest.get('users', {role: 4}, (err, resp) => {
      if (err) {
        return next(err);
      }
      resp.body.items.find((item) => {
        if (item.email.indexOf(email) > -1) {
          result.push(item);
        }
      });
      const response = {totalCount: result.length, items: result};
      res.status(200).send(response);
    });
  }

  findAllMentors(req, res, next) {
    const to = req.session.user.id;
    mentorService.findAllMentors({to}, (err, data) => {
      if (err) {
        return next(err);
      }
      res.status(200).send(data);
    });
  }
}

module.exports = MentorsController;
