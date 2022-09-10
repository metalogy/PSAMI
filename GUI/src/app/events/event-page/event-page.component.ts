import {Component, OnInit} from '@angular/core';
import {EventService} from "../../_services/event.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Comment} from "../../models/comment";
import {User} from "../../models/user";
import {TokenStorageService} from "../../_services/token-storage.service";
import {Observable} from 'rxjs';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css']
})
export class EventPageComponent implements OnInit {
  private eventId: number;

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
    status: null,
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
  userId: number;

  public displayedColumns = ['index', 'username', 'firstName', 'lastName', 'dob'];

  constructor(private route: ActivatedRoute, private eventService: EventService, private tokenStorageService: TokenStorageService, private router: Router) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventId = +params['id'];
      this.getEventData(this.eventId);
      this.getEventComments(this.eventId);
      this.getParticipants(this.eventId);
      this.userId = this.tokenStorageService.getUserId();
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
        this.eventComments.push(new Comment(comment.id, comment.writer_id, comment.text, new Date(comment.created_at), comment.rating));
      })
    });
  }

  saveComment(comment: string, rating: string): void {
    if (comment === '') {
      this.commentErrorVisible = true;
    } else {
      this.commentErrorVisible = false;
      this.eventService.saveEventComment(this.eventId, comment, rating).subscribe(value => {
        this.getEventComments(this.eventId);
      });
      this.commentInput = '';
    }
  }

  getParticipants(eventId: number) {
    this.eventService.getParticipants(eventId).subscribe(participants => {
      this.eventParticipants$ = participants;
      this.isUserParticipant = participants.filter(participant => participant.eventId === this.tokenStorageService.getUserId()).length > 0 ? true : false;
    });
  }

  isCreatorOfEvent() {
    this.isCreator = this.eventData.creatorId === this.tokenStorageService.getUserId() ? true : false;
  }

  joinEvent() {
    this.eventService.joinEvent(this.eventId).subscribe(response => {
      window.location.reload();
    })
  }

  leaveEvent() {
    this.eventService.leaveEvent(this.eventId).subscribe(response => {
      window.location.reload();
    })
  }

  deleteEvent() {
    if (confirm("Are you sure that, you want to delete this event?")) {
      this.eventService.deleteEvent(this.eventId).subscribe(response => {
        this.router.navigateByUrl("/events");
      })
    }
  }

  editEvent() {
    this.router.navigateByUrl(`/event/${this.eventId}/edit`);
  }

  deleteComment(commentId: number) {
    if (confirm("Are you sure that, you want to delete your comment?")) {
      this.eventService.deleteEventComment(commentId).subscribe(response => {
        window.location.reload();
      });
    }
  }

  isNumber(rating: number) {
    return !Number.isNaN(rating);
  }
}
