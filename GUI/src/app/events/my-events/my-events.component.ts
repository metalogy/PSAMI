import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {DatePipe} from "@angular/common";
import {EventService} from "../../_services/event.service";
import {TokenStorageService} from "../../_services/token-storage.service";

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {

  events$: Observable<Event>[] = [];

  public displayedColumns = ['index', 'eventName', 'eventDate', 'eventCity', 'suggestedAge', 'minUsers', 'maxUsers'];

  eventName = '';
  eventDate = null;
  showOutdatedEvents = false;

  constructor(private datePipe: DatePipe, private eventService: EventService, private tokenStorageService: TokenStorageService) {
  }

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(): void {
    if (this.showOutdatedEvents) {
      this.eventService.getEvents().subscribe(events => {
        this.events$ = events.filter(filteredEvent =>
          filteredEvent.is_private === false &&
          filteredEvent.user_id === this.tokenStorageService.getUserId()
        );
      })
    } else {
      this.eventService.getEvents().subscribe(events => {
        this.events$ = events.filter(filteredEvent =>
          filteredEvent.is_private === false && this.isEventDateFuture(filteredEvent.date)
          && filteredEvent.user_id === this.tokenStorageService.getUserId()
        );
      })
    }
  }

  isEventDateFuture(eventDateString: string) {
    let eventDate = new Date(eventDateString);
    eventDate.setHours(0, 0, 0);

    let currentDate = new Date();
    currentDate.setHours(0, 0, 0);
    return eventDate >= currentDate;
  }

  clearSearchbar() {
    this.eventName = '';
    this.eventDate = null;
  }

  searchEvents() {
    if (this.showOutdatedEvents) {
      this.eventService.searchEvents(this.eventName, this.datePipe.transform(this.eventDate, "yyyy-MM-dd")).subscribe(events => {
        this.events$ = events.filter(filteredEvent => filteredEvent.is_private === false && filteredEvent.user_id === this.tokenStorageService.getUserId()
        );
      })
    } else {
      this.eventService.searchEvents(this.eventName, this.datePipe.transform(this.eventDate, "yyyy-MM-dd")).subscribe(events => {
        this.events$ = events.filter(filteredEvent => filteredEvent.is_private === false && this.isEventDateFuture(filteredEvent.date) && filteredEvent.user_id === this.tokenStorageService.getUserId()
        );
      })
    }
  }
}
