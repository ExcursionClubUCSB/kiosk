<?php

require "../database.php";

$cert = $_GET['cert'];
$email = $_GET['email'];
$staff = $_GET['staff'];

$db = new MySQL_Pointer();

$db->selectTable('user');

if(isset($cert)) {
	$user = $db->fetchAssoc(array(
		'email' => $email,
	));
	if(count($user)) {
		$db->update($user[0], array(
			'certified-'.$cert => $staff.';'.time(),
		));
		echo json_encode($user[0]);
		exit;
	}
	echo '[]';
	exit;
}

exit;

?>