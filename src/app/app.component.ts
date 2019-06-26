import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'filter';
  query;
  fields = [
    {name: 'name', fieldName: 'Name', fieldType: 'string'},
    {
      name: 'gender', fieldName: 'Gender', fieldType: 'option',
      options: ['male', 'female']
    },
    {name: 'birthdate', fieldName: 'Birthdate', fieldType: 'date'},
    {name: 'level', fieldName: 'Level', fieldType: 'number'},
    {name: 'premium', fieldName: 'Premium', fieldType: 'boolean'},
    {name: 'onLogin', fieldName: 'onLogin', fieldType: 'event'},
    {name: 'onLogon', fieldName: 'onLogon', fieldType: 'event'},
  ];

  showQuery(query) {
    this.query = query;
  }
}
