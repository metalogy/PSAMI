import {AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../_services/user.service";
import {AuthService} from "../../_services/auth.service";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit, AfterViewInit {

  @ViewChild('search')
  public searchElementRef!: ElementRef;

  @ViewChild('googleMap')
  public map!: google.maps.Map;
  zoom = 15;
  userCoords!: google.maps.LatLngLiteral;
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
  };

  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  showMarker = false;
  cityNotSelected = false;
  id: number;

  geocoder = new google.maps.Geocoder();

  constructor(private route: ActivatedRoute, private authService: AuthService, private ngZone: NgZone, private userService: UserService, private router: Router) {
  }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.getUserData(this.id);
    });
  }

  getUserData(id: number): void {
    this.userService.getProfile(id).subscribe(userData => {
      this.userData.username = userData.username;
      this.userData.first_name = userData.first_name;
      this.userData.last_name = userData.last_name;
      this.userData.email = userData.email;
      this.userData.password = userData.password;
      this.userData.age = userData.age;
    })
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

        this.userCoords = {
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

  updateUserData() {
    this.userService.updateProfile(this.id, this.userData).subscribe(response => {
      if (response.username) {
        this.isSuccessful = true; //todo redirect i logout
        this.isSignUpFailed = false;
      } else {
        this.errorMessage = response;
        this.isSignUpFailed = true;
      }
    });
  }

  updatePhotoAndUserData() {
    let photo_response = this.userService.updateProfilePhoto(this.userData.avatar);
    if (photo_response.includes('username')) {
      this.updateUserData();
    } else {
      this.errorMessage = photo_response;
      this.isSignUpFailed = true;
    }
  }

  onSubmit(): void {
    if (this.userData.city) {
      if (this.userData.avatar) {
        this.updatePhotoAndUserData();
      } else {
        this.updateUserData();
      }
    } else {
      this.cityNotSelected = true;
    }
  }

  cancelEdit() {
    this.router.navigateByUrl(`/profile/${this.id}`);
  }
}
