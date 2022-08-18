import {Component, OnInit} from '@angular/core';
import {EventService} from "../../_services/event.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserComment} from "../../profile/user-comment";
import {User} from "../../_helpers/user";
import {TokenStorageService} from "../../_services/token-storage.service";

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css']
})
export class EventPageComponent implements OnInit {
  private id: number;

  zoom = 20;
  coords!: google.maps.LatLngLiteral;
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
    city: null, //todo koordynaty?, geolokator na BE działa chujowo
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

  eventParticipants = [];
  isParticipant = false;
  isCreator = null;

  constructor(private route: ActivatedRoute, private eventService: EventService, private tokenStorageService: TokenStorageService, private router: Router) {
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
      this.eventData.photo = eventData.event_picture;
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

      this.isCreatorOfEvent();
    });
  }

  getEventComments(eventId: number) {
    this.eventComments = [];
    this.eventService.getEventComments(eventId).subscribe(comments => {
      comments.forEach(comment => {
        this.eventComments.push(new UserComment(comment.writer_id, comment.text, new Date(comment.created_at)));
      })
    });
  }

  saveComment(comment: string): void {
    this.eventService.saveEventComment(this.id, comment).subscribe(value => {
      this.getEventComments(this.id);
    });
    this.commentInput = '';
  }

  getParticipants(eventId: number) {
    this.eventService.getParticipants(eventId).subscribe(participants => {
      participants.forEach(participant => {
        this.eventParticipants.push(new User(participant.id, participant.first_name, participant.last_name, participant.age, participant.city))
        this.isParticipant = participant.id === this.tokenStorageService.getUserId() ? true : this.isParticipant;
      })
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
      this.router.navigateByUrl("/home"); //todo
    })
  }

}
