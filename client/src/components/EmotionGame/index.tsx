import React, { Component} from "react";
import './style.scss';

import {loadModels} from "../../utils/faceApi";
import {createFaLibrary} from "../../utils/icons";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Switch from "react-switch";
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
			mode: true
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
					<span>Mood Detector</span>
				  </h1>
				  <div className="App__switcher">
					<FontAwesomeIcon
					  icon="camera"
					  color={this.state.mode ? "#007c6c" : "#cccccc"}
					/>

					<FontAwesomeIcon
					  icon="video"
					  color={!this.state.mode ? "#007c6c" : "#cccccc"}
					/>
				  </div>
				</div>
			  </header>
			  <Camera photoMode={this.state.mode} />
			</div>
		);
	};
}

export default EmotionGame;
