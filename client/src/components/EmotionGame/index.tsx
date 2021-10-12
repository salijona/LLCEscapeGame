import React, {Component} from "react";
import './style.scss';

import {GridProps, BoxProps, EmotionGamePropsType} from "../../types/types";
import faces from '../../data/faces.json';

function arrayClone(arr) {
	return JSON.parse(JSON.stringify(arr));
}

class Box extends Component<BoxProps> {
	selectBox = () => {
		this.props.selectBox(this.props.row, this.props.col);
	}

	render() {
		return(
			<div className={this.props.boxClass}
				id={this.props.id}
				onClick={this.selectBox}
				 title={this.props.face}
				 style={{ backgroundImage: `url(${"../../assets/imgs/"+this.props.face.replace("#","/") || ""})` }}
			/>
		)
	}
}


class Grid extends Component<GridProps> {
	render() {
		const width = (this.props.cols * 102) + 1;
		const minAge = 21;
		const maxAge = 60;
		var boxArr = [];
		var gridBoxClass = "";


		var ages = Array.from(Array(maxAge-minAge).keys()).map(function(val){return val+minAge;});
		var ranAges = {},
			i = this.props.cols*2,
			j = 0;

		while (i--) {
			j = Math.floor(Math.random() * (ages.length));
			ranAges[ages[j]] = [];
			ages.splice(j,1);
		}

		for(i=0;i<faces.length;i++){

			let face_age = faces[i].split("#")[1].split("-")[0];
			let true_age = faces[i].split("#")[0].split("-")[1];
			if (face_age in ranAges) {
				//if (faces[i]!="age-"+29+"#"+29"+-M.jpg")
				if(face_age !=true_age){
					ranAges[face_age].push(faces[i])
				}

			}
		}

		var ranFaces = []
		var trueAges = []
		console.log(ranAges)

		for (const [key, values] of Object.entries(ranAges)) {
			var vals:any =values;
			if (vals.length>this.props.cols && Object.keys(ranFaces).length<this.props.cols){
				console.log("age",key);
				i = this.props.rows - 1;
				let advFaces = []

				while (i--) {
					j = Math.floor(Math.random() * (vals.length));
					if (vals[j] != undefined) {
						advFaces.push(vals[j]);
						vals.splice(j, 1);
					}
				}
				if (Math.random() > 0.5){
					advFaces.push("age-"+key+"#"+key+"-F.jpg");
				}
				else{
					advFaces.push("age-"+key+"#"+key+"-M.jpg");
				}

				trueAges.push(key);
				ranFaces.push(advFaces.sort(() => Math.random() - 0.5));

			}

		}

		console.log(ranFaces)

		for (var i = 0; i < this.props.cols; i++) {
			for (var j = 0; j < this.props.rows; j++) {
				let gridBoxId = i + "_" + j;
				gridBoxClass = this.props.gridFull[j][i] ? "box on" : "box off";
				boxArr.push(
					<Box
						boxClass={gridBoxClass}
						key={gridBoxId}
						id={gridBoxId}
						row={j}
						col={i}
						face={ranFaces[i][j]}
						selectBox={this.props.selectBox}
					/>
				)
		    }
		}
		return(
			<div className="grid" style={{ width: width}}>
				{boxArr}
			</div>

		)
	}
}

class EmotionGame extends Component<EmotionGamePropsType> {
	state: any;

	constructor(props: any) {
		super(props);

		this.state = {
			score : 0,
			gridFull: Array(this.props.rows).fill([]).map(() => Array(this.props.cols).fill(false)),

		}

		if (this.props.db){
			const doc = this.props.db.collection('llc')

			const observer = doc.where('game', '==', 'EMOTION').where('type', '==', 'QR')
			  .onSnapshot(querySnapshot => {
				querySnapshot.docChanges().forEach(change => {

				if (change.type === "added") {
					console.log("New QR code: ", change.doc.data());
					let params = change.doc.data().params;
					this.selectBox(params[0],params[1])
				}
			  });
			});
		}


	}

	selectBox = (row, col) => {

		let gridCopy = arrayClone(this.state.gridFull);
		if (gridCopy[row][col]) {
			gridCopy[row][col] = !gridCopy[row][col];
		}
		this.setState({
			gridFull: gridCopy,

		})
	}

	populate = () => {

		let gridCopy = arrayClone(this.state.gridFull);
		for (let i = 0; i < this.props.rows; i++) {
				for (let j = 0; j < this.props.cols; j++) {
						if (Math.floor(Math.random() * 4) === 1){
							gridCopy[i][j] = true;

						}
				}
		}



		this.setState({
			gridFull: gridCopy,

		})
	}


	componentDidMount(){
		this.populate();

	}

	render() {
		return (
			<Grid rows={this.props.rows} cols={this.props.cols} gridFull={this.state.gridFull} selectBox={this.selectBox}></Grid>
		);
	};
}

export default EmotionGame;
