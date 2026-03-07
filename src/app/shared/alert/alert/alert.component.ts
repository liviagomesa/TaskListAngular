import { Component, Input, OnInit } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

	@Input() message = '';
  @Input() type = 'info';

	ngOnInit(): void {
    timer(5000).subscribe(() => {
      this.message = '';
    });
	}

}
