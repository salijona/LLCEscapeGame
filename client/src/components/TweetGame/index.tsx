import React, {Component} from "react";
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import './style.scss';

import {GridProps, BoxProps, TweetGamePropsType} from "../../types/types";
import tweets from '../../data/tweets.json';
import Confetti from "react-confetti";


class TweetGame extends Component<TweetGamePropsType> {
	state: any;

	constructor(props: any) {
		super(props);


		this.state = {
			score : 0,
			startDate:Date.now(),
			height : window.innerHeight,
			width : window.innerWidth,
			tiles:Array.from(Array(this.props.cols).keys()),
			selectedColumn:0,
			selectedTweet:true,
			tweetA:"",
			tweetB:""
		}

		if (this.props.db){
			const doc = this.props.db.collection('llc')
			const observer = doc.where('game', '==', 'TWEET').where('type', '==', 'QR')
			  .onSnapshot(querySnapshot => {
				querySnapshot.docChanges().forEach(change => {

				if (change.type === "added") {
					let params = change.doc.data().params;
					let time = change.doc.data().time*1000;
					console.log(time, this.state.startDate, time > this.state.startDate)
					if (time > this.state.startDate){
						this.selectBox(this.state.selectedColumn, parseInt(params[0]))
					}

				}
			  });
			});
		}

	}
	
	updateTweets = () =>{
		let randomTweetOffensive = Math.floor(Math.random() * tweets.offensive.length)
		let randomTweetAdv = Math.floor(Math.random() * tweets.adversarial.length)

		let tweetOffensive = tweets.offensive[randomTweetOffensive].replaceAll("[","").replaceAll("]","").replaceAll("@user","")
		let tweetAdversarial = tweets.adversarial[randomTweetAdv].replaceAll("[","").replaceAll("]","").replaceAll("@user","")
		if (Math.random()<0.5){
			this.setState({"tweetA":tweetOffensive, "tweetB":tweetAdversarial, "advIndex":1,"adv":tweets.adversarial[randomTweetAdv]})
		}
		else {
			this.setState({"tweetB":tweetOffensive, "tweetA":tweetAdversarial, "advIndex":0,"adv":tweets.adversarial[randomTweetAdv]})
		}

	}

	selectBox = (lane:number, index:number) => {
		alert(lane*10+index)
	}

	populateRow = (row) => {

		return (label, index) =>{
		return <div style={{ textAlign: "center"}} className={"box"} key={ index } onClick={() => this.selectBox(row,index)}>
									<span style={{ display: "inline-block", marginTop:60}}>{label}</span>
		</div>
		}
	}

	populate = () =>{
		this.updateTweets()
	}

	componentDidMount(){
		this.populate();

	}

	render() {
		return (
			<IonGrid>
				{false && <Confetti width={this.state.width} height={this.state.height} />}
			  <IonRow>
				<IonCol>

					<div className="grid" style={{ width: this.state.tiles.length * 122}}>
							{this.state.tiles.map(this.populateRow(0),this)}
					</div>
					<div className="grid" style={{ width: this.state.tiles.length * 122}}>
							{this.state.tiles.map(this.populateRow(1),this)}
					</div>

					{this.state.selectedTweet &&

						<div  className="tweet" style={{marginTop:20, marginLeft:50, border:"solid 2px red"}}>
							<p>{this.state.adv}</p>
						</div>
					}

				</IonCol>
				<IonCol style={{textAlign: "center"}}>
					<h3>Tweets</h3>

						<div className="tweet">
								<p>{this.state.tweetA}</p>
						</div>

						<div className="tweet">
								<p>{this.state.tweetB}</p>
						</div>

				</IonCol>
			  </IonRow>
			</IonGrid>


		);
	};
}

export default TweetGame;
