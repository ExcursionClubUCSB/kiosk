<?php

require "../database.php";
require "../gate.server.php";

$id = $_GET['id'];
$new_uid = $_GET['uid'];
$staff = $_GET['staff'];

$db = new MySQL_Pointer();
$db->selectTable('user');

$cash = new MySQL_Pointer();
$cash->selectTable('accounting');

if(isset($id)) {
	$users = $db->fetchAssoc(array(
		'id' => $id,
	));
	if(count($users)) {
		$user = $users[0];
		$old_uid = $user['uid'];
		
		$users = $db->fetchAssoc(array(
			'uid' => $new_uid,
		), "OR `staff-uid`='".$new_uid."'");
		
		if(count($users) != 0) die('[]');
		
		if(strlen($old_uid) != 0) {
			$db->selectTable('tags_lost');
			$db->insert(array(
				'tag' => $old_uid,
				'origin' => 'member',
				'id' => $user['id'],
			));
			
			$cash->insert(array(
				'field' => 'new wristband',
				'value' => 5.0,
				'time' => time(),
			));
		}
			
		$db->selectTable('user');
		$db->update($user, array(
			'uid' => $new_uid,
		));
		$users = $db->fetchAssoc(array(
			'id' => $id,
		));
		
		gateServer::pushUID($user['email'], $new_uid);
		
		echo json_encode(array($user));
		exit;
	}
	echo '[]';
	exit;
}

exit;

?>