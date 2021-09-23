import { IonContent, IonHeader, IonFooter, IonPage} from '@ionic/react';
import React, { Component, MouseEvent } from 'react';


import './TabMap.css';
import {ReactComponent as LuxembourgMap} from '../assets/images/Cantons_du_Luxembourg.svg';

const TabMap: React.FC = (myprops) => {

  const handleClick = (evt) => {
    console.log(evt)
      if  (evt.target.style.fill=='yellow'){
          evt.target.style.fill='red';
      }
      else{
          evt.target.style.fill='yellow';
      }
  };


  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{height: '100vh'}} onClick={handleClick}>

            <LuxembourgMap />
        </div>



      </IonContent>
    </IonPage>
  );
};

export default TabMap;
