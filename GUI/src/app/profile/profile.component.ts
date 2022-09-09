import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {UserComment} from "../models/user-comment";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../_services/user.service";
import {TokenStorageService} from "../_services/token-storage.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  commentField = document.getElementById('comment');

  zoom = 15;
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: true,
    disableDefaultUI: false,
    fullscreenControl: true,
    mapTypeId: 'hybrid',
  };
  geocoder = new google.maps.Geocoder();

  userData: any = {
    username: null,
    email: null,
    firstName: null,
    lastName: null,
    dob: null,
    city: null,
    coords: null,
    profilePicturePath: null,
  };

  id: number;

  userComments = [];
  commentInput = '';
  profileOwner: boolean;
  commentErrorVisible = false;

  constructor(private route: ActivatedRoute, private userService: UserService, private tokenStorageService: TokenStorageService, private router: Router) {
  }

  ngOnInit(): void {
    //todo? jakaś notyfkiacja w przypadku błędu
    this.route.params.subscribe(params => {
      this.id = +params['id'];

      this.getProfileData(this.id);
      this.getProfileComments(this.id);
      this.isUserProfileOwner();
    });
  }

  isUserProfileOwner() {
    this.profileOwner = this.id === this.tokenStorageService.getUserId();
  }

  getProfileData(profileId: number) {
    this.userService.getProfile(profileId).subscribe(userData => {
      this.userData.email = userData.email;
      this.userData.username = userData.username;
      this.userData.firstName = userData.first_name;
      this.userData.lastName = userData.last_name;
      this.userData.dob = new FormControl(new Date(userData.age));
      this.userData.profilePicturePath = '../../assets/' + userData.profile_picture;
      this.userData.city = userData.city;

      this.geocoder.geocode({'address': this.userData.city}, function (results, status) {
        if (status == 'OK') {
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      }).then((result) => {
        const {results} = result;
        this.userData.coords = new google.maps.LatLng(results[0].geometry.location);
      });
    });
  }

  getProfileComments(profileId: number) {
    this.userComments = [];
    this.userService.getProfileComments(profileId).subscribe(comments => {
      comments.forEach(comment => {
        // todo nick usera
        this.userComments.push(new UserComment(comment.id, comment.writer_id, comment.text, new Date(comment.created_at)));
      })
    });
  }

  saveComment(comment: string): void {
    if (comment === '') {
      this.commentErrorVisible = true;
    } else {
      this.commentErrorVisible = false;
      this.userService.saveProfileComments(this.tokenStorageService.getUserId(), comment).subscribe(value => {
        this.getProfileComments(this.id);
      });
      this.commentInput = '';
    }
  }

  editEvent() {
    this.router.navigateByUrl(`/profile/${this.id}/edit`);
  }
}
