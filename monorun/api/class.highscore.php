<?php
class highscore {
	private $id = 0;
	private $username = '';
	private $dateline = 0;
	private $original_score = 0;
	private $current_score = 0;
	private $secret_key = '';
	private $position = -1;
	private $db_connection = null;

	function __construct( $id = 0 ) {
		global $db_connection;
		$this->db_connection = $db_connection;
		$id = intval( $id );

		$this->secret_key = md5( rand( 0,1000000 ) . '_monorun_' . time() );

		if( $id ) {
			$this->load( $id );
		}

	}

	private function load( $id ) {
		$id = intval( $id );
		
		$statement = $this->db_connection->prepare( "SELECT id, username, dateline, current_score, original_score, secretkey FROM highscore WHERE id = :id LIMIT 0,1" );
		$statement->execute( array( 'id' => $id ) );			 

		if( $statement->rowCount() == 0 ) {
			return false;
		}

		while($row = $statement->fetch()) {
			$this->id = $row->id;
			$this->username = $row->username;
			$this->dateline = $row->dateline;
			$this->original_score = $row->original_score;
			$this->current_score = $row->current_score;
			$this->secret_key = $row->secretkey;
			$this->position = $this->find_position();
		}

		return true;
	}

	private function find_position() {
		$statement = $this->db_connection->prepare( "SELECT id FROM highscore WHERE current_score > :score" );
		$statement->execute( 
			array( 
				'score' => intval( $this->current_score )
			)
		);

		return $statement->rowCount() + 1;
	}

	public function set_id( $id ) {
		if( $this->load( $id ) ) {
			return true;
		}
		return false;
	}

	public function save() {
		if( $this->id === 0 ) {
			// Insert the score
			$statement = $this->db_connection->prepare( trim( "
				INSERT INTO highscore (
					username, 
					dateline, 
					original_score, 
					current_score,
					secretkey
				) VALUES (
					:username,
					:dateline,
					:originalscore,
					:currentscore,
					:secretkey
				)
			")  );
			$statement->execute( 
				array( 
					'username' => $this->username,
					'dateline' => $this->dateline,
					'originalscore' => $this->original_score,
					'currentscore' => $this->current_score,
					'secretkey' => $this->secret_key
				) 
			);

			$this->id = $this->db_connection->lastInsertId();

			return true;
		} else {
			// Update score
			$statement = $this->db_connection->prepare("
				UPDATE highscore set
					username = :username,
					dateline = :dateline,
					original_score = :original_score,
					current_score = :current_score,
					secretkey = :secretkey
				WHERE
					id = :id
			");
			$statement->execute( 
				array( 
					'id' => $this->id,
					'username' => $this->username,
					'dateline' => $this->dateline,
					'original_score' => $this->original_score,
					'current_score' => $this->current_score,
					'secretkey' => $this->secret_key,
				)
			);

			return true;
		}

		return false;
	}



	public function set_username( $username ){
		$this->username = $username;
		return true;
	}
	public function set_dateline( $dateline ){
		$this->dateline = $dateline;
		return true;
	}
	public function set_original_score( $original_score ){
		$this->original_score = $original_score;
		return true;
	}
	public function set_current_score( $current_score ){
		$this->current_score = $current_score;
		$this->position = $this->find_position();
		return true;
	}


	public function get_id(){
		return $this->id;
	}
	public function get_username(){
		return $this->username;
	}
	public function get_dateline(){
		return $this->dateline;
	}
	public function get_original_score(){
		return $this->original_score;
	}
	public function get_current_score(){
		return $this->current_score;
	}
	public function get_secret_key(){
		return $this->secret_key;
	}
	public function get_position(){
		return $this->position;
	}

	public function validate( $secret_key ){
		return ( $this->secret_key == $secret_key ? true : false );
	}


}

?>