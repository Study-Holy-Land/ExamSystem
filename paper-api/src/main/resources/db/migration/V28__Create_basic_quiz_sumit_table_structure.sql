CREATE TABLE `basicQuizSubmit`(
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `basicQuizId` INT(11) NOT NULL,
  `scoreSheetId` INT(11) NOT NULL,
  `startTime` INT(11) NOT NULL ,
  `endTime` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `bqs_ss_1` FOREIGN KEY (`scoreSheetId`) REFERENCES `scoreSheet` (`id`),
  CONSTRAINT `bqs_bq_1` FOREIGN KEY (`basicQuizId`) REFERENCES `basicQuiz` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;