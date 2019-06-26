import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {BsDropdownDirective} from 'ngx-bootstrap';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @ViewChildren('dropdown') dropdown: QueryList<BsDropdownDirective>;
  @ViewChildren('dropdownAdd') dropdownAdd: QueryList<BsDropdownDirective>;
  @ViewChildren('dropdownCondition') dropdownAddCondition: QueryList<BsDropdownDirective>;

  @Input() filter: Array<any>;
  @Output() query = new EventEmitter();
  operators = ['AND', 'OR'];
  filteredItems;
  selectedItem;
  focus = true;
  showFilters = true;
  searchInputModel = '';

  options = {
    string: ['is', 'is not', 'starts with', 'ends with', 'contains', 'do not contains'],
    number: ['greather than', 'less than', 'is', 'is not'],
    date: {
      relative: ['more than', 'exactly', 'less than'],
      absolute: ['after', 'on', 'before']
    },
    boolean: ['is true', 'is false'],
    option: ['is', 'is not']
  };

  form: FormGroup;

  constructor() {
  }

  ngOnInit() {
    this.initFormGroup();
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

  initFormGroup() {
    this.form = new FormGroup({
      operator: new FormControl('AND'),
      groups: new FormArray([])
    });
  }

  createGroup(operator: string, condition): FormGroup {
    return new FormGroup({
      operator: new FormControl(operator),
      conditions: new FormArray([this.createCondition(condition)])
    });
  }

  createCondition(condition): FormGroup {
    return new FormGroup({
      fieldName: new FormControl(condition.fieldName),
      field: new FormControl(condition.name),
      fieldType: new FormControl(condition.fieldType),
      operator: new FormControl(condition.fieldType === 'option' ? 'is' : ''),
      value: new FormControl('',
        condition.fieldType === 'number' ? [Validators.pattern('^[0-9]*$'), Validators.required]
          : null),
      icon: new FormControl(condition.icon),
      options: new FormControl(condition.options ? condition.options : ''),
      eventField: new FormControl(condition.eventField ? condition.eventField : '')
    });
  }

  addFilter(item?, value?) {
    if (!item) {
      return;
    }
    if (value) {
      item.eventField = value;
    }
    this.selectedItem = item;
    if (!this.showFilters) {
      this.showFilters = true;
    }
    if (this.selectedItem) {
      setTimeout(() => this.dropdown.last.show(), 100);
      const control = this.form.get('groups') as FormArray;
      control.push(this.createGroup('AND', this.selectedItem));
      this.filteredItems.forEach(x => {
        x.isSelected = false;
      });
      this.selectedItem = null;
      this.dropdownAdd.last.hide();
    }
    this.searchInputModel = '';
    this.assignCopy();
    setTimeout(() => this.form.updateValueAndValidity());
  }

  addCondition(indexGroup, item, type?, value?) {
    if (!item) {
      return;
    }
    if (value) {
      item.eventField = value;
    }
    this.selectedItem = item;
    if (this.selectedItem) {
      setTimeout(() => this.dropdown.last.show(), 100);
      const groupArray = this.form.controls.groups as FormArray;
      const group = groupArray.at(indexGroup) as FormGroup;
      const conditions = group.controls.conditions as FormArray;
      conditions.push(this.createCondition(this.selectedItem));
      this.filteredItems.forEach(x => {
        x.isSelected = false;
      });
      this.selectedItem = null;
      this.dropdownAddCondition.last.hide();
    }
    this.searchInputModel = '';
    this.assignCopy();
    setTimeout(() => this.form.updateValueAndValidity());
  }

  setValidators(indexGroup, indexCondition, type) {
    const groupArray = this.form.controls.groups as FormArray;
    const group = groupArray.at(indexGroup) as FormGroup;
    const conditions = group.controls.conditions as FormArray;
    const control = conditions.at(indexCondition).get('value');
    control.clearValidators();
    if (type === 'number') {
      control.setValidators([Validators.required, Validators.pattern('^[0-9]*$')]);
      control.updateValueAndValidity();
    } else {
      control.setValidators(Validators.required);
      control.updateValueAndValidity();
    }
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

  removeCondition(indexGroup, indexCcndition) {
    const groupArray = this.form.controls.groups as FormArray;
    const group = groupArray.at(indexGroup) as FormGroup;
    const conditions = group.controls.conditions as FormArray;

    conditions.removeAt(indexCcndition);
    if (conditions.length === 0) {
      groupArray.removeAt(indexGroup);
    }
    this.sendQuery();
  }

  trackByFn(index, item) {
    if (!item) {
      return null;
    }
    return index;
  }

  sendQuery() {
    const queryObject = Object.assign({}, {...this.form.value});
    this.query.emit(queryObject);
  }

  onShownAddGroupDropdown() {
    this.focus = true;
    setTimeout(() => this.focus = false);
  }

  onShownSelectConditionDropdown(indexGroup, indexCondition) {
    const groupArray = this.form.controls.groups as FormArray;
    const group = groupArray.at(indexGroup) as FormGroup;
    const conditions = group.controls.conditions as FormArray;
    const currentCondition = conditions.at(indexCondition) as FormGroup;
    switch (currentCondition.get('fieldType').value) {
      case 'string':
        currentCondition.get('operator').patchValue(this.options.string[0]);
        currentCondition.get('value').setValidators(Validators.required);
        break;
      case 'number':
        currentCondition.get('operator').patchValue(this.options.string[0]);
        break;
      case 'option':
        currentCondition.get('value').patchValue(currentCondition.get('options').value[0]);
        break;
      case 'boolean':
        currentCondition.get('operator').patchValue(this.options.boolean[0]);
        currentCondition.get('value').patchValue(' ');
        break;
      case 'date':
        currentCondition.get('operator').patchValue(this.options.date.relative[0]);
        currentCondition.get('value').setValidators(Validators.required);
        break;
      case 'event':
        if (currentCondition.get('eventField').value !== 'Count') {
          currentCondition.get('operator').patchValue(this.options.date.relative[0]);
        } else {
          currentCondition.get('operator').patchValue(this.options.number[0]);
        }
        currentCondition.get('value').setValidators(Validators.required);
        break;
    }

    this.focus = true;
    setTimeout(() => this.focus = false);
  }

  onShownAddConditionDropdown() {
    this.focus = true;
    setTimeout(() => this.focus = false);
  }
}
