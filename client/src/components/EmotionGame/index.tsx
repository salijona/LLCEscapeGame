import React, {Component} from "react";
import './style.scss';

import {GridProps, BoxProps, EmotionGamePropsType} from "../../types/types";

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
			/>
		)
	}
}


class Grid extends Component<GridProps> {
	render() {
		const width = (this.props.cols * 52) + 1;

		var boxArr = [];
		var gridBoxClass = "";

		for (var i = 0; i < this.props.rows; i++) {
			for (var j = 0; j < this.props.cols; j++) {
				let gridBoxId = i + "_" + j;
				gridBoxClass = this.props.gridFull[i][j] ? "box on" : "box off";
				boxArr.push(
					<Box
						boxClass={gridBoxClass}
						key={gridBoxId}
						id={gridBoxId}
						row={i}
						col={j}
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
