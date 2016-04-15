<?php

require "../database.php";

$db = new MySQL_Pointer();

$db->selectTable('inventory');

$inventory = $db->fetchAssoc();

foreach($inventory as $row) {
	if($row['catalog'] == 'camping tent' || $row['catalog'] == 'climbing hardware') {
		$db->update($row, array(
			'image' => substr($row['id'], 0, 4).'.jpg',
		));
	}
}