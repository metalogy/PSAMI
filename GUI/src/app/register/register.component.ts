//todo informacja o błędym wprowadzeniu daty
//todo potwierdzenie hasła
//todo formaty plików
import {AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../_services/auth.service';

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
    email: null,
    password: null,
    firstName: null,
    lastName: null,
  };

  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  dob: Date | undefined;
  photo: File;


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
    this.photo = <File>event.target.files[0];
  }

  onSubmit(): void {
    this.authService.register(this.userData.username, this.userData.email, this.userData.password, this.userData.firstName, this.userData.lastName,
      this.dob.toDateString(), this.photo, this.coords).subscribe({
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
