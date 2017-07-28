CREATE TABLE `basicBlankQuiz`(
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varChar(128) NOT NULL,
  `type` varChar(128) NOT NULL,
  `answer` varChar(128) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
