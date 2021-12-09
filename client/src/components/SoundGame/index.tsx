import React, {Component, useState} from "react";
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import './style.scss';

import {GridProps, BoxProps, TweetGamePropsType} from "../../types/types";
import Confetti from "react-confetti";
import { useDrag } from 'react-dnd'


class SoundGame extends Component<TweetGamePropsType> {
	state: any;

	constructor(props: any) {
		super(props);

		this.state = {
			score : 0,
			startDate:Date.now(),
			height : window.innerHeight,
			width : window.innerWidth,
			tiles:Array.from(Array(this.props.cols).keys()),
			selectedColumn:0
		}

	}

	componentDidMount(){

	}

	render() {
		return (
			<IonGrid>
				{false && <Confetti width={this.state.width} height={this.state.height} />}
			  <IonRow>

			  </IonRow>
			</IonGrid>

		);
	};
}

export default SoundGame;
