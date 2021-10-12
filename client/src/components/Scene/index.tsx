import React, { useState, useEffect, useCallback } from 'react';
import { IonContent, IonInput, IonItem } from '@ionic/react';


import { connect } from 'react-redux';
import { ScenePropsType } from '../../types/types';
import SceneTexts from '../SceneTexts';
import SceneButton from '../SceneButton';
import {Saves, SettingsState} from '../../store/reducers/reducersTypes';
import { addSave } from '../../store/actions/savesActions';
import styles from './styles.module.scss';

import CameraService from "../../utils/Camera";
import jsQR from "jsqr";

let wordsInterval: number;
let wordsIntervalIndex: number = 0;

function Scene({ scene, nextScene, saves, settings, addSave }: ScenePropsType) {
  const [words, setWords] = useState(['']);
  const [isButtonsVisible, setButtonsVisible] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState('');
  const { image, texts, buttons, game } = scene;
  const [answer, setAnswer] = useState<string>('');


   const tackPictureClick = (type: string)=> async () => {

       const image_url = await CameraService.takePicture();
       var image = require('get-image-data')

       image(image_url, function (err, info) {
        var data = info.data
        var height = info.height
        var width = info.width

         const code = jsQR(data, width, height);

        if (code) {
          console.log("Found QR code", code);
          setAnswer(code.data)
          alert("Votre QR code contient "+code.data)
          nextText(code.data)
        }

        console.log(width+" "+height)
      })
       console.log(image_url)
   }
  const handleClick = (id: string) => () => {
    if(id !=""){

      if (id.startsWith("http")){
        window.open(id, '_blank');
      }
      else{
      clearScene();
      nextScene(id);
      }
    }
  };

  const lazyWords = useCallback(() => {
    const splitedText = texts[textIndex].text.split(' ');

    if (settings.lazyTexts) {
      wordsInterval = window.setInterval(() => {
        setWords((words) => [...words, splitedText[wordsIntervalIndex]]);
        wordsIntervalIndex++;

        if (wordsIntervalIndex >= splitedText.length) {
          clearInterval(wordsInterval);
          if (textIndex === texts.length - 1) {
            setButtonsVisible(true);

            //addSave({ time: Date.now(), name: scene.id+'#'+textIndex, id: scene.id, isAutoSave: false });

          }
        }
      }, 100);
    } else {
      setWords(splitedText);

      if (textIndex === texts.length - 1) {
        setButtonsVisible(true);
      }
    }
  }, [texts, textIndex, settings.lazyTexts]);

  const clearWords = () => {
    clearInterval(wordsInterval);
    wordsIntervalIndex = 0;
    setWords([]);
  };

  const clearScene = () => {
    setButtonsVisible(false);
    setTextIndex(0);
    clearWords();
  };

  const updateBackground = useCallback(() => {
    const newBackground: string | undefined = texts[textIndex].updatedImage;

    if (newBackground) {
      setBackgroundImage(newBackground);
    }
  }, [textIndex, texts]);

  const prevText = () => {
    if (textIndex - 1 >= 0) {
      setTextIndex((textIndex) => (textIndex -= 1));
    }
  };

  const nextText = (val="") => {
    if (textIndex + 1 < texts.length - 1) {
      setTextIndex((textIndex) => (textIndex += 1));
    } else if (textIndex + 1 === texts.length - 1) {

      if(! game || (game && answer!="" && answer==game.correctAnswer) || (game && val!="" && val==game.correctAnswer)){
        setTextIndex((textIndex) => (textIndex += 1));
        setButtonsVisible(true);
      }

    }
  };

  const isLeftArrowActive = () => {
    return textIndex > 0;
  };

  const isRightArrowActive = () => {
    return textIndex < texts.length - 1;
  };

  const autoSave = useCallback(() => {
    addSave({ time: Date.now(), name: 'AutoSave', id: scene.id, isAutoSave: true });
  }, [scene.id, addSave]);

  useEffect(() => {
    setTextIndex(0);
  }, [scene.id]);

  useEffect(() => {
    if (texts[textIndex]) {
      lazyWords();
      autoSave();
      updateBackground();
    }

    return () => {
      clearWords();
      setBackgroundImage('');
    };
  }, [lazyWords, autoSave, updateBackground, texts, textIndex]);

  return (
    <div className={styles.background} style={{ backgroundImage: `url(${backgroundImage || image})` }}>
      <div className={styles.content}>
        <div className={styles.buttons}>
          {isButtonsVisible && (textIndex == texts.length - 1) &&
            buttons.map((button) => (
              <SceneButton
                key={`${button.text}${button.redirectId}`}
                handleClick={handleClick(button.redirectId)}
                text={button.text}
              />
            ))}
          {
            game && (textIndex == texts.length - 2) &&
            <div>
            {game.type =="input" && <IonItem>
                    <IonInput placeholder="Votre réponse" onIonChange={e => setAnswer(e.detail.value!)}></IonInput>
                  </IonItem>
            }

            {game.type =="qrcode" &&
                    <SceneButton
                      key={`qrcode_${textIndex}`}
                      handleClick={tackPictureClick("qrcode")}
                      text={"Prendre une photo du QR Code"}
                    />
            }
            </div>


          }
        </div>
        {texts[textIndex]?.nickname && <div className={styles.nickname}>{texts[textIndex].nickname}</div>}
        {texts.length > 0 && (
          <SceneTexts
            isLeftArrowActive={isLeftArrowActive}
            isRightArrowActive={isRightArrowActive}
            words={words}
            prevText={prevText}
            nextText={nextText}
          />
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state: { saves: Saves;settings: SettingsState }) => {
  return {
    saves: state.saves,
    settings: state.settings,
  };
};

const mapDispatchToProps = {
  addSave,
};

export default connect(mapStateToProps, mapDispatchToProps)(Scene);
