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

  constructor(private datePipe: DatePipe, private eventService: EventService) {
  }

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(): void {
    this.eventService.getEvents().subscribe(events => {
      this.events$ = events.filter(filteredEvent => filteredEvent.is_private === false); //todo?
    })
  }

  clearSearchbar() {
    this.eventName = '';
    this.eventDate = null;
  }

  searchEvents() {
    debugger;
    this.eventService.searchEvents(this.eventName, this.datePipe.transform(this.eventDate, "yyyy-MM-dd")).subscribe(events => {
      this.events$ = events.filter(filteredEvent => filteredEvent.is_private === false); //todo?
    })
  }
}
