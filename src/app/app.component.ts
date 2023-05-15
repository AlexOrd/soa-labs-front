import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { HomeInfoComponent } from './home-info/home-info.component';
import { HomeInfoService,HomeInformation} from './home-info.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

//-- Takes care of initializing the google maps functionality, along with adding and interacting with markers --//
export class AppComponent implements OnInit{
  lat: number = 23.022505;
  lng: number = 72.571362;

  //--Initialization of 'global' variables--//
  homeInfo:HomeInformation[] = [];
  markerPositions:google.maps.LatLngLiteral[] = [];

  //-- constructor allows reference of other files' functions/exported classes --//
  //-- functional part of constructor happens only when component initializes or is called upon --//
  constructor(private _data: HomeInfoService)

  //--Get the markers from storage, and assign them to variables--//
  {
    this.homeInfo = this._data.getMarkers(); //Move markers from storage to homeInfo variable
    if(this.homeInfo.length > 0){                     //Takes each data set and saves its location in the markerPositions array
      this.homeInfo.forEach((entries,ind,arr) =>{     //-With the indexes corresponding to what they are in homeInfo
        this.markerPositions[ind] = entries.location; //Should populate markerPositions with latlngliteral
      });
    }
    else{ //If homeInfo is empty, make sure the markerPositions are empty
      this.markerPositions = [];
    }
    //- Make sure deleted markers are deleted in the variables as well -//
    if(this.markerPositions.length > this.homeInfo.length) this.markerPositions.pop();
  }

  ngOnInit(): void {}

  markpos: google.maps.LatLngLiteral = {lat: 0, lng: 0}; //Placeholder lat and lng
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;
  @ViewChild(HomeInfoComponent) homeWindow: HomeInfoComponent | undefined;

  //--Web page info and google options--//
  title = 'AngularGoogleMap';
  display: any;
  center: google.maps.LatLngLiteral = {lat: 24, lng: 12}; //Map's default starting position
  zoom = 4;
  markerOptions: google.maps.MarkerOptions = {
    draggable: false
  };

  /**
   * Whenever the markers need to be updated on the map, use this.
   * ----
   * Reads each HomeInformation object in an array and extracts the location from each for placement on the map
   * @param inf Stands for Info: Accepts an array of HomeInformation (HomeInformation[])
   */
  markersFromInfo(inf: HomeInformation[]){ //inf is short for info, not infinity
    if(inf.length > 0){
      inf.forEach((entry,ind,arr)=>{
        this.markerPositions[ind] = entry.location;
      });
    }
    else{
      this.markerPositions = [];
    }
    if(this.markerPositions.length > inf.length){
      this.markerPositions.pop();
    }
  }
  /**
   * For use in the corresponding html file
   * ----
   * Adds and saves a new marker with placeholder data at the spot that was clicked
   * @param event Comes from (mapClick) property of the <google-map> class.
   */
  newMarker(event: google.maps.MapMouseEvent){
    if(event.latLng != null){
    this._data.addMarker(event.latLng.toJSON());   //Save the marker with the location of the click
    this.markersFromInfo(this._data.getMarkers()); //Update the markers
    }
  }
  /**
   * Deletes the marker at the given location
   * @param m The location of the marker to be deleted
   */
  onDelete(m: google.maps.LatLngLiteral){
    var pos = this.markerPositions.indexOf(m);
    this._data.removeMarker(pos);
    this.markersFromInfo(this._data.getMarkers()); //Preferentially keeping session and storage data in sync
  }
  /**
   * Used solely to update home-info.component.html after form submission
   */
  passMarks(){
    this.markersFromInfo(this._data.getMarkers());
  }
  /**
   * Opens the information window of the marker, and passes the index of the marker along to home-info.service.ts
   * @param mark MapMarker object, passed along from app.component.html as a property of the <map-marker> tag
   * @param m Location of the marker in latitude and longitude
   */
  openInfoWindow(mark: MapMarker, m: google.maps.LatLngLiteral){ 
    this.markpos = m; //Gets passed to the map-info-window so the right one is deleted
    var tempInfo = this.markerPositions.indexOf(m);
    this._data.passMarkerData(tempInfo); //Pass data to home-info.service.ts for use in home-info.component.ts
    if(this.infoWindow != undefined) this.infoWindow.open(mark);
  }

  /**
   * Centers the map on the location that was clicked
   * @param event Data sent from user clicking the map
   */
  moveMap(event: google.maps.MapMouseEvent){
    if(event.latLng != null) this.center = (event.latLng.toJSON());
  }

  /**
   * Moves the map corresponding to a click and drag
   * @param event Data sent from user interacting with the map
   */
  move(event: google.maps.MapMouseEvent){
    if(event.latLng != null) this.display = event.latLng.toJSON();
  }
}
