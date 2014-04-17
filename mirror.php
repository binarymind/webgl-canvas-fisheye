<?php
Header("Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0");
Header("Expires: Thu, 19 Nov 1981 08:52:00 GMT");
Header("Pragma: no-cache");
Header("Access-Control-Allow-Origin: *");
Header('Access-Control-Allow-Methods: POST, GET, OPTIONS');

//Header("Access-Control-Allow-Origin: *");
$fileName = strip_tags($_GET['url']);
$lastDotPos = strrpos($fileName, '.');
if ( !$lastDotPos ) $ext = 'jpeg';
else $ext = substr($fileName, $lastDotPos+1);
if($ext == 'jpg') $ext = "jpeg";
Header("Content-Type: image/".$ext);
echo file_get_contents($fileName);
?>