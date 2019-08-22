<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class Automobil extends Doctrine_Record{
    public function setTableDefinition() {
        
        $this->setTableName("automobil");
        $this->hasColumn("korisnik_id","integer",20);
        $this->hasColumn("reg_broj","string",255);
        $this->hasColumn("reg_datum","string",255);
    }
    public function setUp() {
        $this->actAs("Timestampable");
        $this->hasOne("Korisnik",array("local"=>"korisnik_id","foreign"=>"id"));
    }
    
}