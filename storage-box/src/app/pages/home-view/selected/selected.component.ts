import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-selected",
  templateUrl: "./selected.component.html",
  styleUrls: ["./selected.component.scss"]
})
export class SelectedComponent implements OnInit
{

  @Input() selectedImg: string;
  @Input() selectedTitle: string;
  @Input() selectedDesctip: string;

  constructor() { }

  ngOnInit() {
  }

}
