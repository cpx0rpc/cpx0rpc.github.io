<?php 
$endpoint = $_POST['endpoint'];
$p256dh = $_POST['p256dh'];
$auth = $_POST['auth'];
$addData = $_POST['additionalData'];

file_put_contents('endpoint.txt', 'Endpoint: ' . $endpoint . '\np256dh: ' . $p256dh . '\nauth: ' . $auth . '\nadditionalData: ' . $addData);
?>