SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `monorun`
--

-- --------------------------------------------------------

--
-- Table structure for table `highscore`
--

CREATE TABLE IF NOT EXISTS `highscore` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sourceid` int(11) NOT NULL,
  `username` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `dateline` int(11) NOT NULL,
  `last_cron_run` int(11) NOT NULL,
  `original_score` int(11) NOT NULL,
  `current_score` int(11) NOT NULL,
  `secret_key` varchar(32) COLLATE utf8_swedish_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci AUTO_INCREMENT=16 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- --------------------------------------------------------

--
-- Table structure for table `source`
--

CREATE TABLE IF NOT EXISTS `source` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `url` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci AUTO_INCREMENT=4 ;

--
-- Dumping data for table `source`
--

INSERT INTO `source` (`id`, `name`, `url`) VALUES
(1, 'monorun for web', 'http://monorun.com/'),
(2, 'monorun for Android', 'http://www.android.com/'),
(3, 'monorun for Windows Phone', 'http://www.windowsphone.com/');
