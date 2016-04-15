<?php

require "../database.php";

$db = new MySQL_Pointer();

$db->selectTable('rentals');


$ins = $db->insert(array(
	'gearId' => $_GET['gearId'],
	'catalog' => $_GET['catalog'],
	'detail' => $_GET['detail'],
	'uid' => $_GET['uid'],
	'memberId' => $_GET['memberId'],
	'status' => 'out',
	'date' => time(),
	'expectedBack' => $_GET['expectedBack'],
	'returned' => '0',
	'staffId' => $_GET['staffId'],
	'image' => $_GET['image'],
));

echo ((int) $ins);

?>