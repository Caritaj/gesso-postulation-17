import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dialog-header',
  templateUrl: './dialog-header.component.html',
  styleUrl: './dialog-header.component.scss'
})
export class DialogHeaderComponent {

  @Input() title!: string;
  @Output() closeClick: EventEmitter<void> = new EventEmitter<void>();
  @HostBinding('style.display') display: string = 'block';
  @HostBinding('style.position') position: string = 'sticky';
  @HostBinding('style.top') top: string = '0';
  @HostBinding('style.zIndex') zIndex: string = '1';

}