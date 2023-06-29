import { Component } from '@angular/core';
import { FormBuilder, Validator, Validators } from '@angular/forms';
// import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  employeeActive: boolean = true;
  consultantActive: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isRegisterMode: boolean = false;
  userData: any;

  constructor(private builder: FormBuilder, private service: AuthService,
    private router: Router) {
    sessionStorage.clear();
  }

  registerForm = this.builder.group({
    email: this.builder.control('', Validators.compose([Validators.required, Validators.email])),
    password: this.builder.control('', Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}$')]))
  })
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

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  proceedRegistration() {
    if (this.isRegisterMode && this.registerForm.valid) {
      const email = this.registerForm.get('email')?.value;

      // Check if email already exists
      if (email) {
        this.service.checkEmailExists(email).subscribe(exists => {
          if (exists) {
            alert('Email already exists');
          } else {
            const role = this.employeeActive ? 'employee' : 'consultant';
            this.service.proceedRegister(this.registerForm.value, role).subscribe(res => {
              // Registration successful
              this.isRegisterMode = false;
            });
          }
        });
      }
    } else if (!this.isRegisterMode && this.registerForm.valid) {
      this.service.GetUserbyCode(this.registerForm.value.email).subscribe(res => {
        this.userData = res;
        if (
          this.userData.length > 0 &&
          this.userData[0].password === this.registerForm.value.password &&
          (
            (this.employeeActive && this.userData[0].role === 'employee') ||
            (this.consultantActive && this.userData[0].role === 'consultant')
          )
        ) {
          console.log(this.userData);
          sessionStorage.setItem('email', this.userData[0].email);
          sessionStorage.setItem('role', this.userData[0].role);
          this.router.navigate(['home']);
        } else {
          alert('Invalid Credentials');
        }
      });
    } else {
      alert('Invalid values');
      console.log('Enter valid data');
    }
  }

}
