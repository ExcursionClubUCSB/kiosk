<?php

require "../database.php";

$db = new MySQL_Pointer();

$db->selectTable('user');

if(isset($_GET['email'])) {
	$user = $db->fetchAssoc(array(
		'email' => $_GET['email'],
	));
	if(count($user)) {
		echo json_encode($user[0]);
		exit;
	}
	echo '[]';
	exit;
}
else if(isset($_GET['phone'])) {
	$user = $db->fetchAssoc(array(
		'phone' => $_GET['phone'],
	));
	if(count($user)) {
		echo json_encode($user[0]);
		exit;
	}
	echo '[]';
	exit;
}

exit;

?>