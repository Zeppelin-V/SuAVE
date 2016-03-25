<?php
/**
 *
 * @version 1.0
 * @author Rene
 */

namespace Deepzoom;

require("ImageCreator.php");
require("Descriptor.php");
require("ImageAdapter/Imagick.php");
require("StreamWrapper/File.php");

class CollectionCreator {
    private $imageCreator;
    private $descriptor;
    private $imagick;
    private $tilesize;

    public function __construct($tilesize=256) {
       $this->tilesize = $tilesize;
       $this->descriptor = new Descriptor(new StreamWrapper\File());
       //This doesn't work because of a seeming bug in the Imagick code.
       //$this->imageCreator = new ImageCreator(new StreamWrapper\File(), $this->descriptor, new ImageAdapter\Imagick(), $tilesize);
    }

    public function create($dir, $sources, $destination) {
        $maxlevel = 0;
        $xml = "";
        for($i = 0; $i < count($sources); $i++) {
            $source = $sources[$i];
            $id = substr($source, 0, strrpos($source, "."));
            $this->imageCreator = new ImageCreator(new StreamWrapper\File(), $this->descriptor, new ImageAdapter\Imagick(), $this->tilesize);
            $this->imageCreator->create("$dir/$source", "$dir/$id.dzi");
            $xml .= "<I N=\"$i\" Id=\"$id\" Source=\"$id.dzi\"><Size Width=\"" . $this->descriptor->getWidth() . "\" Height=\"" . $this->descriptor->getHeight(). "\" /></I>";
            if($this->descriptor->getNumLevels() - 1 > $maxLevel) $maxLevel = $this->descriptor->getNumLevels() - 1;
        }

        $xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?><Collection MaxLevel=\"$maxLevel\" TileSize=\"256\" Format=\"jpg\"><Items>$xml</Items></Collection>";

        $fp = fopen("$dir/$destination", "w");
        fprintf($fp, $xml);
        fclose($fp);
    }

}
