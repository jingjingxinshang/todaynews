<?php
 
function curl_post_in($url) {
	$curl = curl_init();
	curl_setopt($curl, CURLOPT_URL, $url);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	$data = curl_exec($curl);
	curl_close($curl);
	return $data;
}

if (isset($_GET['type'])) {
	echo curl_post_in("http://v.juhe.cn/toutiao/index?type=".$_GET['type']."&key=298a415a97c7dfba7bcf66c80d576d2b");
}
if (isset($_POST['type'])) {
	echo curl_post_in("http://v.juhe.cn/toutiao/index?type=".$_POST['type']."&key=298a415a97c7dfba7bcf66c80d576d2b");
}
?>