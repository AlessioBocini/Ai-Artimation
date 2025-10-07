<?php header('Access-Control-Allow-Origin: *'); ?>
<?php
    //header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    require "connect_to_db.php";
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $conn = create_connection(); // Create connection to db
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    $artista = $_POST["artist"];
    $descr = $_POST["descr"];
    $title = $_POST["title"];
    $img_name = $_POST["file"];

    if($artista == NULL){
        die("artist placed found");
    }
    $qq = "USE ai_art_amatour;"; // Query to tell what db to use.
    $conn->query($qq);

    // Actual query to request all the info from db.
    $qq = "SELECT (select a.id from artista a where a.nome = '$artista') as id, max(id) as last_id from artista";
    //$qq = "SELECT id FROM artista where nome = '$artista'";
    $res = $conn->query($qq);

    $next_artist_id = -1;
    $artista_id = -1;
    if($res !== false && $res->num_rows>0){
        $row = $res->fetch_assoc();
        $artista_id = $row["id"];
        if(!$artista_id) $artista_id = -1;
        $next_artist_id = $row["last_id"];
        if(!$next_artist_id) $next_artist_id = -1;
    }

    if($artista_id == -1){
        $artista_id = $next_artist_id+1;
        $qq = "INSERT INTO artista VALUES ($artista_id,'$artista')";
        $conn->query($qq);
    }

    $qq = "SELECT max(id) as last_id from opera";
    $res = $conn->query($qq);
    if($res !== false && $res->num_rows>0){
        $row = $res->fetch_assoc();
        $next_opera_id = $row["last_id"] ;
        if(!$next_opera_id) $next_opera_id = -1;
    }

    $opera_id = $next_opera_id +1;
    $qq ="INSERT INTO opera(id,nome,descr,imgname,artista) VALUES('$opera_id','$title','$descr','$img_name','$artista_id')";
    $res = $conn->query($qq);

    if($res == 1) echo $opera_id;
    else{
        echo -1;
        die();
    }
    $conn->close();//Close Connection.
?>