import React, {Component, useState} from "react";
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import './style.scss';

import {GridProps, BoxProps, TweetGamePropsType} from "../../types/types";
import Confetti from "react-confetti";
import { DragDropContainer, DropTarget } from 'react-drag-drop-container';

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

	dropped(e){
      e.containerElem.style.visibility = 'hidden';
	  e.target.style.border = "solid 1px red"
	  console.log(e)
  }

	render() {
		return (
			<IonGrid>
				{false && <Confetti width={this.state.width} height={this.state.height} />}
			  <IonRow>

				  <DragDropContainer targetKey="foo" >
						<div className={"box"}>Drag Me!</div>
					</DragDropContainer>

					<DropTarget targetKey="foo" onHit={this.dropped}>
						<div className="box large my_target">I'm a valid drop target for the object above since we both have the same targetKey!</div>
					</DropTarget>

			  </IonRow>
			</IonGrid>

		);
	};
}

export default SoundGame;
