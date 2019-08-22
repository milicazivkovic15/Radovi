<?php

class Car extends Doctrine_Record {
    public function setTableDefinition() {
        $this->setTableName("car");
        $this->hasColumn("driver_id","integer",20);
        $this->hasColumn("model","string",255);
        $this->hasColumn("motor_num","string",255);

    }
    
    public function setUp() {
        $this->actAs("Timestampable");
        $this->hasOne("Driver", array("local" => "driver_id", "foreign" => "id"));
    }
}
