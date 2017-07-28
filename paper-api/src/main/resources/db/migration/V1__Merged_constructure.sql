-- MySQL dump 10.13  Distrib 5.7.11, for Linux (x86_64)
--
-- Host: localhost    Database: BronzeSword
-- ------------------------------------------------------
-- Server version	5.7.11

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `blankQuiz`
--

DROP TABLE IF EXISTS `blankQuiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blankQuiz` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hardCount` int(11) NOT NULL,
  `normalCount` int(11) NOT NULL,
  `easyCount` int(11) NOT NULL,
  `exampleCount` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `blankQuizSubmit`
--

DROP TABLE IF EXISTS `blankQuizSubmit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blankQuizSubmit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `blankQuizId` int(11) NOT NULL,
  `scoreSheetId` int(11) NOT NULL,
  `startTime` int(11) DEFAULT NULL,
  `endTime` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blankQuizId` (`blankQuizId`,`scoreSheetId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `homeworkPostHistory`
--

DROP TABLE IF EXISTS `homeworkPostHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `homeworkPostHistory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userAnswerRepo` varchar(512) NOT NULL,
  `homeworkSubmitId` int(11) NOT NULL,
  `version` varchar(512) DEFAULT NULL,
  `branch` varchar(32) NOT NULL,
  `status` int(11) NOT NULL,
  `commitTime` int(11) DEFAULT NULL,
  `startTime` int(11) DEFAULT NULL,
  `result` VARCHAR(300),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `homeworkQuiz`
--

DROP TABLE IF EXISTS `homeworkQuiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `homeworkQuiz` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` VARCHAR(300) NOT NULL,
  `evaluateScript` varchar(2048) NOT NULL,
  `templateRepository` varchar(512) NOT NULL,
  `makerId` int(11) NOT NULL,
  `createTime` int(11) DEFAULT NULL,
  `homeworkName` varchar(120) NOT NULL,
  `answerPath` varchar(255) NOT NULL,
  `stackId` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `homeworkSubmit`
--

DROP TABLE IF EXISTS `homeworkSubmit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `homeworkSubmit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `homeworkQuizId` int(11) NOT NULL,
  `scoreSheetId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `itemPost`
--

DROP TABLE IF EXISTS `itemPost`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `itemPost` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `blankQuizSubmitId` int(11) NOT NULL,
  `quizItemId` int(11) NOT NULL,
  `userAnswer` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `loginDetail`
--

DROP TABLE IF EXISTS `loginDetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `loginDetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `token` varchar(32) NOT NULL,
  `loginDate` int(11) NOT NULL,
  `logoutDate` int(11) DEFAULT NULL,
  `flag` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `paper`
--

DROP TABLE IF EXISTS `paper`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `paper` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `makerId` int(11) NOT NULL,
  `paperName` varchar(128) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createTime` int(11) DEFAULT NULL,
  `isDistribution` tinyint(1) DEFAULT NULL,
  `programId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `paperOperation`
--

DROP TABLE IF EXISTS `paperOperation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `paperOperation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `operationType` enum('DELETE','UPDATE','DISTRIBUTION','ADD','RESTORE') DEFAULT NULL,
  `operatorId` int(11) NOT NULL,
  `operatingTime` int(11) NOT NULL,
  `paperId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `passwordRetrieveDetail`
--

DROP TABLE IF EXISTS `passwordRetrieveDetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `passwordRetrieveDetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `token` varchar(32) DEFAULT NULL,
  `retrieveDate` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `programs`
--

DROP TABLE IF EXISTS `programs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `programs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `quizItem`
--

DROP TABLE IF EXISTS `quizItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quizItem` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `initializedBox` varchar(128) NOT NULL,
  `stepsString` varchar(2048) NOT NULL,
  `count` int(11) NOT NULL,
  `questionZh` varchar(128) NOT NULL,
  `stepsLength` int(11) NOT NULL,
  `maxUpdateTimes` int(11) NOT NULL,
  `answer` varchar(128) DEFAULT NULL,
  `descriptionZh` varchar(2048) NOT NULL,
  `chartPath` varchar(128) NOT NULL,
  `infoPath` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `scoreSheet`
--

DROP TABLE IF EXISTS `scoreSheet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `scoreSheet` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `examerId` int(11) NOT NULL,
  `paperId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `section`
--

DROP TABLE IF EXISTS `section`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `section` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `paperId` int(11) NOT NULL,
  `description` varchar(256) NOT NULL,
  `type` varchar(32) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sectionQuiz`
--

DROP TABLE IF EXISTS `sectionQuiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sectionQuiz` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sectionId` int(11) NOT NULL,
  `quizId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stack`
--

DROP TABLE IF EXISTS `stack`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stack` (
  `stackId` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(128) NOT NULL,
  `description` varchar(128) NOT NULL,
  `definition` varchar(128) NOT NULL,
  PRIMARY KEY (`stackId`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `studentMentor`
--

DROP TABLE IF EXISTS `studentMentor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `studentMentor` (
  `mentorId` int(11) NOT NULL,
  `studentId` int(11) NOT NULL,
  PRIMARY KEY (`studentId`,`mentorId`),
  KEY `mentorId` (`mentorId`),
  CONSTRAINT `studentMentor_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `users` (`id`),
  CONSTRAINT `studentMentor_ibfk_2` FOREIGN KEY (`mentorId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `thirdParty`
--

DROP TABLE IF EXISTS `thirdParty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `thirdParty` (
  `thirdPartyUserId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `type` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userDetail`
--

DROP TABLE IF EXISTS `userDetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userDetail` (
  `userId` int(11) NOT NULL,
  `school` varchar(128) NOT NULL,
  `name` varchar(128) NOT NULL,
  `major` varchar(128) NOT NULL,
  `degree` varchar(128) NOT NULL,
  `gender` enum('F','M') DEFAULT NULL,
  `schoolProvince` varchar(128) DEFAULT NULL,
  `schoolCity` varchar(128) DEFAULT NULL,
  `entranceYear` varchar(128) DEFAULT NULL,
  UNIQUE KEY `userId` (`userId`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userPrivilege`
--

DROP TABLE IF EXISTS `userPrivilege`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userPrivilege` (
  `userId` int(11) NOT NULL,
  `privilege` enum('MENTOR','OPERATOR') NOT NULL,
  PRIMARY KEY (`userId`,`privilege`),
  CONSTRAINT `userPrivilege_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userProgram`
--

DROP TABLE IF EXISTS `userProgram`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userProgram` (
  `userId` int(11) NOT NULL,
  `programId` int(11) NOT NULL,
  PRIMARY KEY (`userId`,`programId`),
  KEY `programId` (`programId`),
  CONSTRAINT `userProgram_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userProgram_ibfk_2` FOREIGN KEY (`programId`) REFERENCES `programs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(128) NOT NULL,
  `mobilePhone` varchar(64) NOT NULL,
  `password` varchar(128) NOT NULL,
  `createDate` int(11) NOT NULL,
  `role` enum('1','2','3','4','5','6','7','8','9') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-02-17 10:11:55
