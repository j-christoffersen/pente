#!/usr/bin/env php

<?php
    //Generate the Trie to match patterns against
    require("../includes/config.php");

    $matches = array(
    array("pat" => array(2,1,0), "pts" =>pow(5,0)),
    array("pat" => array(1,2,0), "pts" =>-pow(5,0)),
    array("pat" => array(0,1,0), "pts" =>pow(5,1)/2),
    array("pat" => array(0,2,0), "pts" =>-pow(5,1)/2),
    array("pat" => array(2,1,1,0), "pts" =>-pow(5,3)+5),//these two don't follow a specific pattern
    array("pat" => array(1,2,2,0), "pts" =>pow(5,3)-pow(5,2)),
    array("pat" => array(0,1,1,0), "pts" =>pow(5,2)/2),
    array("pat" => array(0,2,2,0), "pts" =>-pow(5,2)/2),
    array("pat" => array(2,1,1,1,0), "pts" =>pow(5,2)),
    array("pat" => array(1,2,2,2,0), "pts" =>-pow(5,2)),
    array("pat" => array(2,1,0,1,0), "pts" =>pow(5,0)),
    array("pat" => array(1,2,0,2,0), "pts" =>-pow(5,0)),
    array("pat" => array(0,1,1,1,0), "pts" =>pow(5,3)/2),
    array("pat" => array(0,2,2,2,0), "pts" =>-pow(5,5)/2),
    array("pat" => array(0,1,0,1,0), "pts" =>5),
    array("pat" => array(0,2,0,2,0), "pts" =>-5),
    array("pat" => array(2,1,1,1,1,0), "pts" =>pow(5,3)),
    array("pat" => array(1,2,2,2,2,0), "pts" =>-pow(5,6)),
    array("pat" => array(2,1,0,1,1,0), "pts" =>pow(5,2)),
    array("pat" => array(1,2,0,2,2,0), "pts" =>-pow(5,2)),
    array("pat" => array(2,1,1,0,1,0), "pts" =>pow(5,2)),
    array("pat" => array(1,2,2,0,2,0), "pts" =>-pow(5,2)),
    array("pat" => array(0,1,1,1,1,0), "pts" =>pow(5,6)/2),
    array("pat" => array(0,2,2,2,2,0), "pts" =>-pow(5,7)/2),
    array("pat" => array(0,1,0,1,1,0), "pts" =>pow(5,3)),
    array("pat" => array(0,2,0,2,2,0), "pts" =>-pow(5,5)),
    array("pat" => array(1,2,2,2,2,0), "pts" =>-pow(5,7)),
    array("pat" => array(1,1,0,1,1), "pts" => 5/2),
    array("pat" => array(2,2,0,2,2), "pts" =>-pow(5,7)/2),
    array("pat" => array(1,1,1,0,1), "pts" =>pow(5,3)),
    array("pat" => array(2,2,2,0,2), "pts" =>-pow(5,7)),
    array("pat" => array(1,1,1,1,1), "pts" =>200000/2), //game over override @ 100,000
    array("pat" => array(2,2,2,2,2), "pts" =>-200000/2)
    );


    $matchTree = array(array(),array(),array(),0);
    $n = count($matches);
    for ($i=0; $i<$n; $i++) {
        $cur_node =& $matchTree;
        $m = count($matches[$i]["pat"]);
        for ($j=0; $j<$m; $j++) {
            //if node doesnt exist, create one
            if($cur_node[$matches[$i]["pat"][$j]]==NULL){
                $cur_node[$matches[$i]["pat"][$j]]=array(array(),array(),array(),0);
            }
            $cur_node =& $cur_node[$matches[$i]["pat"][$j]];
        }
        $cur_node[3] = $matches[$i]["pts"];
    }

    $file = '../public/data/matchTree';
    $content = serialize($matchTree);
    file_put_contents($file, $content);

?>