import { IItemInterface } from "./../../../../../api/db/models/item.model";
import { ItemService } from "./../../_services/item.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "src/app/_services";

@Component({
  selector: "app-home-view",
  templateUrl: "./home-view.component.html",
  styleUrls: ["./home-view.component.scss"]
})
export class HomeViewComponent implements OnInit
{
  items: IItemInterface[];
  homeView = true;
  selectedText = "Select Item";
  lastSelect: string;
  returnUrl: string;

  selectedId: string;
  selectedImg = "../assets/img/empty.jpg";
  selectedTitle = "SELECT AN ITEM TO THE LEFT";
  selectedDesctip = "SELECT AN ITEM TO THE LEFT";


  constructor(
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
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
        console.log("Got Items: " + items[0]._id);
        this.items = items;
      });
  }

  itemClicked(item: any, i: number)
  {
    // this.homeView = false;
    this.selectedText = "Selected Item";
    this.selectedImg = item.file_path;
    this.selectedTitle = item.title;
    this.selectedId = item._id;
    this.selectedDesctip = item.description;
    this.homeView = true;
    console.log("Item  #" + (i + 1) + " Clicked: " + this.selectedImg + " | " + this.selectedTitle);
  }
  newItemClick()
  {
    this.homeView = false;
    this.lastSelect = this.selectedText;
    this.selectedText = "Add Item";
    console.log("New Item Clicked");
  }

  deleteItemClick()
  {
    if (this.selectedId)
    {
      this.itemService.delete(this.selectedId).subscribe(data =>
      {
        this.selectedId = null;
        this.selectedImg = "../assets/img/empty.jpg";
        this.selectedTitle = "Item Deleted!";
        this.selectedDesctip = "NO DESCRIPTION YET";
        console.log(data);
      },
      error =>
      {
        this.selectedId = null;
        this.selectedImg = "../assets/img/empty.jpg";
        this.selectedTitle = "ERROR Deleting Item!";
        this.selectedDesctip = "ERROR";
        console.log(error.error);
        });
      this.getItems();
      console.log("Delete Item ID: " + this.selectedId);
      console.log("Delete Item Clicked");
    }
  }

  updateItemClick()
  {
    this.homeView = true;
    this.getItems();
    console.log("Update Item Clicked");
  }

  viewSelectClick()
  {
    this.homeView = true;
    this.selectedText = this.lastSelect;
    this.getItems();
    console.log("View Selected Clicked");
  }

  logout()
  {
    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || "/";

  }
}
