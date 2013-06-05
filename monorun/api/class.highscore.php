<?php
class highscore {
	private $id = 0;
	private $username = '';
	private $dateline = 0;
	private $original_score = 0;
	private $current_score = 0;
	private $secret_key = '';
	private $last_cron_run = 0;
	private $position = -1;
	private $db_connection = null;
	private $seconds_til_half_life = 86400;

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
		
		$statement = $this->db_connection->prepare( "SELECT id, username, dateline, last_cron_run, current_score, original_score, secret_key FROM highscore WHERE id = :id LIMIT 0,1" );
		$statement->execute( array( 'id' => $id ) );			 

		if( $statement->rowCount() == 0 ) {
			return false;
		}

		while($row = $statement->fetch()) {
			$this->id = $row->id;
			$this->username = $row->username;
			$this->dateline = $row->dateline;
			$this->last_cron_run = $row->last_cron_run;
			$this->original_score = $row->original_score;
			$this->current_score = $row->current_score;
			$this->current_score = $row->current_score;
			$this->secret_key = $row->secret_key;
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

	public function delete() {
		if( !$this->id ) {
			return false;
		}

		$statement = $this->db_connection->prepare( "DELETE FROM highscore WHERE id = :id" );
		$statement->execute( 
			array( 
				'id' => intval( $this->id )
			)
		);

		return true;
	}

	public function save() {
		if( $this->id === 0 ) {
			// Insert the score
			$statement = $this->db_connection->prepare( trim( "
				INSERT INTO highscore (
					username, 
					dateline, 
					last_cron_run, 
					original_score, 
					current_score,
					secret_key
				) VALUES (
					:username,
					:dateline,
					:last_cron_run,
					:originalscore,
					:currentscore,
					:secret_key
				)
			")  );
			$statement->execute( 
				array( 
					'username' => $this->username,
					'dateline' => $this->dateline,
					'last_cron_run' => $this->last_cron_run,
					'originalscore' => $this->original_score,
					'currentscore' => $this->current_score,
					'secret_key' => $this->secret_key
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
					last_cron_run = :last_cron_run,
					original_score = :original_score,
					current_score = :current_score,
					secret_key = :secret_key
				WHERE
					id = :id
			");
			$statement->execute( 
				array( 
					'id' => $this->id,
					'username' => $this->username,
					'dateline' => $this->dateline,
					'last_cron_run' => $this->last_cron_run,
					'original_score' => $this->original_score,
					'current_score' => $this->current_score,
					'secret_key' => $this->secret_key,
				)
			);

			return true;
		}

		return false;
	}

	public function split_half_life(){
		$time_since_last_run = ( time() - $this->last_cron_run );
		$time_units = $this->current_score / 1000;

		if( $time_since_last_run > $this->seconds_til_half_life * $time_units ) {
			$this->current_score = intval( $this->current_score / 2 );
			$this->last_cron_run = time();
		
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
	public function set_last_cron_run( $last_cron_run ){
		$this->last_cron_run = $last_cron_run;
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
	public function get_last_cron_run(){
		return $this->last_cron_run;
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