import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  registeruser: FormGroup;
  loginuser: FormGroup;
  login = true;
  submitted = false;

  headers = {
    'Content-Type': 'application/json',
    'token' : localStorage.getItem('user_token')
  }
  selected_image: File;
  filename: string;
  constructor(
    private _formBuilder: FormBuilder,
    private _router:Router,
    private http : HttpClient,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.buildloginForm();
  }

  buildregisterForm(){
    this.login = false
    this.registeruser = this._formBuilder.group({
      name: ['', Validators.required],
      profilePicture: ['',Validators.required ],
      email: ['',[Validators.required,Validators.email]],
      password: ['',Validators.required],
    });
  }

  buildloginForm(){
      this.loginuser = this._formBuilder.group({
        email: ['',[Validators.required,Validators.email]],
        password: ['',Validators.required],
      });
  }

  onSubmitlogin(){
    this.login = true
    this.submitted= true
    if(this.loginuser.invalid){
      return false
    }
    else{
      let data = this.loginuser.value
      this.http.post('http://localhost:30007/api/user/login',data).subscribe(data => {
        if(data['code'] === 200){
          this.toastr.success(data['message'])
          localStorage.setItem('user_token',data['data'].token)
          this._router.navigate(["/tips"])
        }
        else{
          this.toastr.error(data['message'])
          this._router.navigate(["/"])
        }
      })
    }
  }

  onSubmitregister(){
    this.registeruser.value['filename'] = this.selected_image
    let fd = new FormData()
    fd.append('filename',this.selected_image)
    fd.append('name',this.registeruser.value.name)
    fd.append('email',this.registeruser.value.email)
    fd.append('password',this.registeruser.value.password)
    fd.append('profilePicture',this.registeruser.value.profilePicture)
    this.http.post('http://localhost:30007/api/user/signup',fd).subscribe(data => {
      if(data['code'] === 200){
        this.toastr.success(data['message'])
      }
      else{
        this.toastr.error(data['message'])
      }
    })
  }

  imageChange(event) {
    this.selected_image = <File>event.target.files[0]
    this.registeruser.controls['profilePicture'].setValue(this.selected_image ? this.selected_image.name : '')
    this.filename = this.selected_image ? this.selected_image.name : ''
    this.registeruser.value['filename'] = this.selected_image
  }
}
