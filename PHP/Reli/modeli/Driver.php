<?php

class Driver extends Doctrine_Record {
    public function setTableDefinition() {
        $this->setTableName("driver");
        $this->hasColumn("fname","string",255);
        $this->hasColumn("lname","string",255);
        $this->hasColumn("email","string",255);
        $this->hasColumn("phone","string",255);
        $this->hasColumn("year","integer",20);

    }
    
    public function setUp() {
        $this->actAs("Timestampable");
        $this->hasMany("Car", array("local" => "id", "foreign" => "driver_id"));
    }
}