<?php
/**
 * This class has been auto-generated by the Doctrine ORM Framework
 */
class NetworkMapTable extends Doctrine_Table
{
  public static function prepareData($data)
  {
    return array(
      'entities' => array_map(array('NetworkMapTable', 'prepareEntityData'), $data['entities']),
      'rels' => array_map(array('NetworkMapTable', 'prepareRelData'), $data['rels'])
    );
  }

  public static function prepareEntityData($entity)
  {
    sfLoader::loadHelpers(array("Asset", "Url"));

    $primary_ext = @$entity["primary_ext"] ? $entity["primary_ext"] : ((strpos($entity["url"], "person") === false) ? "Org" : "Person");
    $entity["primary_ext"] = $primary_ext;

    if (@$entity["image"] && strpos(@$entity["image"], "netmap") === false && strpos(@$entity["image"], "anon") === false)
    {
      $image_path = $entity["image"];
    }
    elseif (@$entity["filename"])
    {
      $image_path = image_path(ImageTable::getPath($entity['filename'], 'profile'));      
    }
    else
    {
      $image_path = ($primary_ext == "Person" ? image_path("system/netmap-person.png") : image_path("system/netmap-org.png"));
    }

    try 
    {
      $url = url_for(EntityTable::generateRoute($entity, "map"));
    } 
    catch (Exception $e) 
    {
      $url = 'http://littlesis.org/' . strtolower($primary_ext) . '/' . $entity['id'] . '/' . LsSlug::convertNameToSlug($entity['name']) . '/map';
    }
    
    if (@$entity["blurb"])
    {
      $description = $entity["blurb"];
    }
    else
    {
      $description = @$entity["description"];      
    }

    return array(
      "id" => self::integerize(@$entity["id"]),
      "name" => $entity["name"], 
      "image" => $image_path, 
      "url" => $url, 
      "description" => $description,
      "x" => @$entity["x"],
      "y" => @$entity["y"],
      "fixed" => true
    );      
  }

  public static function prepareRelData($rel)
  {
    sfLoader::loadHelpers(array("Asset", "Url"));

    try 
    {
      $url = url_for(RelationshipTable::generateRoute($rel));
    } 
    catch (Exception $e)
    {
      $url = "http://littlesis.org/relationship/view/id/" . $rel['id'];
    }
    
    return array(
     "id" => self::integerize($rel["id"]),
      "entity1_id" => self::integerize($rel["entity1_id"]),
      "entity2_id" => self::integerize($rel["entity2_id"]),
      "category_id" => self::integerize($rel["category_id"]),
      "category_ids" => (array) self::integerize($rel["category_ids"]),
      "is_current" => self::integerize($rel["is_current"]),
      "end_date" => @$rel["end_date"],       
      "value" => 1, 
      "label" => $rel["label"],
      "url" => $url,
      "x1" => @$rel["x1"],
      "y1" => @$rel["y1"],
      "fixed" => true
    );
  }

  public static function integerize($val)
  {
    if ($val === null)
    {
      return null;
    }

    if (is_array($val))
    {
      return array_map(array('NetworkMapTable', 'integerize'), $val);
    }

    if (is_string($val) && strpos($val, ',') !== false)
    {
      return self::integerize(explode(',', $val));
    }

    $int = (int) $val;

    if ($int === 0 && $val !== "0")
    {
      return null;
    }
    else
    {
      return $int;
    }
  }
}