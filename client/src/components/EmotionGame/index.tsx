import React, { Component} from "react";
import './style.scss';

import {loadModels} from "../../utils/faceApi";
import {createFaLibrary} from "../../utils/icons";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Camera from "../../components/Camera/Camera";
import {EmotionGamePropsType} from "../../types/types";

createFaLibrary();
loadModels();

class EmotionGame extends Component<EmotionGamePropsType> {
	state: any;

	constructor(props: any) {
		super(props);

		this.state = {
			score : 0,
			selectedFace:"",
			selectedColumn:0,
			startDate:Date.now(),
			height : window.innerHeight,
			width : window.innerWidth,
			mode: false
		}

	}

	setMode = (val) =>{
		this.setState({"mode":val})
	}


	render() {
		return (
			<div className="App">
			  <header>
				<div className="App__header">
				  <h1>
					<span>Emotion Detector</span>
				  </h1>
					<p>Your score: {this.state.score}</p>

				</div>
			  </header>
			  <Camera photoMode={this.state.mode} score={this.state.score}/>

			</div>
		);
	};
}

export default EmotionGame;
