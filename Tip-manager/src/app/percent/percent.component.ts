import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-percent',
  templateUrl: './percent.component.html',
  styleUrls: ['./percent.component.css']
})
export class PercentComponent implements OnInit {
  addpercentForm: FormGroup;
  submitted = false;
  percentlist: any;

  headers = {
    'Content-Type': 'application/json',
    'token' : localStorage.getItem('user_token')
  }
  filtersubmit: boolean = false;
  constructor(
    private _fromBuilder:FormBuilder,
    private http : HttpClient,
    private toastr: ToastrService,
    private router:Router) { }

  ngOnInit(): void {
    this.buildpercentForm();
    this.getpercentList()
  }

  buildpercentForm(){
    this.addpercentForm = this._fromBuilder.group({
      percentage: ['',Validators.required],
    });
  }

  onSubmit(){
    this.submitted = true
    if(this.addpercentForm.invalid){
      return false
    }
    else{
      let data = this.addpercentForm.value
      this.http.post('http://localhost:30007/api/user/addpercent',data,{headers:this.headers}).subscribe(data => {
        if(data['code'] === 200){
          this.addpercentForm.reset()
          this.toastr.success(data['message'])
          this.getpercentList()
        }
        else{
          this.toastr.error(data['message'])
        }
      })
    }
  }

  getpercentList(){
    this.http.get('http://localhost:30007/api/user/getpercent',{headers:this.headers}).subscribe(data => {
      if(data['code'] === 200){
        this.percentlist = data['data']
      }
      else{
        this.toastr.error(data['message'])
      }
    })
  }

  Add(){
    this.router.navigate(['/tips'])
  }
}
