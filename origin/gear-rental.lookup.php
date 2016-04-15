<?php

require "../database.php";

$member_id = $_GET['member'];
$gear_uid = $_GET['gear'];

$db = new MySQL_Pointer();

$db->selectTable('rentals');

$items = array();

if(isset($member_id)) {
	$items = $db->fetchAssoc(
		array(
			'memberId' => $member_id,
			'status' => 'out',
		)
	);
}
else if(isset($gear_uid)) {
	$items = $rental_db->fetchAssoc(
		array(
			'uid' => $member_id,
			'status' => 'out',
		)
	);
}
else {
	$items = $db->fetchAssoc(
		array(
			'status' => 'out',
		),
		'ORDER BY `date` DESC'
	);
}



$db->selectTable('inventory');

foreach($items as $key => $item) {
	if($item['catalog'] == 'custom') {
		$items[$key]['text'] = $item['gearId'];
	}
	else {
		$gear = $db->fetchAssoc(array(
			'uid' => $item['uid'],
		));
		$items[$key] = array_merge($items[$key], $gear[0]);
		$items[$key]['text'] = $item['catalog'];
	}
}

echo json_encode($items);






?>