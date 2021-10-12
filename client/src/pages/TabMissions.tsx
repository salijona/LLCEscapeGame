import {  IonList, IonItem, IonLabel, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState, useEffect } from 'react';

import './TabMissions.css';
import MissionComponent from "../components/MissionComponent";

import EmotionGame from "../components/EmotionGame";

const TabMissions: React.FC = () => {
  return (
    <IonPage>

        <IonContent fullscreen>
            <EmotionGame cols={7} rows={5} speed={100} ></EmotionGame>
        </IonContent>

    </IonPage>
  );
};

export default TabMissions;
