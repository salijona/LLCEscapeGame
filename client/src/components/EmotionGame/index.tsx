import React, { useRef, useState, Component} from "react";
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import './style.scss';

import {GridProps, BoxProps, EmotionGamePropsType} from "../../types/types";
import { useFaceApi, } from 'react-use-faceapi';

import Confetti from "react-confetti";

const myFaceApiConfig = {
    input: 'my-image',
    refreshRate: 250,
	useFaceExpressionModel:true
}

function FaceRecognition({nbSteps}) {
	// Attributes
    const imageRef = useRef();
    const [image, setImage] = useState("");
    var faces = useFaceApi(myFaceApiConfig);

    // Rendering
    return (
        <div>

            <img style={{ width: 500 }} ref={imageRef} id="my-image" src={image} />
            <input type="file" onChange={(event) => setImage(URL.createObjectURL(event.target.files[0]))} />
			{faces.length}
            {faces && faces.map((face) => {

                // Attributes
                // @ts-ignore
				const top = face.relativeBox.top * imageRef.current.offsetHeight;
				// @ts-ignore
                const left = face.relativeBox.left * imageRef.current.offsetWidth;
                // @ts-ignore
                const width = face.relativeBox.width * imageRef.current.offsetWidth;
                // @ts-ignore
                const height = face.relativeBox.height * imageRef.current.offsetHeight;


                // Rendering
                return (
                    <div style={{
                        position: 'absolute',
                        width: width,
                        height: height,
                        left: left,
                        top: top,
                        border: '1px solid red',
                    }}
                    />
                );
            })}

        </div >
    )
}

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
			width : window.innerWidth
		}

	}

	selectBox = (row, col) => {

	}

	populate = () => {

	}


	componentDidMount(){
		this.populate();

	}

	render() {
		return (
			<FaceRecognition nbSteps={0}></FaceRecognition>
		);
	};
}

export default EmotionGame;
