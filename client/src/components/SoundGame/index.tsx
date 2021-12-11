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

		let sounds = Array.from(Array(this.props.cols).keys())
		sounds.sort(() => (Math.random() > .5) ? 1 : -1);

		let tiles = Array.from(Array(this.props.cols).keys())
		let associations = Object.fromEntries(tiles.map(e=>["drop_"+e,""]))


		this.state = {
			score : 0,
			startDate:Date.now(),
			height : window.innerHeight,
			width : window.innerWidth,
			tiles:tiles,
			scrambledSounds:sounds,
			associationsSounds:associations,
			selectedColumn:0
		}

		console.log(this.state.associationsSounds)

	}

	componentDidMount(){

	}

	populateRow = (row) => {

		return (label, index) =>{
		return <div style={{ textAlign: "center", display:"inline-block"}}  key={ index } >

			{row == 0 &&
			<DragDropContainer targetKey={"label"} >
				<div className="box" id={"sound_"+this.state.scrambledSounds[label]}>Drag Me!</div>
			</DragDropContainer>
			}

			{row == 1 &&
			<DropTarget targetKey={"label"} onHit={this.dropped} >
				<div className="box my_target" onDoubleClick={this.clearDrop}  id={"drop_"+label}>I'm a drop target </div>
			</DropTarget>
			}

				</div>
		}
	}


	dropped = (e) => {

		let associations = this.state.associationsSounds
		if(associations[e.target.id] !=""){
			document.getElementById(associations[e.target.id]).parentElement.parentElement.style.visibility = 'initial';
		}

		associations[e.target.id] = e.dragElem.firstChild.id
		this.setState({"associationsSounds":associations})

      	e.containerElem.style.visibility = 'hidden';
		if (e.target.id.split("_")[1]==e.dragElem.firstChild.id.split("_")[1]){
			e.target.classList.add("correct")
			e.target.classList.remove("incorrect")
		}
		else{
			e.target.classList.remove("correct")
			e.target.classList.add("incorrect")
		}

	  console.log(e.dragElem.firstChild.id, e.target.id,e )
  	}

	  clearDrop = (e) => {
			console.log(e)
		  let associations = this.state.associationsSounds
		  if (associations[e.target.id] != "") {
			  document.getElementById(associations[e.target.id]).parentElement.parentElement.style.visibility = 'initial';
			  e.target.classList.remove("incorrect")
			  e.target.classList.remove("correct")
		  }

		  this.setState({"associationsSounds": associations})
	  }

	render() {
		return (
			<IonGrid>
				{false && <Confetti width={this.state.width} height={this.state.height} />}
			  <IonRow>

				  <div className="grid" style={{ width: this.state.tiles.length * 122}}>
							{this.state.tiles.map(this.populateRow(0),this)}
					</div>
				  </IonRow>
				<IonRow>
					<div className="grid" style={{ width: this.state.tiles.length * 122}}>
							{this.state.tiles.map(this.populateRow(1),this)}
					</div>

			  </IonRow>
			</IonGrid>

		);
	};
}

export default SoundGame;
