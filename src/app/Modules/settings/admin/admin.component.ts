/*
 * SPDX-FileCopyrightText: 2021-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
// import { trigger, style, animate, transition } from '@angular/animations';

import { MatDialog } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import { User } from '../../../models/user.model';
import { City } from '../../../models/city.model';
import { UserService } from '../../../services/user.service';
import { RemoveUserComponent } from '../dialogs/remove-user/remove-user.component';
import { DeleteUserComponent } from '../dialogs/delete-user/delete-user.component';
import { AuditUserComponent } from '../dialogs/audit-user/audit-user.component';

export interface Task {
  name: string;
  completed: boolean;
}
interface Permission {
  viewValue: string;
}
@Component({
  selector: 'aep-admin',
  templateUrl: './admin.component.html',
  animations: [],
  styles: [],
})
export class AdminComponent implements OnInit {
  constructor(public userService: UserService, public dialog: MatDialog) {}

  // Boolean Triggers
  AddNew: boolean = false;
  EditUser: boolean = false;
  userViewToggle: boolean = true;
  siteViewToggle: boolean = false;
  allComplete: boolean = false;
  editMode: boolean = false;
  doneActive: boolean = false;

  // Checkbox Triggers
  checked = false;

  // variables
  id: number;
  toggle;
  editObject;
  siteViewStyle: string = 'false';
  userViewStyle: string = 'true';

  // Arrays and Subscription
  users: User[] = [];
  cities: City[] = [];
  editUsers: number[] = [];
  editCities: number[] = [];
  subscription: Subscription;
  citySubscription: Subscription;

  // Image variables
  fileUrl: string | ArrayBuffer = '';
  imageLoaded: boolean = false;
  addUserError: boolean = false;
  editUserError: boolean = false;

  ngOnInit(): void {
    // subscriptions
    this.subscription = this.userService.usersSubject.subscribe(
      (users: User[]) => {
        this.users = users;
      }
    );

    this.citySubscription = this.userService.citiesSubject.subscribe(
      (cities: City[]) => {
        this.cities = cities;
      }
    );

    // functions on Init
    this.addNewForm();
    this.assignUsersCities();
    this.assignCitiesUsers();
    this.setUpCities();
    this.setUpEditedCities();
    //console.log(this.doneActive);
  }

  task: Task = {
    name: 'Select Alert Categories',
    completed: false,
  };

  // Permissions array (Select, R, W, R/W)
  permissions: Permission[] = [
    { viewValue: 'Select' },
    { viewValue: 'R' },
    { viewValue: 'W' },
    { viewValue: 'R/W' },
  ];

  // formGroups
  userForm = new FormGroup({});

  userControls;

  userFormSubmit = false;

  editForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    emailAlert: new FormControl(''),
    deviceAlert: new FormControl(''),
    centralAlert: new FormControl(''),
    siteEquipmentAlert: new FormControl(''),
    securityAlert: new FormControl(''),
    cities: new FormArray([]),
  });

  editFormControl1 = this.editForm.controls;

  editFormSubmit = false;

  editControls;

  // Toggling userView and SiteView
  userView(): void {
    this.userViewToggle = true;
    this.siteViewToggle = false;
    this.userViewStyle = 'true';
    this.siteViewStyle = 'false';
  }

  siteView(): void {
    this.siteViewToggle = true;
    this.userViewToggle = false;
    this.siteViewStyle = 'true';
    this.userViewStyle = 'false';
  }

  isCitiesValid(cities: number[]): boolean {
    return !(cities.includes(1) || cities.includes(2) || cities.includes(3));
  }

  // functions
  assignUsersCities(): void {
    this.users = this.users.map((user) => {
      const cities1 = [];
      this.cities.forEach((city) => {
        const index = city.users.findIndex(
          (userCity) => user.id === userCity.userId
        );
        if (index >= 0) {
          cities1.push({
            cityId: city.id,
            name: city.name,
            accessLevel: city.users[index].accessLevel,
          });
        }
      });
      user.cities = cities1;
      user.form = new FormGroup({});
      return user;
    });
  }

  fileTrigger(event: Event): void {
    const file = (<HTMLInputElement>event.target).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.fileUrl = reader.result;
      this.userForm.patchValue({ profilePic: reader.result });
      // console.log(this.fileUrl);
      this.imageLoaded = true;
    };
    reader.readAsDataURL(file);
  }

  assignCitiesUsers(): void {
    this.cities = this.cities.map((city) => {
      city.users = city.users.map((user) => {
        const userIndex = this.users.findIndex(
          (cityUser) => cityUser.id === user.userId
        );
        user.details = this.users[userIndex];
        return user;
      });
      return city;
    });
  }

  // for userView edit
  toggleEdit(id: number, index: number): void {
    this.AddNew = false;
    const editIndex = this.editUsers.indexOf(id);
    if (editIndex >= 0) {
      this.editUsers.splice(editIndex, 1);
    } else {
      const cities = new FormArray([]);
      for (let i = 0; i < this.cities.length; i++) {
        const cityIndex = this.users[index].cities.findIndex(
          (city) => city.cityId === this.cities[i].id
        );
        cities.push(
          new FormControl(
            cityIndex >= 0 ? this.users[index].cities[cityIndex].accessLevel : 0
          )
        );
      }
      this.users[index].form = new FormGroup({
        ppic: new FormControl(this.users[index].ppic),
        name: new FormControl(this.users[index].name, Validators.required),
        email: new FormControl(this.users[index].email, [
          Validators.required,
          Validators.email,
        ]),
        emailAlert: new FormControl(this.users[index].emailAlert),
        deviceAlert: new FormControl(this.users[index].deviceAlert),
        centralAlert: new FormControl(this.users[index].centralAlert),
        siteEquipmentAlert: new FormControl(
          this.users[index].siteEquipmentAlert
        ),
        securityAlert: new FormControl(this.users[index].securityAlert),
        cities: cities,
      });
      console.log(this.users[index]);
      const editControls = this.users[index].form.controls;
      this.editControls = editControls;
      // console.log(this.users[index].form);
      this.editUsers.push(id);
    }
  }

  closeUserViewEdit(): void {
    this.editUsers.pop();
  }

  // for siteView edit
  toggleEdit1(id: number): void {
    this.closeSiteViewEdit();
    this.doneActive = false;
    const editCityIndex = this.editCities.indexOf(id);
    if (editCityIndex >= 0) {
      this.editCities.splice(editCityIndex, 1);
    } else {
      this.editCities.push(id);
    }
  }

  closeSiteViewEdit(): void {
    this.editCities.pop();
  }

  getEditControl(editForm: FormGroup, param: string): FormControl {
    return editForm.get(param) as FormControl;
  }

  getCitiesControl(cityIndex: number, formGroup: FormGroup): FormControl {
    const cities = formGroup.get('cities') as FormArray;
    const control = cities.controls[cityIndex] as FormControl;
    return control;
  }

  setUpCities(): void {
    const cities = this.userForm.get('cities') as FormArray;
    for (let i = 0; i < this.cities.length; i++) {
      cities.push(new FormControl(0));
    }
  }

  addNewForm(): void {
    this.userForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      emailAlert: new FormControl(false),
      deviceAlert: new FormControl(false),
      centralAlert: new FormControl(false),
      siteEquipmentAlert: new FormControl(false),
      securityAlert: new FormControl(false),
      cities: new FormArray([]),
      profilePic: new FormControl(null, [Validators.required]),
    });
    this.setUpCities();
    this.userControls = this.userForm.controls;
  }

  addNewUser(): void {
    this.addUserError = false;
    this.addNewForm();
    this.AddNew = !this.AddNew;
  }

  onSubmit(): void {
    this.userFormSubmit = true;
    this.addUserError = false;
    const isCitySelected =
      this.userForm.value.cities.includes(1) ||
      this.userForm.value.cities.includes(2) ||
      this.userForm.value.cities.includes(3);
    /* istanbul ignore else*/
    if (this.userForm.invalid || !isCitySelected) {
      this.addUserError = true;
    }
    /* istanbul ignore else*/
    if (this.userForm.valid) {
      const id =
        this.users.length > 0 ? this.users[this.users.length - 1].id + 1 : 1;
      this.userService.addUser({
        id: id,
        ppic: this.fileUrl,
        active: this.userForm.value.active,
        name: this.userForm.value.name,
        email: this.userForm.value.email,
        cities: this.userForm.value.cities,
        emailAlert: this.userForm.value.emailAlert,
        deviceAlert: this.userForm.value.deviceAlert,
        siteEquipmentAlert: this.userForm.value.siteEquipmentAlert,
        centralAlert: this.userForm.value.centralAlert,
        securityAlert: this.userForm.value.securityAlert,
      });
      console.log(this.userForm);
      for (let i = 0; i < this.cities.length; i++) {
        // console.log('forloop');
        if (this.userForm.value.cities[i] > 0) {
          this.cities[i].users.push({
            userId: id,
            accessLevel: this.userForm.value.cities[i],
          });
        }
      }
      this.assignCitiesUsers();
      this.assignUsersCities();
      // this.userForm.reset();
      this.fileUrl = '';
      this.imageLoaded = false;
      this.AddNew = !this.AddNew;
    }
  }

  setUpEditedCities(): void {
    const cities = this.editForm.get('cities') as FormArray;
    for (let i = 0; i < this.cities.length; i++) {
      cities.push(new FormControl(0));
    }
    console.log(this.cities);
    console.log(this.users);
  }
  onEdit(index: number): void {
    const id = this.users[index].id;
    const form = this.users[index].form.value;
    const user = this.users[index];
    const isCitySelected =
      this.userForm.value.cities.includes(1) ||
      this.userForm.value.cities.includes(2) ||
      this.userForm.value.cities.includes(3);
    this.editFormSubmit = true;
    this.editUserError = false;
    /* istanbul ignore else*/
    if (this.users[index].form.invalid || !isCitySelected) {
      this.editUserError = true;
    }
    /* istanbul ignore else*/
    if (this.users[index].form.valid) {
      user.ppic = form.ppic;
      user.name = form.name;
      user.email = form.email;
      user.emailAlert = form.emailAlert;
      user.deviceAlert = form.deviceAlert;
      user.centralAlert = form.centralAlert;
      user.securityAlert = form.securityAlert;
      user.siteEquipmentAlert = form.siteEquipmentAlert;
      user.cities = [];
      for (let i = 0; i < this.cities.length; i++) {
        const userIndex = this.cities[i].users.findIndex(
          (cityUser) => cityUser.userId === id
        );
        const accessLevel = form.cities[i];
        if (userIndex >= 0) {
          if (accessLevel === 0) {
            this.cities[i].users.splice(userIndex, 1);
          } else {
            this.cities[i].users[userIndex].accessLevel = accessLevel;
          }
        } else if (accessLevel > 0) {
          this.cities[i].users.push({
            userId: user.id,
            accessLevel: accessLevel,
          });
        }
      }
      this.userService.updateUser(index, user);
      this.userService.updateCities(this.cities);
      this.assignUsersCities();
      this.assignCitiesUsers();
      this.toggleEdit(id, index);
    } else {
      return;
    }
    this.userService.updateUser(index, user);
    this.userService.updateCities(this.cities);
    this.assignUsersCities();
    this.assignCitiesUsers();
    this.toggleEdit(id, index);
  }

  editSubmit(userIndex: number): void {
    this.userService.updateUser(userIndex, this.userForm.value);
  }

  confirmDelete(userIndex: number): void {
    this.editObject = this.userService.deleteUser(userIndex);
  }

  confirmDelCity(cityIndex: number, userIndex: number): void {
    // this.editObject = this.userService.deleteUser(i);
    this.cities[cityIndex].users.splice(userIndex, 1);
    this.userService.updateCities(this.cities);
    this.assignCitiesUsers();
    this.assignUsersCities();
  }

  openRemoveUserDialog(cityIndex: number, userIndex: number): void {
    const dialogRef = this.dialog.open(RemoveUserComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      /* istanbul ignore else*/
      if (result == 'true') {
        this.confirmDelCity(cityIndex, userIndex);
      }
      /* istanbul ignore else*/
      if (result == 'true' && this.doneActive == false) {
        this.doneActive = true;
      }
    });
  }

  openDeleteUserDialog(userIndex: number): void {
    const dialogRef = this.dialog.open(DeleteUserComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      /* istanbul ignore else*/
      if (result == 'true') {
        this.confirmDelete(userIndex);
      }
      // this.closeEdit()
    });
  }

  openAuditUser(): void {
    const dialogRef = this.dialog.open(AuditUserComponent, {
      width: '80%',
      panelClass: 'audit-user-modal-container',
    });

    dialogRef.afterClosed().subscribe(() => {
      // console.log(`Dialog result: ${result}`);
    });
  }
}
