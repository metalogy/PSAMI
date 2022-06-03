import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css']
})
export class BoardUserComponent implements OnInit {

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
    username: "metalogy",
    email: "jp1000@wp.pl",
    firstName: "Karol", //todo bardziej sensownym wydaje się umieszcenie imienia i nazwiska jako jedność
    lastName: "Wojtyła",
    dob: new FormControl(new Date(1999, 5, 12)),
    coords: null,
    photo: " null",
  };

  constructor() {
  }

  ngOnInit(): void {
  }

}
