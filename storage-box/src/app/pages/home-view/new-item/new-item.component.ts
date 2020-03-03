import { appConfig } from "./../../../app.config";
import { FileUploader } from "ng2-file-upload";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { ItemService } from "../../../_services/item.service";
import { Router } from "@angular/router";
import { AlertService } from "src/app/_services/index";
import { HttpEvent, HttpEventType } from "@angular/common/http";
// const URL = '/api/';
const URL = `${appConfig.apiUrl}/api/upload`;

@Component({
  selector: "app-new-item",
  templateUrl: "./new-item.component.html",
  styleUrls: ["./new-item.component.scss"]
})
export class NewItemComponent implements OnInit
{
  uploadForm: FormGroup;
  progress = 0;
  response: string;
  imgPre: any;

  @Output() uploadComplete = new EventEmitter<any>();

  constructor(
    private formBuilder: FormBuilder,
    private itemservice: ItemService,
    private alertService: AlertService)
  {
    this.response = "";
  }

  ngOnInit()
  {
    this.uploadForm = this.formBuilder.group(
      {
        title: ["", Validators.required],
        description: [""],
        photo: [null]
      });
  }

  onFileSelect(event)
  {
    if (event.target.files.length > 0)
    {
      const file = event.target.files[0];
      console.log(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () =>
        {
          this.imgPre = reader.result;
        };
      this.uploadForm.get("photo").setValue(file);
    }
  }

  onSubmit()
  {
    const formData: any = new FormData();
    formData.append("photo", this.uploadForm.get("photo").value);
    formData.append("title", this.uploadForm.get("title").value);
    formData.append("description", this.uploadForm.get("description").value);
    formData.append("owner_id", localStorage.getItem("owner"));

    this.itemservice.create(formData).subscribe((event: HttpEvent<any>) =>
    {
      switch (event.type)
      {
        case HttpEventType.Sent:
          console.log("Request has been made!");
          break;
        case HttpEventType.ResponseHeader:
          console.log("Response header has been received!");
          break;
        case HttpEventType.UploadProgress:
          this.progress = Math.round(event.loaded / event.total * 100);
          console.log(`Uploading... ${this.progress}%`);
          break;
        case HttpEventType.Response:
          console.log("Item successfully saved!", event.body);
          setTimeout(() =>
          {
            this.progress = 0;
            this.uploadComplete.emit();
          }, 1500);
        }
      console.log("In New Item Data: " + event);
      },
      error =>
      {
        this.alertService.error(error.error.message);
        console.log(error);
      });
  }
}
