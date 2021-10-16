import {  IonList, IonItem, IonLabel, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState, useEffect } from 'react';

import './TabMissions.css';
import MissionComponent from "../components/MissionComponent";
import EmotionGame from "../components/EmotionGame";

import firebase from "../utils/Firebase";
require("firebase/firestore");
var db = firebase.firestore();

const TabMissions: React.FC = () => {
  return (
    <IonPage>

        <IonContent fullscreen>
            <EmotionGame cols={7} rows={5} speed={100} db={db}></EmotionGame>
        </IonContent>

    </IonPage>
  );
};

export default TabMissions;
