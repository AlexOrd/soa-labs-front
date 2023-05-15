import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

//-- Allows this service to be used in components --//
@Injectable({
  providedIn: 'root'
})

//-- Contains functions necessary to different components --//
export class HomeInfoService {
  markers: google.maps.LatLngLiteral[] = [];
  info: HomeInformation[] = [];
  markloc: number = 0;
  constructor(
    private http: HttpClient
  ) { }

  /**
   * Grabs the saved information for each marker that has been placed (and not deleted)
   * @returns HomeInformation[] -- An array of HomeInformation objects, each filled with its own data
   */
  getMarkers(){
    if(localStorage.getItem('info') == null || localStorage.getItem('info') == undefined){
      localStorage.setItem('info',JSON.stringify(this.info));
      return this.info;
    }
    else{
      var info = JSON.parse(localStorage.getItem('info')!);
      return info;
    }
  }

  /**
   * Meant to act as a bridge between app.component.ts and home-info.component.ts
   * ----
   * Moves data from app.component.ts to here, where it can be grabbed by home-info.component.ts
   * @param num The index of the marker that has been selected
   */
  passMarkerData(num: number): void{
    this.markloc = num;
  }

  /**
   * Adds a new marker to the map, and saves it to the array of HomeInformation objects
   * ----
   * If you want to make changes to the data structure, make sure to account for it here
   * @param newmarker The coordinates that were clicked by the user, where the marker is to be placed
   */
  addMarker(newmarker: google.maps.LatLngLiteral){
    var info = JSON.parse(localStorage.getItem('info')!); //Make sure all data is current
    var newinfo: HomeInformation = {                      //Placeholder information to go with new marker
      location: newmarker,
      address: "Placeholder Address",
      value: 0,
      description: "Placeholder Description"
    }
    info.push(newinfo);                                   //Add the new data to the info[] array
    localStorage.setItem('info',JSON.stringify(info));    //Save the info array to storage
  }
  /**
   * Deletes the indicated marker from session and storage.
   * @param mark The index number (of the variable info[]) that corresponds to the marker to be deleted.
   */
  removeMarker(mark: number){
    var info = JSON.parse(localStorage.getItem('info')!); //Make sure all data is current
    info.splice(mark,1);                                  //Remove the specified marker's data from the info array
    localStorage.setItem('info',JSON.stringify(info));    //Save the info array to storage
  }
}

//-- Custom Object meant to hold the data relevant to the markers --//
export interface HomeInformation{
  location: google.maps.LatLngLiteral,
  address: string,
  value: number,
  description: string
}