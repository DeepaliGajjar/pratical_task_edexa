import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  registeruser: FormGroup;
  loginuser: FormGroup;
  login = true;
  headers = {
    'Content-Type': 'application/json',
    'token' : localStorage.getItem('user_token')
  }
  selected_image: File;
  filename: string;
  constructor(
    private _formBuilder: FormBuilder,
    private http : HttpClient
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
    this.login = true
    this.loginuser = this._formBuilder.group({
      email: ['',[Validators.required,Validators.email]],
      password: ['',Validators.required],
    });
  }

  onSubmitlogin(){
    console.log(this.loginuser.value);
    let data = this.loginuser.value
    this.http.post('http://localhost:30005/api/user/login',data,{headers:this.headers}).subscribe(data => {
      console.log(data);

    })
  }

  onSubmitregister(){
    console.log(this.registeruser.value);
    this.http.post('http://localhost:30005/api/user/signup',this.registeruser.value).subscribe(data => {
      console.log(data);

    })
  }

  imageChange(event) {
    this.selected_image = <File>event.target.files[0]
    this.registeruser.controls['profilePicture'].setValue(this.selected_image ? this.selected_image.name : '')
    this.filename = this.selected_image ? this.selected_image.name : ''
    console.log(this.selected_image);

  }
}
