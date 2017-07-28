CREATE TABLE `homeworkQuizOperation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `operationType` enum('DELETE','DISTRIBUTION','UNDISTRIBUTION') DEFAULT NULL,
  `operatorId` int(11) NOT NULL,
  `operatingTime` int(11) NOT NULL,
  `homeworkQuizId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;