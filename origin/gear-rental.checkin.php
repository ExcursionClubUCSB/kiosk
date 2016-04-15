<?php

require "../database.php";

$db = new MySQL_Pointer();

$db->selectTable('rentals');


$upd = $db->update(
	array(
		'memberId' => $_GET['memberId'],
		'catalog' => $_GET['catalog'],
		'uid' => $_GET['uid'],
		'status' => 'out',
	),
	array(
		'status' => 'in',
		'returned' => time(),
	)
);

echo $upd;

?>