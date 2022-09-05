import {Component, OnInit} from '@angular/core';
import {EventService} from "../../_services/event.service";
import {ActivatedRoute, Router} from "@angular/router";

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
    status: null, //enum todo?
    city: null, //todo!!!!
    address: null,
    isPrivate: false,
    isReserved: false,
    minUsers: null,
    maxUsers: null,
    suggestedAge: null,
    photo: null
  };

  isSuccessful = false;
  isEditingEventFailed = false;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private eventService: EventService, private router: Router) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.getEventData(this.id);
    });
  }

  getEventData(eventId: number) {
    this.eventService.getEvent(eventId).subscribe(eventData => {
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
    });
  }

  onSubmit() {
    this.eventService.editEvent(this.id, this.eventData).subscribe({
      next: data => {
        this.isSuccessful = true;
        this.isEditingEventFailed = false;
        //todo redirect
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isEditingEventFailed = true;
      }
    });
  }

  cancelEdit() {
    this.router.navigateByUrl(`/event/${this.id}`);
  }
}

