import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserManagementService } from './user-management.service';

@Component({
  selector: 'app-user-management',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzDatePickerModule
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  isVisible = false;
  isEdit = false;
  editId: number | null = null;
  userForm!: FormGroup;

  constructor(
    private userService: UserManagementService,
    private fb: FormBuilder,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      dateOfbirth: ['', [Validators.required]],
      gender: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data || [];
    });
  }

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  createMessage(type: string): void {
    switch (type) {
      case 'Success':
        this.message.create(type, `Created Data Admin Successfully`);
        break;
      default:
        this.message.create(type, `Data Admin Successfully Updated`);
        break;
    }
  }

  showModal(user?: any): void {
    this.isVisible = true;
    this.isEdit = !!user;
    this.editId = user.id
    this.userForm.reset();
    const patchUser = {
      ...user,
      dateOfbirth: new Date(user.dateOfbirth),
    };
    if (this.editId) {
      this.userForm.patchValue(patchUser);
    }
  }

  handleOk(): void {
    if (this.userForm.valid) {
      const user = {
        ...this.userForm.value,
        dateOfbirth: this.userForm.value.dateOfbirth.toISOString(),
      }
      if (this.isEdit) {
        const formValue = this.userForm.value;
        console.log(formValue)
        this.userService.updateUsers(this.editId, formValue).subscribe(() => {
          this.resetForm();
          this.loadUsers();
        })
        this.createMessage('Update');
      } else {
        this.userService.addUser(user).subscribe(() => {
          this.loadUsers()
          this.resetForm()
        })
        this.createMessage('Success');
      }
      this.isVisible = false;
    } else {
      Object.values(this.userForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  resetForm(): void {
    this.userForm.reset();
    this.isEdit = false;
    this.editId = null;
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe(() => {
      this.loadUsers();
    })
  }
}
