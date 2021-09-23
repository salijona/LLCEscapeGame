import { IonContent, IonHeader, IonFooter, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, IonFabList } from '@ionic/react';
import{ Component, MouseEvent } from 'react';

import MapComponent from "../components/MapComponent";

import './TabMap.css';

const TabMap: React.FC = (myprops) => {




  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{height: '100vh'}}>

            <MapComponent></MapComponent>
        </div>



      </IonContent>
    </IonPage>
  );
};

export default TabMap;
