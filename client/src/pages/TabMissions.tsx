import {  IonList, IonItem, IonLabel, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

import firebase from '../utils/Firebase';
import React, { useState, useEffect } from 'react';

import './TabMissions.css';
import MissionComponent from "../components/MissionComponent";

const TabMissions: React.FC = () => {
  return (
    <IonPage>


        <IonContent fullscreen>
            <MissionComponent></MissionComponent>
        </IonContent>

    </IonPage>
  );
};

export default TabMissions;
