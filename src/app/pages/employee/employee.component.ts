import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { EmployeeService } from './employee.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-employee',
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
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent implements OnInit {
  users: any[] = [];
  isVisible = false;
  isEdit = false;
  editId = ''
  userForm!: FormGroup;

  constructor(
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.userForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      gender: [''],
      email: ['', [Validators.required, Validators.email]],
      password:['', [Validators.required]],
      phone:['', [Validators.required]],
      address:['', [Validators.required]],
    });
  }

  loadUsers(): void {
    this.employeeService.getEmployees().subscribe((data) => {
      this.users = data || [];
    });
  }

  showModal(user?: any): void {
    this.isVisible = true;
    this.isEdit = !!user;
    if (this.isEdit) {
      this.editId = user.id
    }
    this.userForm.reset();
    const patchEmployee = {
      ...user,
      dateOfbirth: new Date(user.dateOfbirth),
    };
    if (this.editId) {
      this.userForm.patchValue(patchEmployee);
    }
  }

  handleOk(): void {
    if (this.userForm.valid) {
      const user = {
        ...this.userForm.value,
      }
      if (this.isEdit) {
        const formValue = this.userForm.value;
        console.log(formValue)
        this.employeeService.updateEmployee(this.editId, formValue).subscribe(() => {
          this.resetForm();
          this.loadUsers();
        })
        this.createMessage('Update');
      } else {
        this.employeeService.addEmployee(user).subscribe(() => {
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

  handleCancel(): void {
    this.isVisible = false;
  }

  deleteUser(id: number): void {
    this.employeeService.deleteEmployee(id).subscribe(() => {
      this.loadUsers()
    })
  }

  resetForm(): void {
    this.userForm.reset();
    this.isEdit = false;
    this.editId = '';
  }
}
