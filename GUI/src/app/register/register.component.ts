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
  zoom = 15;
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
    age: null,
    city: null,
    avatar: null
  };

  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  startDate = new Date(1990, 1, 1); //todo
  showMarker = false;
  cityNotSelected = false;


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

        this.userData.city = place.address_components
          .filter(addressComponents => addressComponents.types.some(types => 'locality'.includes(types)) &&
            addressComponents.types.some(types => 'political'.includes(types)))
          .map(addressComponents => addressComponents.short_name)[0];

        if (place.geometry === undefined || place.geometry === null) {
          return;
        }

        this.coords = {
          lat: place.geometry.location?.lat()!,
          lng: place.geometry.location?.lng()!,
        };
        this.showMarker = true;
        this.cityNotSelected = false;
      });
    });
  }

  handleFileInput(event) {
    this.userData.avatar = event.target.files[0];
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
    if (this.userData.city) {
      let response = this.authService.register(this.userData)

      if (response.includes('User has been created!')) {
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        setTimeout(
          function () {
            window.location.href = "/login";
          }, 2500);
      } else {
        this.errorMessage = response;
        this.isSignUpFailed = true;
      }
    } else {
      this.cityNotSelected = true;
    }
  }
}
