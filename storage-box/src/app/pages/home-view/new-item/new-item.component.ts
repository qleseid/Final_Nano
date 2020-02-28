import { appConfig } from "./../../../app.config";
import { FileUploader } from "ng2-file-upload";
import { Component } from "@angular/core";
// const URL = '/api/';
const URL = `${appConfig.apiUrl}/api/upload`;

@Component({
  selector: "app-new-item",
  templateUrl: "./new-item.component.html",
  styleUrls: ["./new-item.component.scss"]
})
export class NewItemComponent
{
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  response: string;

  constructor(){
    this.uploader = new FileUploader(
      {
        url: URL,
        disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
        formatDataFunctionIsAsync: true,
        formatDataFunction: async (item) =>
        {
          return new Promise( (resolve, reject) =>
          {
            resolve(
              {
                name: item._file.name,
                length: item._file.size,
                contentType: item._file.type,
                date: new Date()
              });
          });
        }
      });

    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;

    this.response = "";

    this.uploader.response.subscribe( res => this.response = res );
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

}
