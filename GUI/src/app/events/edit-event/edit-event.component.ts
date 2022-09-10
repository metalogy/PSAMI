import {Component, OnInit} from '@angular/core';
import {EventService} from "../../_services/event.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TokenStorageService} from "../../_services/token-storage.service";

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {
  private id: number;

  eventData: any = {
    eventName: null,
    description: null,
    date: null,
    status: null,
    city: null,
    address: null,
    isPrivate: false,
    isReserved: false,
    minUsers: null,
    maxUsers: null,
    suggestedAge: null,
    photo: null,
    creatorId: null
  };

  isSuccessful = false;
  isEditingEventFailed = false;
  errorMessage = '';
  isDateNull = false;

  constructor(private route: ActivatedRoute, private eventService: EventService, private router: Router, private tokenStorageService: TokenStorageService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.getEventData(this.id);
    });
  }


  getEventData(eventId: number) {
    this.eventService.getEvent(eventId).subscribe(eventData => {
      this.eventData.creatorId = eventData.user_id;
      this.eventData.eventName = eventData.name;
      this.eventData.description = eventData.description;
      this.eventData.isReserved = eventData.is_reserved;
      this.eventData.isPrivate = eventData.is_private;
      this.eventData.suggestedAge = eventData.suggested_age;
      this.eventData.minUsers = eventData.min_users;
      this.eventData.maxUsers = eventData.max_users;
      this.eventData.date = eventData.date;
      this.eventData.city = eventData.city;
      this.eventData.address = eventData.address;

      if (!this.isCreatorOfEvent()) {
        window.location.href = "/notallowed";
      }
    });
  }


  isCreatorOfEvent(): boolean {
    return this.eventData.creatorId === this.tokenStorageService.getUserId() ? true : false;
  }

  handleFileInput(event) {
    this.eventData.photo = event.target.files[0];
  }

  updateEventData() {
    this.eventService.editEvent(this.id, this.eventData).subscribe({
      next: data => {
        this.isSuccessful = true;
        this.isEditingEventFailed = false;
        setTimeout(
          function () {
            window.location.href = "/events";
          }, 2500);
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isEditingEventFailed = true;
      }
    });
  }

  updateEventDataAndPhoto() {
    let photo_response = this.eventService.updateEventPhoto(this.id, this.eventData.photo);
    if (photo_response.includes('created_at')) {
      this.updateEventData()
    } else {
      this.errorMessage = photo_response;
      this.isEditingEventFailed = true;
    }
  }

  onSubmit() {
    if (this.eventData.date === null || this.eventData.date === '') {
      this.isDateNull = true;
    } else {
      this.isDateNull = false;
      if (this.eventData.photo) {
        this.updateEventDataAndPhoto();
      } else {
        this.updateEventData();
      }
    }
  }

  cancelEdit() {
    this.router.navigateByUrl(`/event/${this.id}`);
  }
}

