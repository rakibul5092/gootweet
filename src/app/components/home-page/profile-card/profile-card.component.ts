import { Component, Input, OnInit } from '@angular/core';
import { SendMessageService } from 'src/app/home-main/manufacturer/profile-test/send-message.service';
import { User } from 'src/app/models/user';
import { GotoProfileService } from 'src/app/services/goto-profile.service';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
})
export class ProfileCardComponent implements OnInit {
  @Input() me: User;
  @Input() profile: User
  constructor(private gotoProfileService: GotoProfileService, private sendMessageService: SendMessageService,

  ) { }

  ngOnInit() { }
  gotoProfile(owner: any) {
    this.gotoProfileService.gotoProfile(owner, true);
  }
  openMessage(event, profile: User) {
    event.stopPropagation();
    this.sendMessageService.sendMessage(this.me, profile);
  }

}
