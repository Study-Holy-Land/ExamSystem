CREATE TABLE `basicQuizPostHistory`(
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `basicQuizSubmitId` INT(11) NOT NULL,
  `basicQuizItemId` INT(11) NOT NULL ,
  `type` VARCHAR(128) NOT NULL ,
  `userAnswer` VARCHAR(128),
  PRIMARY KEY (`id`),
  CONSTRAINT `bqph_bqsm_1` FOREIGN KEY (`basicQuizSubmitId`) REFERENCES `basicQuizSubmit` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;