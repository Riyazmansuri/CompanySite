import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  employeeActive: boolean = true;
  consultantActive: boolean = false;
  showPassword: boolean = false;
  isRegisterMode: boolean = false;

  selectRole(role: string) {
    if (role === 'employee') {
      this.employeeActive = true;
      this.consultantActive = false;
    } else if (role === 'consultant') {
      this.employeeActive = false;
      this.consultantActive = true;
    }
  }

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}
