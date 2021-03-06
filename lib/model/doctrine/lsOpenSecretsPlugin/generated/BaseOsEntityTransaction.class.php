<?php
// Connection Component Binding
Doctrine_Manager::getInstance()->bindComponent('OsEntityTransaction', 'main');

/**
 * This class has been auto-generated by the Doctrine ORM Framework
 */
abstract class BaseOsEntityTransaction extends sfDoctrineRecord
{
  public function setTableDefinition()
  {
    $this->setTableName('os_entity_transaction');
    $this->hasColumn('id', 'integer', 4, array('type' => 'integer', 'primary' => true, 'autoincrement' => true, 'length' => '4'));
    $this->hasColumn('entity_id', 'integer', 4, array('type' => 'integer', 'notnull' => true, 'length' => '4'));
    $this->hasColumn('cycle', 'string', 4, array('type' => 'string', 'notnull' => true, 'length' => '4'));
    $this->hasColumn('transaction_id', 'string', 7, array('type' => 'string', 'notnull' => true, 'length' => '7'));
    $this->hasColumn('match_code', 'integer', null, array('type' => 'integer'));
    $this->hasColumn('is_verified', 'boolean', null, array('type' => 'boolean', 'notnull' => true, 'default' => false));
    $this->hasColumn('is_processed', 'boolean', null, array('type' => 'boolean', 'notnull' => true, 'default' => false));
    $this->hasColumn('is_synced', 'boolean', null, array('type' => 'boolean', 'notnull' => true, 'default' => true));
    $this->hasColumn('reviewed_by_user_id', 'integer', null, array('type' => 'integer'));
    $this->hasColumn('reviewed_at', 'timestamp', null, array('type' => 'timestamp'));
    $this->hasColumn('locked_by_user_id', 'integer', null, array('type' => 'integer'));
    $this->hasColumn('locked_at', 'timestamp', null, array('type' => 'timestamp'));

    $this->option('collate', 'utf8_unicode_ci');
    $this->option('charset', 'utf8');
  }

}