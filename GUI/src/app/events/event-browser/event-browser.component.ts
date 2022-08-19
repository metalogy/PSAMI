import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {User} from "../../models/user";
import {EventService} from "../../_services/event.service";

@Component({
  selector: 'app-event-browser',
  templateUrl: './event-browser.component.html',
  styleUrls: ['./event-browser.component.css']
})
export class EventBrowserComponent implements OnInit {

  events$: Observable<Event>[] = [];

  public displayedColumns = ['index', 'eventName', 'eventDate', 'eventCity', 'suggestedAge', 'minUsers', 'maxUsers'];

  constructor(private eventService: EventService) {
  }

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(): void {
    this.eventService.getEvents().subscribe(events => {
      this.events$ = events.filter(filteredEvent => filteredEvent.is_private === false); //todo?
    })
  }

}
