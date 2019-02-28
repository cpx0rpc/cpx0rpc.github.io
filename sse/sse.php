<?php
	header('Content-Type: text/event-stream');
	header('Cache-Control: no-cache');

	while($i < 10) {
		echo "Data Packet\n\n";
		$i++;

		ob_end_flush();
		flush();		
		sleep(3);
	}


?>
