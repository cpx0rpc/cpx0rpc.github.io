<?php

	header('Cache-Control: no-cache');
	header("Content-Type: text/event-stream\n\n");

	while($i < 10) {
		echo "Data Packet\n\n";
		$i++;

		ob_end_flush();
		flush();		
		sleep(3);
	}


?>
