import { Component, Input, OnChanges } from "@angular/core";

@Component({
  selector: "app-selected",
  templateUrl: "./selected.component.html",
  styleUrls: ["./selected.component.scss"]
})
export class SelectedComponent implements OnChanges
{
  picture: boolean;

  @Input() selectedImg: string;
  @Input() selectedTitle: string;
  @Input() selectedDesctip: string;

  constructor() { }

  ngOnChanges()
  {
    // Video to video switching won't work without this
    this.picture = true;
    setTimeout(() =>
    {
      this.picture = !this.selectedImg.endsWith(".mp4");
    }, 50);
  }

}
