<?php

    require('../includes/config.php');

    $file = './data/matchTree';
    $content = unserialize(file_get_contents($file));
    
    header("Content-type: application/json");
    print(json_encode($content));

?>