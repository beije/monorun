<?php
/**
 * UnicornName class
 * 
 * Creates a random name based on constellations and titans
 * (And generates a super fancy unicorn name, free of charge)
 *
 * 
 * @author 		: Benjamin Horn
 * @project		: monorun!
 * @file		: class.unicornName.php
 * @version		: 1.0.0
 * @created		: 2013-06-09
 * @updated		: 2013-06-09
 * @usage       :
 *
 *     *
 *      *
 *       *     **
 *        *   ******
 *         ************                                        ****
 *          *** **********                                   ********
 *         ****************                                 *****  ****
 *        ********************                             ****    ****
 *        *******  ******************             ******   ***     ***
 *         *****    ****************************************        *
 *                   *****************************************
 *                    ***************************************
 *                    **************************************
 *                     ********************     ***********
 *                 ***********                  *********
 *             *******                          ********
 *            ***                                ******
 *           **                                     ****
 *          **                                       ***
 *         ***                                     ****
 *
 *
 */

class UnicornName {
	public static $firstnames = array(
		'Andromeda',
		'Antlia',
		'Apus',
		'Aquarius',
		'Aquila',
		'Ara',
		'Aries',
		'Auriga',
		'Boötes',
		'Caelum',
		'Camelopardalis',
		'Cancer',
		'Canes Venatici',
		'Canis Major',
		'Canis Minor',
		'Capricornus',
		'Carina',
		'Cassiopeia',
		'Centaurus',
		'Cepheus',
		'Cetus',
		'Chamaeleon',
		'Circinus',
		'Columba',
		'Coma Berenices',
		'Corona Austrina',
		'Corona Borealis',
		'Corvus',
		'Crater',
		'Crux',
		'Cygnus',
		'Delphinus',
		'Dorado',
		'Draco',
		'Equuleus',
		'Eridanus',
		'Fornax',
		'Gemini',
		'Grus',
		'Hercules',
		'Horologium',
		'Hydra',
		'Hydrus',
		'Indus',
		'Lacerta',
		'Leo',
		'Leo Minor',
		'Lepus',
		'Libra',
		'Lupus',
		'Lynx',
		'Lyra',
		'Mensa',
		'Microscopium',
		'Monoceros',
		'Musca',
		'Norma',
		'Octans',
		'Ophiuchus',
		'Orion',
		'Pavo',
		'Pegasus',
		'Perseus',
		'Phoenix',
		'Pictor',
		'Pisces',
		'Piscis Austrinus',
		'Puppis',
		'Pyxis',
		'Reticulum',
		'Sagitta',
		'Sagittarius',
		'Scorpius',
		'Sculptor',
		'Scutum',
		'Serpens',
		'Sextans',
		'Taurus',
		'Telescopium',
		'Triangulum',
		'Triangulum Australe',
		'Tucana',
		'Ursa Major',
		'Ursa Minor',
		'Vela',
		'Virgo',
		'Volans',
		'Vulpecula'
	);

	public static $lastnames = array(
		'Koios',
		'Kreios',
		'Kronos',
		'Hyperion',
		'Iapetos',
		'Mnemosyne',
		'Oceanus',
		'Phoebe',
		'Rhea',
		'Tethys',
		'Theia',
		'Themis'
	);

	public static function generateName() {
		return self::$firstnames[ rand( 0, count( self::$firstnames )-1 ) ] . ' ' . self::$lastnames[ rand( 0, count( self::$lastnames )-1 ) ];
	}
}
?>