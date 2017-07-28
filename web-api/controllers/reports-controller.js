const ExportCsvService = require('../services/report-service/export-csv');
const exportCsvService = new ExportCsvService();

const typeMapper = {
  1: exportCsvService.exportPaperCSV,
  2: exportCsvService.exportUserCSV,
  3: exportCsvService.exportQuizCSV
};

class ReportsController {
  exportCSV(req, res, next) {
    const type = req.params.type;
    const data = req.query.data;
    typeMapper[type](data, (err, {filename, content}) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Content-disposition', 'attachment; filename=' + filename + '');
      res.setHeader('Content-Type', 'text/csv');

      res.send(content);
    });
  }

  exportMenteeQuizCSV(req, res, next) {
    const mentorId = req.session.user.id;
    const menteeId = req.params.menteeId;
    exportCsvService.exportMenteeQuizCSV({mentorId, menteeId}, (err, {filename, content}) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Content-disposition', 'attachment; filename=' + filename + '');
      res.setHeader('Content-Type', 'text/csv');
      res.send(content);
    });
  }
}

module.exports = ReportsController;
