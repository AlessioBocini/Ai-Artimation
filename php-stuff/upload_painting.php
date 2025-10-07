<?php header('Access-Control-Allow-Origin: *'); ?>
<?php

$target_dir = "C:/Users/Alessio/Desktop/ELABORATOC/docs/img/";
$target_file = $target_dir . basename($_FILES["file"]["name"]);
$uploaded = 1;
$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));



// Check if file already exists
if (file_exists($target_file)) {
  $uploaded = 0;
  echo $uploaded;
  die();
}

// Check file size
if ($_FILES["file"]["size"] > 500000) {
  $uploaded = 0;
  echo $uploaded;
  die();
}

// Check if $uploadOk is set to 0 by an error
if ($uploaded == 0) {
  $uploaded = 0;
  echo $uploaded;
  die();
// if everything is ok, try to upload file
} else {
  if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
    echo $uploaded;
  } else {
    $uploaded = 0;
    echo $uploaded;
    die();
  }
}
?>