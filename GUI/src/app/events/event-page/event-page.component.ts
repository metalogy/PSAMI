import {Component, OnInit} from '@angular/core';
import {EventService} from "../../_services/event.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserComment} from "../../models/user-comment";
import {User} from "../../models/user";
import {TokenStorageService} from "../../_services/token-storage.service";
import {Observable} from 'rxjs';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css']
})
export class EventPageComponent implements OnInit {
  private id: number;

  zoom = 15;
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: true,
    disableDefaultUI: false,
    fullscreenControl: true,
    mapTypeId: 'hybrid',
  };

  eventData: any = {
    eventName: null,
    description: null,
    date: null,
    status: null, //enum todo?
    city: null,
    coords: null,
    address: null,
    isPrivate: false,
    isReserved: false,
    minUsers: null,
    maxUsers: null,
    suggestedAge: null,
    photo: null,
    createdAt: null,
    updatedAt: null,
    creatorId: null
  };

  eventComments = [];
  commentInput = '';
  commentRating = 'None';
  commentErrorVisible = false;

  eventParticipants$: Observable<User>[] = [];

  isUserParticipant = false;
  isCreator = null;

  public displayedColumns = ['index', 'username', 'firstName', 'lastName', 'dob'];

  constructor(private route: ActivatedRoute, private eventService: EventService, public tokenStorageService: TokenStorageService, private router: Router) {
  }

  ngOnInit(): void {
    //todo? jakaś notyfkiacja w przypadku błędu
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.getEventData(this.id);
      this.getEventComments(this.id);
      this.getParticipants(this.id);
    });
  }

  getEventData(eventId: number) {
    this.eventService.getEvent(eventId).subscribe(eventData => {
      this.eventData.eventName = eventData.name;
      this.eventData.eventPicturePath = '../../assets/' + eventData.event_picture;
      this.eventData.description = eventData.description;
      this.eventData.isReserved = eventData.is_reserved === true ? "Yes" : "No"
      this.eventData.isPrivate = eventData.is_private === true ? "Yes" : "No"
      this.eventData.suggestedAge = eventData.suggested_age;
      this.eventData.minUsers = eventData.min_users;
      this.eventData.maxUsers = eventData.max_users;
      this.eventData.date = new Date(eventData.date.replace('T', ' '));
      this.eventData.createdAt = new Date(eventData.created_at.replace('T', ' '));
      this.eventData.updatedAt = new Date(eventData.updated_at.replace('T', ' '));
      this.eventData.creatorId = eventData.user_id;
      this.eventData.coords = new google.maps.LatLng(parseFloat(eventData.latitude), parseFloat(eventData.longitude));
      this.eventData.city = eventData.city;
      this.eventData.address = eventData.address;

      this.isCreatorOfEvent();
    });
  }

  getEventComments(eventId: number) {
    this.eventComments = [];
    this.eventService.getEventComments(eventId).subscribe(comments => {
      comments.forEach(comment => {
        this.eventComments.push(new UserComment(comment.id, comment.writer_id, comment.text, new Date(comment.created_at)));
      })
    });
  }

  saveComment(comment: string, rating: string): void {
    if (comment === '') {
      this.commentErrorVisible = true;
    } else {
      this.commentErrorVisible = false;
      this.eventService.saveEventComment(this.id, comment, rating).subscribe(value => {
        this.getEventComments(this.id);
      });
      this.commentInput = '';
    }
  }

  getParticipants(eventId: number) {
    this.eventService.getParticipants(eventId).subscribe(participants => {
      this.eventParticipants$ = participants;
      this.isUserParticipant = participants.filter(participant => participant.id === this.tokenStorageService.getUserId()).length > 0 ? true : false;
    });
  }

  isCreatorOfEvent() {
    this.isCreator = this.eventData.creatorId === this.tokenStorageService.getUserId() ? true : false;
  }

  joinEvent() {
    this.eventService.joinEvent(this.id).subscribe(response => {
      window.location.reload();
    })
  }

  leaveEvent() {
    this.eventService.leaveEvent(this.id).subscribe(response => {
      window.location.reload();
    })
  }

  deleteEvent() {
    this.eventService.deleteEvent(this.id).subscribe(response => {
      this.router.navigateByUrl("/events");
    })
  }

  editEvent() {
    this.router.navigateByUrl(`/event/${this.id}/edit`);
  }

  deleteComment(commentId: number) {
    debugger;
    this.eventService.deleteEventComment(commentId).subscribe(response => {
      debugger;
      window.location.reload();
    });
  }

  isNumber(rating: number) {
    return !Number.isNaN(rating);
  }
}
