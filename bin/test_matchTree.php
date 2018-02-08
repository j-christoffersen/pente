#!/usr/bin/env php
<?php
    
    $file = '../public/data/matchTree';
    $content = unserialize(file_get_contents($file));
    print_r(array_values($content));

?>