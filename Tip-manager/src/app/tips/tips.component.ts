import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.css']
})
export class TipsComponent implements OnInit {
  addtipsForm: FormGroup;
  FilterForm: FormGroup;
  submitted = false;
  tiplist: any;
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
    this.buildtipForm();
    this.builddateForm();
    this.getTipList()
    this.getpercentList()
  }

  buildtipForm(){
    this.addtipsForm = this._fromBuilder.group({
      place: ['', Validators.required],
      amount: ['',Validators.required ],
      percentage: ['',Validators.required],
    });
  }
  builddateForm(){
    this.FilterForm = this._fromBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['',Validators.required ],
      analyticstype:['']
    });
  }
  onSubmit(){
    this.submitted = true
    if(this.addtipsForm.invalid){
      return false
    }
    else{
      let data = this.addtipsForm.value
      this.http.post('http://localhost:30007/api/user/addtip',data,{headers:this.headers}).subscribe(data => {
        if(data['code'] === 200){
          this.addtipsForm.reset()
          this.toastr.success(data['message'])
          this.getTipList()
        }
        else{
          this.toastr.error(data['message'])
        }
      })
    }
  }
  getTipList(){
    this.http.get('http://localhost:30007/api/user/gettip',{headers:this.headers}).subscribe(data => {
      if(data['code'] === 200){
        this.tiplist = data['data']
      }
      else{
        this.toastr.error(data['message'])
      }
    })
  }

  FilterTips(){
    this.filtersubmit = true
    if(this.FilterForm.invalid){
      return false
    }
    else{
      this.http.post('http://localhost:30007/api/user/getfilteredtip',this.FilterForm.value,{headers:this.headers}).subscribe(data => {
        if(data['code'] === 200){
          this.tiplist = data['data']
        }
        else{
          this.toastr.error(data['message'])
        }
      })
    }
  }

  Add(){
    this.router.navigate(['/percent'])
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
}
