import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-login-form",
  templateUrl: "./login-form.component.html",
  styleUrls: ["./login-form.component.scss"]
})
export class LoginFormComponent implements OnInit
{
  model: any = {};

  @Input() loading: boolean;

  @Output() sendForm = new EventEmitter<any>();


  constructor() { }

  ngOnInit() {
  }

  login()
  {
    this.sendForm.emit(this.model);
  }

}
