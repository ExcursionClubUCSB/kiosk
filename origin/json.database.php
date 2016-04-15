<?php

require "../database.php";

$dbName = $_GET['db'];
$tableName = $_GET['table'];

$db = new MySQL_Pointer($dbName);

$db->selectTable($tableName);

$rows = $db->fetchAssoc();

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 01:00:00 GMT');
header('Content-type: application/json');
echo json_encode($rows);

exit;

?>