<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');


class Login{
	private $onlineDb = 'uOnlineInfo';
	private $cookieName = 'uInfo';
	public function __construct(){
		$this->CI = &get_instance();
	}

	public function doLogin($uid){
		//登录要写cookie，内容包含uid和在线id
		$onlineId = $this->save_online_info($uid);
		$cookieCont = $this->encode_cookie($uid,$onlineId);

		set_cookie($this->cookieName,$cookieCont,time()+$this->CI->config->item('login_expire'));
	}

	private function encode_cookie($uid,$onlineId){
		return base64_encode($uid.'|'.$onlineId);
	}

	private function save_online_info($uid){
		$zeit = time();
		$data = [];
		$data['loginTS'] = $zeit;
		$data['crmId'] = $uid;
		$data['_id'] = new MongoId();
		$this->CI->cimongo->insert($this->onlineDb,$data);
		return (string)$data['_id'];
	}

	public function isLogin(){
		$cookieCont = $this->CI->input->cookie($this->cookieName);
		if($cookieCont===null){
			return false;
		}
		$uInfo = $this->decode_cookie($cookieCont);
		if(!MongoId::isValid($this->onlineId) || !MongoId::isValid($this->uid)){
			return false;
		}

		$onlineLoginInfo = $this->get_online_info();
		if($onlineLoginInfo['crmId'] != $this->uid){
			return false;
		}
		if(time() - $onlineLoginInfo['loginTS']>60){
			$this->update_online_info();
		}
		return true;
	}

	private function update_online_info(){
		$this->CI->cimongo->where(['_id'=>new MongoId($this->onlineId)])->update($this->onlineDb,['loginTS'=>time()]);
	}

	private function get_online_info(){
		$query = $this->CI->cimongo->where(['_id'=>new MongoId($this->onlineId)])->get($this->onlineDb);
		if($query->num_rows()>0){
			return $query->row_array();
		}
		return false;
	}

	private function decode_cookie($cookieCont){
		$uInfo = explode('|', base64_decode($cookieCont));
		$this->uid = $uInfo[0];
		$this->onlineId = $uInfo[1];
		return $uInfo;
	}

	public function doLogout(){
		delete_cookie($this->cookieName);
	}
}

?>