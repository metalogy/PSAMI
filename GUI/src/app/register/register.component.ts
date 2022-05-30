//todo informacja o błędym wprowadzeniu daty
//todo formaty plików
import {AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../_services/auth.service';
import {Validators} from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, AfterViewInit {

  @ViewChild('search')
  public searchElementRef!: ElementRef;

  @ViewChild('googleMap')
  public map!: google.maps.Map;
  zoom = 20;
  coords!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: true,
    disableDefaultUI: false,
    fullscreenControl: true,
    mapTypeId: 'hybrid',
  };

  userData: any = {
    username: null,
    first_name: null,
    last_name: null,
    email: null,
    password: null,
    age: "0",
    city: "dupa", //todo adjust
    //coords: null,
    avatar: null
  };

  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  startDate = new Date(1990, 1, 1);
  dob= this.startDate;


  constructor(private authService: AuthService, private ngZone: NgZone) {
  }

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
  }

  ngAfterViewInit(): void {
    let autocomplete = new google.maps.places.Autocomplete(
      this.searchElementRef.nativeElement
    );

    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(
      this.searchElementRef.nativeElement
    );

    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();

        if (place.geometry === undefined || place.geometry === null) {
          return;
        }

        this.coords = {
          lat: place.geometry.location?.lat()!,
          lng: place.geometry.location?.lng()!,
        };
      });
    });
  }

  mapClick($event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) {
    this.coords = {
      lat: $event.latLng?.lat()!,
      lng: $event.latLng?.lng()!
    };
  }

  handleFileInput(event) {
    this.getBase64(event);
  }

  getBase64(event) {
    let me = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      me.userData.avatar = reader.result;
      console.log(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  onSubmit(): void {
    //this.userData.coords = this.coords;
    this.authService.register(this.userData).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }

}
