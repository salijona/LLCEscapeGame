import { IonContent, IonHeader, IonFooter, IonPage} from '@ionic/react';
import React, { Component, MouseEvent, useState, useEffect } from 'react';

import './TabMap.css';
import {ReactComponent as LuxembourgMap} from '../assets/images/Cantons_du_Luxembourg.svg';

const TabMap: React.FC = (myprops) => {


    const east = [0,4,5]
    const south = [1,2]
    const north = [7,8,9,10,11]
    const center = [3,6]

    const games = {"south":"age","center":"emotion","north":"tweet","east":"sound"}

  const handleClick = (evt) => {
      if (evt.target.nodeName=="DIV"){
          return
      }

      const zone = evt.target.classList[0]
      var districts = document.getElementById("Kantone").getElementsByClassName(zone)

      if (evt.target.classList.length == 1){
          for (const district of districts as any) {
            district.classList.add("ai")
        }
      }
      else{
          for (const district of districts as any) {
            district.classList.remove("ai")
        }
      }

      window.location.href="/missions/"+games[zone]

  };

    useEffect(() => {

        var districts = document.getElementById("Kantone").getElementsByTagName("path")


        for (const x of east) {
            districts[x].classList.add("east")
            districts[x].classList.add("ai")
        }

        for (const x of north) {
            districts[x].classList.add("north")
            districts[x].classList.add("ai")
        }

        for (const x of south) {
            districts[x].classList.add("south")
            districts[x].classList.add("ai")
        }

        for (const x of center) {
            districts[x].classList.add("center")
            districts[x].classList.add("ai")
        }
    })


  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{height: '100vh'}} onClick={handleClick}>

            <LuxembourgMap id="svgMap"/>
        </div>



      </IonContent>
    </IonPage>
  );
};

export default TabMap;
