import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {UserComment} from "./user-comment";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../_services/user.service";
import {TokenStorageService} from "../_services/token-storage.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  commentField = document.getElementById('comment');

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
    firstName: null,
    lastName: null,
    dob: null,
    coords: null, //todo
    profilePicturePath: null,
  };

  id: number;

  userComments = [];
  commentInput = '';

  constructor(private route: ActivatedRoute, private userService: UserService, private tokenStorageService: TokenStorageService) {
  }

  ngOnInit(): void {
    //todo? jakaś notyfkiacja w przypadku błędu
    this.route.params.subscribe(params => {
      this.id = +params['id'];

      this.getProfileData(this.id);
      this.getProfileComments(this.id);
    });
  }

  getProfileData(profileId: number) {
    this.userService.getProfile(profileId).subscribe(userData => {
      this.userData.email = userData.email;
      this.userData.username = userData.username;
      this.userData.firstName = userData.first_name;
      this.userData.lastName = userData.last_name;
      this.userData.dob = new FormControl(new Date(userData.age));
      this.userData.profilePicturePath = '../../assets/' + userData.profile_picture;
    });
  }

  getProfileComments(profileId: number) {
    this.userComments = [];
    this.userService.getProfileComments(profileId).subscribe(comments => {
      comments.forEach(comment => {
        this.userComments.push(new UserComment(comment.writer_id, comment.text, new Date(comment.created_at)));
      })
    });
  }

  saveComment(comment: string): void {
    this.userService.saveProfileComments(this.tokenStorageService.getUserId(), comment).subscribe(value => {
      this.getProfileComments(this.id);
    });
    this.commentInput = '';
  }
}
