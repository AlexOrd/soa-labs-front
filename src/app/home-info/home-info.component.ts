import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AppComponent } from '../app.component';
import { HomeInfoService, HomeInformation } from '../home-info.service';

@Component({
  selector: 'app-home-info',
  templateUrl: './home-info.component.html',
  styleUrls: ['./home-info.component.css']
})


//-- Contains everything relevant to home-info.component.html --//
export class HomeInfoComponent {

//--Initialization of 'global' variables--//
markerPositions2: google.maps.LatLngLiteral[] = [];  
homeinfo2: HomeInformation[] = [];

//--Grants the form functionality--//
  homeInfoForm = this.formBuilder.group({
    address: "",
    value: 0,
    description: ""
  });

  //-- @Input() allows these values to be referenced and used in home-info.component.html --//
  @Input() homeaddress: string[] = [];
  @Input() homevalue: number[] = [];
  @Input() homedescription: string[] = [];

  //-- constructor allows reference of other files' functions/exported classes --//
  //-- functional part of constructor happens only when component initializes or is called upon --//
  constructor(
    private route: ActivatedRoute,
    public homeInfoService: HomeInfoService,
    private formBuilder: FormBuilder,
    private appComponent: AppComponent
  ){
    //-- Get home information objects from storage, break it into appropriate arrays for ease of use --//
    this.homeinfo2 = this.homeInfoService.getMarkers();
    if(this.homeinfo2.length > 0){ //No point attempting the below code if there is no data
      this.homeinfo2.forEach((entries,ind,arr) =>{
        this.markerPositions2[ind] = entries.location; //should populate markerPositions with latlngliteral
        this.homeaddress.push(entries.address);
        this.homevalue.push(entries.value);
        this.homedescription.push(entries.description);
      });
    }
    else{ //If there is no data, make sure such is reflected in the 'global' variable
      this.markerPositions2 = [];
    }
    //- Make sure we only hold onto the markers that haven't been deleted -//
    if(this.markerPositions2.length > this.homeinfo2.length) this.markerPositions2.pop();
  }


  ngOnInit(): void{} //!--IMPORTANT: This happens upon loading the map, not selecting a marker--!//

  /**
   * Saves the data currently in the form, then clears the fields and refreshes the data
   * ----
   * If you want to make changes to the data structure, make sure to account for it here
   */
  onSubmit(): void{
    //--Get values from the form--//
    var addy = this.homeInfoForm.get('address')?.getRawValue().toString();
    var val = Number.parseInt(this.homeInfoForm.get('value')?.getRawValue());
    var desc = this.homeInfoForm.get('description')?.getRawValue().toString();

    //--Replace the current data for the marker with the values from the form--//
    this.homeinfo2[this.homeInfoService.markloc] = {
      location:this.appComponent.markpos,
      address:addy,
      value:val,
      description:desc
    };

    localStorage.setItem('info',JSON.stringify(this.homeinfo2));    //Save the array of home info
    this.homeInfoForm.setValue({address:'',value:0,description:""}) //Clear the fields of the form
    this.appComponent.infoWindow?.close();                          //Close the information window
    this.appComponent.passMarks();                                  //Gets information to update
  }
  /**
   * For use with the home-info-component.html, otherwise not very useful
   * ----
   * Invokes the onDelete() function in app.component.ts
   */
  onDelete2(): void{
    this.appComponent.onDelete(this.appComponent.markpos)
  }
}