import { IItemInterface } from "./../../../../../api/db/models/item.model";
import { ItemService } from "./../../_services/item.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-home-view",
  templateUrl: "./home-view.component.html",
  styleUrls: ["./home-view.component.scss"]
})
export class HomeViewComponent implements OnInit
{
  items: IItemInterface[];
  homeView = true;

selectedImg = "../assets/img/empty.jpg";
selectedTitle = "NO TITLE YET";
selectedDesctip = "NO DESCRIPTION YET";


  constructor(
    private itemService: ItemService
  )
  {}


  ngOnInit(): void
  {
    this.getItems();
  }

  getItems(): void
  {
    // The owner's id is stored in local storage for use here

    this.itemService.getAll(localStorage.getItem("owner"))
    .subscribe(items =>
      {
        console.log("Got Items: " + items[0].file_path);
        this.items = items;
      });
  }

  itemClicked(item: any, i: number)
  {
    this.selectedImg = item.file_path;
    this.selectedTitle = item.title;
    this.selectedDesctip = item.description;
    console.log("Item  #" + (i + 1) + " Clicked: " + this.selectedImg + " | " + this.selectedTitle);
  }
  newItemClick()
  {
    this.homeView = false;
    console.log("New Item Clicked");
  }

  deleteItemClick()
  {
    console.log("Delete Item Clicked");
  }

  updateItemClick()
  {
    this.homeView = true;
    console.log("Update Item Clicked");
  }
}
