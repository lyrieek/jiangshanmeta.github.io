<?php
	$sex = $_POST['sex'];

	if(!isset($sex) || empty($sex)){
		echo "数据错误";
		return;
	}



	if($sex=="男"){
		echo "不要男的";
	}else if($sex=="女"){
		echo "做我女朋友吧";
	}

?>