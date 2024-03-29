import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {EventService} from "../../_services/event.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-event-browser',
  templateUrl: './event-browser.component.html',
  styleUrls: ['./event-browser.component.css']
})
export class EventBrowserComponent implements OnInit {

  events$: Observable<Event>[] = [];

  public displayedColumns = ['index', 'eventName', 'eventDate', 'eventCity', 'suggestedAge', 'minUsers', 'maxUsers'];

  eventName = '';
  eventDate = null;
  showOutdatedEvents = false;

  constructor(private datePipe: DatePipe, private eventService: EventService) {
  }

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(): void {
    if (this.showOutdatedEvents) {
      this.eventService.getEvents().subscribe(events => {
        this.events$ = events.filter(filteredEvent =>
          filteredEvent.is_private === false
        );
      })
    } else {
      this.eventService.getEvents().subscribe(events => {
        this.events$ = events.filter(filteredEvent =>
          filteredEvent.is_private === false && this.isEventDateFuture(filteredEvent.date)
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
        this.events$ = events.filter(filteredEvent => filteredEvent.is_private === false);
      })
    } else {
      this.eventService.searchEvents(this.eventName, this.datePipe.transform(this.eventDate, "yyyy-MM-dd")).subscribe(events => {
        this.events$ = events.filter(filteredEvent => filteredEvent.is_private === false && this.isEventDateFuture(filteredEvent.date));
      })
    }
  }
}
