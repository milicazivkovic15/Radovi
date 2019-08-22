<?php

class Automobil extends Doctrine_Record{
    public function setTableDefinition() {
        $this->setTableName("automobil");
        $this->hasColumn("korisnik_id","integer",20);
        $this->hasColumn("reg_broj","string",255);
        $this->hasColumn("reg_datum","date");
    }
    public function setUp() {
        $this->actAs("Timestampable");
        $this->hasOne("Korisnik",array("local"=>"korisnik_id","foreign"=>"id"));
    }
    
}