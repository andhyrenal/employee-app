import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CutiService } from './cuti.service';
import { EmployeeService } from '../employee/employee.service';
import { Cuti } from '../../model/cuti'
import { User } from '../../model/user';

@Component({
  selector: 'app-cuti',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzDatePickerModule,
    NzSelectModule
  ],
  templateUrl: './cuti.component.html',
  styleUrl: './cuti.component.scss'
})
export class CutiComponent {
  users: User[] = [];
  cuti: Cuti[] = [];
  isVisible = false;
  isEdit = false;
  editId = '';
  cutiForm!: FormGroup;

  constructor(
    private cutiService: CutiService,
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.loadCuti();
    this.getEmployee();
    this.cutiForm = this.fb.group({
      employee: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      reason: ['', [Validators.required]],
    });
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.cutiForm.value.endDate) {
      return false;
    }
    return startValue.getTime() > this.cutiForm.value.endDate.getTime();
  };


  getEmployee(): void {
    this.employeeService.getEmployees().subscribe((data) => {
      this.users = data || []
    })
  }

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.cutiForm.value.startDate) {
      return false;
    }
    return endValue.getTime() <= this.cutiForm.value.startDate.getTime();
  };

  loadCuti(): void {
    this.cutiService.getCuti().subscribe(data => {
      this.cuti = data.map((el: Cuti) : Cuti => ({
          employee: el.employee,
          id: el.id,
          startDate: el.startDate,
          endDate: el.endDate,
          reason: el.reason
      }))
    });
  }

  createMessage(type: string): void {
    switch (type) {
      case 'Success':
        this.message.create(type, `Created Data Cuti Successfully`);
        break;
      default:
        this.message.create(type, `Data Cuti Successfully Updated`);
        break;
    }
  }

  showModal(cuti?: any): void {
    this.isVisible = true;
    this.isEdit = !!cuti;
    if(this.isEdit) {
      this.editId = cuti.id
    }
    this.cutiForm.reset();
    const patchCuti = {
      ...cuti,
      startDate: new Date(cuti.startDate),
      endDate: new Date(cuti.endDate),
    };
    if (cuti) {
      this.cutiForm.patchValue(patchCuti);
    }
  }

  handleOk(): void {
    if (this.cutiForm.valid) {
      const cuti = {
        ...this.cutiForm.value,
      }
      if (this.isEdit) {
        const formValue = this.cutiForm.value;
        this.cutiService.updateCuti(this.editId, formValue).subscribe(() => {
          this.resetForm();
          this.loadCuti();
        })
        this.createMessage('Update');
      } else {
        this.cutiService.addCuti(cuti).subscribe(() => {
          this.loadCuti()
          this.resetForm()
        })
        this.createMessage('Success');
      }
      this.isVisible = false;
    } else {
      Object.values(this.cutiForm.controls).forEach(control => {
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

  deleteUser(id: number): void {
    this.cutiService.deleteCuti(id).subscribe(() => {
      this.loadCuti();
    })
  }

  resetForm(): void {
    this.cutiForm.reset();
    this.isEdit = false;
    this.editId = '';
  }
}
