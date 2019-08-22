-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 22, 2019 at 06:13 AM
-- Server version: 5.7.26
-- PHP Version: 7.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `oebs`
--

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

DROP TABLE IF EXISTS `countries`;
CREATE TABLE IF NOT EXISTS `countries` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `continent` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`id`, `name`, `continent`) VALUES
(1, 'Rusija', 'Azija'),
(2, 'USA', 'Severna Amerika');

-- --------------------------------------------------------

--
-- Table structure for table `topiccou`
--

DROP TABLE IF EXISTS `topiccou`;
CREATE TABLE IF NOT EXISTS `topiccou` (
  `topicID` int(11) NOT NULL,
  `countryID` int(11) NOT NULL,
  `statement` varchar(255) NOT NULL,
  KEY `topicID` (`topicID`),
  KEY `countryID` (`countryID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `topiccou`
--

INSERT INTO `topiccou` (`topicID`, `countryID`, `statement`) VALUES
(1, 1, 'Rusija je napravila teledon sa 2 ekrana. Buducnost i Srbija imaju neraskidive veze.'),
(1, 2, 'Srbija je ostavila vidan napredak na temu informacione tehnologije'),
(2, 1, 'Zajednicka borba je prioriter i ocuvanje mira. Rusija i Srbija cine napredak.');

-- --------------------------------------------------------

--
-- Table structure for table `topics`
--

DROP TABLE IF EXISTS `topics`;
CREATE TABLE IF NOT EXISTS `topics` (
  `id` int(11) NOT NULL,
  `topic` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `topics`
--

INSERT INTO `topics` (`id`, `topic`) VALUES
(1, 'Informacione tehnologije'),
(2, 'Terorizam');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `topiccou`
--
ALTER TABLE `topiccou`
  ADD CONSTRAINT `topiccou_ibfk_1` FOREIGN KEY (`topicID`) REFERENCES `topics` (`id`),
  ADD CONSTRAINT `topiccou_ibfk_2` FOREIGN KEY (`countryID`) REFERENCES `countries` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
