import { Component, OnInit } from '@angular/core';
import { UserDetails } from 'src/app/modals/users.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userName: UserDetails = {
    userId: '',
    firstName: '',
    lastName: '',
    email: ''
  };
  constructor(private dataSvc: DataService) { }

  ngOnInit(): void {
    this.dataSvc.getAllUsers().subscribe({
      next: (data) => {
        console.log(data);
        this.userName.firstName = data.data[0].firstName;
        this.userName.lastName = data.data[0].lastName;
      },
      error: (e) => console.log('There is an error calling user api ', e)
    });


  }

}
