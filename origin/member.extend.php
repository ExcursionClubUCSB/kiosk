<?php

require "../database.php";
require "../gate.server.php";

$id = $_GET['id'];
$staff = $_GET['staff'];

$db = new MySQL_Pointer();
$db->selectTable('user');

$cash = new MySQL_Pointer();
$cash->selectTable('accounting');

if(isset($id)) {
	$users = $db->fetchAssoc(array(
		'id' => $id,
	));
	if(count($users) != 0) {
		$user = $users[0];
		$expires = max($user['expires'], time());
		$expires += 60*60*24*365;
		
		$cash->insert(array(
			'field' => 'returning member',
			'value' => 40.0,
			'time' => time(),
		));
		
		$db->update($user, array(
			'expires' => $expires,
			'status' => 'active',
		));
		$users = $db->fetchAssoc(array(
			'id' => $id,
		));
		
		gateServer::pushExpiration($id, $expires);
		
		echo json_encode(array($users[0]));
		exit;
	}
	echo '[]';
	exit;
}

exit;

?>