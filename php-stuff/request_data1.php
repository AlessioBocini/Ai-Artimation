<?php header('Access-Control-Allow-Origin: *'); ?>
<?php
    require "PairPainting.php";
    //header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    require "connect_to_db.php";
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $conn = create_connection(); // Create connection to db
    $list_p = array(); // Make new array as list of paintings
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    $qq = "USE ai_art_amatour;"; // Query to tell what db to use.
    $conn->query($qq);

    // Actual query to request all the info from db.
    $qq ="SELECT o.id as id, o.nome as nome, o.descr as descrizione, o.imgname as image1, (select a.nome from artista a where o.artista = a.id ) as artista from opera o";
    $res = $conn->query($qq);

    if($res !== false && $res->num_rows>0){
        //If the result exists:
        while($row = $res->fetch_assoc()){
            $paint_1 = new Painting(); // Make new object of Painting. 
            $paint_1->set($row["id"],$row["artista"],$row["nome"],$row["descrizione"],$row["image1"]); // Insert all the information.
            array_push($list_p,$paint_1); // Push the object in the list.
        }
    }
    echo json_encode($list_p); // encode the list into JSON and send it.
    $conn->close();//Close Connection.
?>


