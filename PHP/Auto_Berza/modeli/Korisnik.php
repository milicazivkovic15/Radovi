<?php

class Korisnik extends Doctrine_Record{
    public function setTableDefinition() {
        $this->setTableName("korisnik");
        $this->hasColumn("fname","string",255);
        $this->hasColumn("lname","string",255);
        $this->hasColumn("username","string",255);
        $this->hasColumn("password","string",255);
    }
    
    public function setUp() {
        $this->actAs("Timestampable");
        $this->hasMany("Automobil",array("local"=>"id","foreign"=>"korisnik_id"));
    }
}