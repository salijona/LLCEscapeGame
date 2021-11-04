import React, {useState} from "react";
import useCountDown from 'react-countdown-hook';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Spinner from "../Spinner/Spinner";

import {mapExpressionToEmoji, mapExpressionGenderToEmoji, emotions} from "../../utils/emojis";

import "./Results.css";
const initialTime = 5 * 1000; // initial time in milliseconds, defaults to 60000
const interval = 1000; // interval to change remaining time amount, defaults to 1000


const Results = ({results, processing, score}) => {

    const [timeLeft, { start, pause, resume, reset }] = useCountDown(initialTime, interval);
    const [targetFace, setTargetFace] = useState(0);

    React.useEffect(() => {
        restartEvent()
      }, []);

    const restart = React.useCallback(() => {
    start();
  }, []);

    function restartEvent() {

        if (results && results.length > 0) {

            let userFace = results[0].expressions.asSortedArray()[0].expression

            console.log(emotions[targetFace], userFace)
            if (userFace == emotions[targetFace]) {
                score += 1
                alert("ok")

            }
        }
         start();
         setTimeout(restartEvent, initialTime);
         setTargetFace(Math.floor(Math.random()*emotions.length))
    }

  if (processing && results) {
    return
          <div>
              <p>You should look{" "}
              {emotions[targetFace]}
              </p>
              <p>Time left: {Math.floor(timeLeft/1000)}</p>
                <Spinner />
            </div>
      ;
  }
  if (!processing && results && results.length > 0) {
    return (
      <div className="results">
        {results.length > 1 ? (
          <div>
            <p>I think...</p>
            {results.map((result, i) => (
              <div className="results__wrapper" key={i}>

              </div>
            ))}
          </div>
        ) : (
          <div className="results__wrapper">
            <div>
              <p>You should look{" "}
              {emotions[targetFace]}
              </p>
              <p>Time left: {Math.floor(timeLeft/1000)}</p>

            </div>
            <div className="results__emoji">
            <p>
                You look{" "}
                {results[0].expressions.asSortedArray()[0].expression}
              </p>
              <FontAwesomeIcon
                icon={mapExpressionToEmoji(
                  results[0].expressions.asSortedArray()[0].expression
                )}
                size="4x"
              />
              <FontAwesomeIcon
                icon={mapExpressionGenderToEmoji(
                  results[0].gender
                )}
                size="4x"
              />

            </div>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="results">
        <Spinner />
      </div>
    );
  }
};

export default Results;
