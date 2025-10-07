<?php header('Access-Control-Allow-Origin: *'); ?>
<?php
class listPairs{
    public $list = [];
    function push($pair){
        array_push($this->list,$pair);
    }
}
class Painting{
    public $nome;
    public $descr;
    public $image;
    public $artist;
    public $id;
    public $tags;

    function set($id,$artist,$nome,$descr,$image){
        $this->nome = $nome;
        $this->artist = $artist;
        $this->descr = $descr;
        $this->image = $image;
        $this->id = $id;
    }
    function display(){
        echo $this->nome." ".$this->artist." ".$this->descr." ".$this->image."<br />";
    }
}

class Pair{
    public $painting_1;
    public $painting_2;
    public $keyword;
    function add_pair($p1,$p2, $key){
        $this->painting_1 = $p1;
        $this->painting_2 = $p2;
        $this->keyword = $key;
    }
}
?>