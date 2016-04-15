<?php

require "../database.php";


// initialize the database pointer
$db = new MySQL_Pointer();

// prepare the selection clause
$tag = array(
	'uid' => $_GET['uid'],
);


$output = array(
	'exists' => 0,
	'error' => 'no record found',
);



// start with the most common search
$db->selectTable('inventory');

$gearArray = $db->fetchAssoc($tag);
if(sizeof($gearArray) == 1) {
	
	$gear = $gearArray[0];
	
	$gear['exists'] = 1;
	
	$gear['tagType'] = 'gear';
	
	// initialize the rental database pointer
	$rental_db = new MySQL_Pointer();
	
	$rental_db->selectTable('rentals');
	
	$rentals = $rental_db->fetchAssoc(
		array(
			'uid' => $gear['uid'],
		)
	);
	
	$checked_out = $rental_db->fetchSize(
		array(
			'uid' => $gear['uid'],
			'status' => 'out',
		)
	);
	
	$gear['checkedOut'] = $checked_out;
	$gear['rentals'] = $rentals;
	
	$output = $gear;
}


// now move on to members / staff
$db->selectTable('user');

$userArray = $db->fetchAssoc($tag, "OR `staff-uid`='".$_GET['uid']."'");
if(sizeof($userArray) == 1) {
	
	$user = $userArray[0];
	
	$user['exists'] = 1;
	$user['tagType'] = 'user';
	
	$output = $user;
}



$output['tagId'] = $_GET['uid'];

echo json_encode($output);



?>