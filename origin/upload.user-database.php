<?php

/**
 * Updates the gate controller with the new user database
 *
 *
 * PHP version 5
 *
 * @author     Blake Regalia <blake.regalia@gmail.com>
 * @version    2012/08/30
 */

require "database.php";

// initialize database/table parameters
$db = new MySQL_Pointer("excursion");
$db->selectTable('user');

$users = $db->fetchAssoc(array(
	'type' => 'staff',
	'status' => 'active',
), 'OR `);

foreach($users as $k => $u) {
	$users[$k] = url
}


?>