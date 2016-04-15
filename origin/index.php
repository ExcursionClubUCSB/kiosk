<?php

require "file-manifest.php";
require "csx-compiler.php";

$merge_files = array(
	'js' => false,
	'css' => true,
);

header('Content-Type:text/html; charset=UTF-8');
echo '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
<html>
<head>
	<title>Excursion Club</title>
';


/***************
**    css
***************/
$csx_manifest_params = File_manifest::read('css/manifest.txt');
$csx_compiler = new \csx\Compiler($csx_manifest_params);
if($merge_files['css']) {
	echo '<style>',"\n\n";
	echo $csx_compiler->output();
	echo "\n",'</style>',"\n";
}

echo '<script type="text/javascript">',"\n",'var CSS=',$csx_compiler->get_json(),';',"\n",'</script>'."\n";


/***************
** javascript
***************/
if($merge_files['js']) {
	echo "\t",'<script type="text/javascript">',"\n";
	echo File_manifest::merge('js/manifest.txt', "/************************\n** %PATH%\n************************/");
	echo "\n",'</script>'."\n";
}
else {
	echo File_manifest::gen('js/manifest.txt', '<script type="text/javascript" src="js/%PATH%"></script>')."\n";
}



$staff = $_GET['staff'];
$phone = $_GET['phone'];

if(isset($staff) && isset($phone)) {
	require "../database.php";
	$sdb = new MySQL_Pointer();
	$sdb->selectTable('user');
	$user = $sdb->fetchAssoc(
		array(
			'email' => $staff,
			'phone' => $phone,
			'type' => 'staff',
			'status' => 'active',
		)
	);
	if(sizeof($user) === 1) {
		echo '<script type="text/javascript">
Initialize.ready(function() {
	new StaffCard('.json_encode($user[0]).', true);
});
</script>';
	}
}


echo '
</head>
';

readfile('skeleton.html');

echo '
</html>
';

?>