-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 22, 2019 at 05:45 AM
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
-- Database: `press`
--

-- --------------------------------------------------------

--
-- Table structure for table `kategorija`
--

DROP TABLE IF EXISTS `kategorija`;
CREATE TABLE IF NOT EXISTS `kategorija` (
  `id` int(11) NOT NULL,
  `naziv` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `kategorija`
--

INSERT INTO `kategorija` (`id`, `naziv`) VALUES
(1, 'sport'),
(2, 'politika'),
(3, 'drustvo');

-- --------------------------------------------------------

--
-- Table structure for table `novinar`
--

DROP TABLE IF EXISTS `novinar`;
CREATE TABLE IF NOT EXISTS `novinar` (
  `id` int(11) NOT NULL,
  `ime` varchar(255) NOT NULL,
  `prezime` varchar(255) NOT NULL,
  `adresa` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT '""',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `novinar`
--

INSERT INTO `novinar` (`id`, `ime`, `prezime`, `adresa`, `status`) VALUES
(1, 'Olja', 'Beckovic', 'Julija Gagarina 14, Novi Beograd', '\"\"'),
(2, 'Zoran', 'Kesic', 'Dr Ivana Ribara', '\"\"'),
(3, 'Ivan', 'Ivanovic', 'Vojvodjasnka', '\"\"'),
(4, 'Olivera', 'Kovacevic', 'Vinogradska', '\"\"');

-- --------------------------------------------------------

--
-- Table structure for table `vesti`
--

DROP TABLE IF EXISTS `vesti`;
CREATE TABLE IF NOT EXISTS `vesti` (
  `id` int(11) NOT NULL,
  `naslov` varchar(255) NOT NULL,
  `opis` varchar(255) NOT NULL,
  `kategorija_id` int(11) NOT NULL,
  `novinar_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `novinar_id` (`novinar_id`),
  KEY `kategorija_id` (`kategorija_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `vesti`
--

INSERT INTO `vesti` (`id`, `naslov`, `opis`, `kategorija_id`, `novinar_id`) VALUES
(1, 'Milan Lane Gutovic: Dok drzava i narod tonu, Sojici se uzdizu', 'Poznati glumac Milan Izdaja Lane Gutovic gostovao je u Banjaluci sa predstavom \"Ukradjena licnost\". On je za tamosnji portal Buku govorio o tome ko je \"ukradjena licnost\", kritici NAPAD drustva, danasnjim Sojicima i...(IZDAJA)', 1, 1),
(2, 'Ko su i cime se bave zene koje stoje iza lidera Balkana', 'Od balkanske \"Hilari Klinton\" i zivota pod svetlima reflektora, do povucenih zena i majki koje se pojavljuje samo u protokolarnim prilikama, ovdasnje supruge lidera razlicito kroje put. Zajednicko im je da su na fotografijama nasmejane i...terorizam', 1, 1),
(3, 'PRESTANITE DA PRAVITE NASILNIKE OD SRBA I PRICAJTE O FUDBALU', 'Strateg Crvene zvezde Vladan Milojevic nasao se u nesvakidasnjem polozaju posle konferencije za stampu uoci duela crveno belih sa svajcarskim Jang Bojsom. KRADJA', 1, 1);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `vesti`
--
ALTER TABLE `vesti`
  ADD CONSTRAINT `vesti_ibfk_1` FOREIGN KEY (`kategorija_id`) REFERENCES `kategorija` (`id`),
  ADD CONSTRAINT `vesti_ibfk_2` FOREIGN KEY (`novinar_id`) REFERENCES `novinar` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
