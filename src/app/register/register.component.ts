import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validator, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
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
    private router: Router, private toastr: ToastrService) {
    sessionStorage.clear();
  }

  // Custom validator function
  matchPasswordValidator: ValidatorFn = (control: AbstractControl): { [key: string]: boolean } | null => {
    const password = control.root.get('password');
    const confirmPassword = control.value;

    // Check if password and confirmPassword match
    if (password && confirmPassword !== password.value) {
      return { mismatch: true }; // Return validation error
    }

    return null; // Return null if validation passes
  };

  registerForm = this.builder.group({
    email: this.builder.control('', Validators.compose([Validators.required, Validators.email])),
    password: this.builder.control('', Validators.compose([Validators.required,
    Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}$')])),
    confirmPassword: this.builder.control('', Validators.compose([Validators.required, this.matchPasswordValidator]))
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
    this.resetForm();
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
  
      if (email) {
        this.service.checkEmailExists(email).subscribe(exists => {
          if (exists) {
            this.toastr.error('Email already exists');
          } else {
            const role = this.employeeActive ? 'employee' : 'consultant';
            this.service.proceedRegister(this.registerForm.value, role).subscribe(res => {
              this.toastr.success('Registered Successfully');
              this.isRegisterMode = false;
            });
          }
        });
      }
    } else if (!this.isRegisterMode && this.registerForm.controls.email.valid && this.registerForm.controls.password.valid) {
      const email = this.registerForm.value.email;
      const password = this.registerForm.value.password;
  
      if (email && password) {
        this.service.proceedLogin(email, password).subscribe(res => {
          if (res) {
            sessionStorage.setItem('email', res.email);
            sessionStorage.setItem('role', res.role);
            this.router.navigate(['home']);
          } else {
            this.toastr.error('Invalid Credentials');
          }
        });
      }
    } else {
      this.toastr.error('Enter valid data');
      console.log(this.registerForm.controls.email.errors);
      console.log(this.registerForm.controls.password.errors);
      console.log(this.registerForm.controls.confirmPassword.errors);
      console.log(this.registerForm.valid);
    }
  }
  
  

  resetForm() {
    this.registerForm.reset(); // Reset the form
  }


}

