import {Component, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  // @ViewChild(dropdownAdd, {static: true})
  @Input() filter: Array<any>;
  filteredItems;
  items = [];
  query = {
    operator: '',
    groups: []
  };
  selectedItem;
  conditions;

  firstCondition = '';
  firstConditionGroup = '';
  numberOfConditionsGroup = [];

  constructor() {
  }

  ngOnInit() {
    console.log(this.filter);
    this.filter.forEach(x => {
        x.isSelected = false;
        switch (x.fieldType) {
          case 'string':
            x.icon = 'fa-pencil';
            break;
          case 'number':
            x.icon = 'fa-calculator';
            break;
          case 'date':
            x.icon = 'fa-calendar';
            break;
          case 'option':
            x.icon = 'fa-hand-o-right';
            break;
          case 'event':
            x.icon = 'fa-podcast';
            x.eventField = '';
            x.eventName = [
              {name: 'Count', eventField: 'Count'},
              {name: 'First Occurred', eventField: 'First Occurred'},
              {name: 'Last Occurred', eventField: 'Last Occurred'}
            ];
            break;
        }
      }
    );
    this.assignCopy();
  }

  addFilter() {
    console.log('Add filter');
    console.log(this.selectedItem);
    this.query.operator = this.firstCondition;
    this.query.groups.push({
      operator: '',
      conditions: [this.selectedItem]
    });
    console.log('Numero de grupos', this.query.groups.length);
    if (this.query.groups.length > 1) {
      this.numberOfConditionsGroup.push({operator: this.query.operator});
    }
    console.log('Numero de condiciones grupo: ', this.numberOfConditionsGroup);
    console.log('QUERY: ', this.query);
    this.items = this.query.groups;
    console.log('ITEMS: ', this.items);
  }

  addCondition(group) {
    console.log('Grupo', group);
    group.conditions.push(this.selectedItem);
    group.operator = this.firstConditionGroup;
    console.log('Query add condition: ', this.query);
  }

  assignCopy() {
    this.filteredItems = Object.assign([], this.filter);
  }

  filterItem(value) {
    if (!value) {
      this.assignCopy();
    } // when nothing has typed
    this.filteredItems = Object.assign([], this.filter).filter(
      item => item.fieldName.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
  }

  clearFocus(index) {
    this.filteredItems.forEach(x => {
      x.isSelected = false;
    });
    this.filteredItems[index].isSelected = true;
  }

  assignItem(item) {
    this.selectedItem = item;
  }

  onHidden(): void {
    console.log('Dropdown is hidden');
  }

  onShown(): void {
    console.log('Dropdown is shown');
  }

  isOpenChange(): void {
    console.log('Dropdown state is changed');
  }
}
