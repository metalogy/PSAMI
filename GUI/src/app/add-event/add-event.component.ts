import {Component, OnInit} from '@angular/core';
import {EventService} from "../_services/event.service";

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {

  eventData: any = {
    eventName: null,
    description: null,
    date: null,
    status: null, //enum todo?
    city: "London", //todo koordynaty?, geolokator na BE działa chujowo
    address: null,
    isPrivate: false,
    isReserved: false,
    minUsers: null,
    maxUsers: null,
    suggestedAge: null,
    photo: null
  };

  isSuccessful = false;
  isAddingEventFailed = false;
  errorMessage = '';

  constructor(private eventService: EventService) {
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.eventService.addEvent(this.eventData).subscribe({
      next: data => {
        this.isSuccessful = true;
        this.isAddingEventFailed = false;
        //todo redirect
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isAddingEventFailed = true;
      }
    });
  }

  handleFileInput(event) {
    this.getBase64(event);
  }

  getBase64(event) {
    let me = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      me.eventData.photo = reader.result;
      console.log(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }
}
