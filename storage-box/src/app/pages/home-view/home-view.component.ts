import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-home-view",
  templateUrl: "./home-view.component.html",
  styleUrls: ["./home-view.component.scss"]
})
export class HomeViewComponent implements OnInit
{
  items: any[] = [
    {
      img: "../assets/img/deadpool.jpg",
      title : "Item #"
    },
    {
      img: "../assets/img/harley.jpg",
      title : "Item #"
    },
    {
      img: "../assets/img/empty.jpg",
      title : "Item #"
    },
    {
      img: "../assets/img/harley.jpg",
      title : "Item #"
    },
    {
      img: "../assets/img/deadpool.jpg",
      title : "Item #"
    },
    {
      img: "https://bulma.io/images/placeholders/128x128.png",
      title : "Item #"
    },
    {
      img: "../assets/img/harley.jpg",
      title : "Item #"
    },
    {
      img: "../assets/img/deadpool.jpg",
      title : "Item #"
    },
    {
      img: "../assets/img/harley.jpg",
      title : "Item #"
    },
    {
      img: "../assets/img/empty.jpg",
      title : "Item #"
    },
    {
      img: "../assets/img/harley.jpg",
      title : "Item #"
    },
    {
      img: "../assets/img/deadpool.jpg",
      title : "Item #"
    },
    {
      img: "https://bulma.io/images/placeholders/128x128.png",
      title : "Item #"
    },
    {
      img: "../assets/img/harley.jpg",
      title : "Item #"
    },
    {
      img: "../assets/img/deadpool.jpg",
      title : "Item #"
    },
    {
      img: "https://bulma.io/images/placeholders/128x128.png",
      title : "Item #"
    },
    {
      img: "https://bulma.io/images/placeholders/128x128.png",
      title : "Item #"
    }
];

selectedImg = "../assets/img/empty.jpg";
selectedTitle = "NO TITLE YET";
selectedDesctip = "NO DESCRIPTION YET";


  constructor() { }

  ngOnInit() {
  }

  itemClicked(item: any, i: number)
  {
    this.selectedImg = item.img;
    this.selectedTitle = item.title + "" + (i + 1);
    console.log("Item Clicked: " + this.selectedImg + " | " + this.selectedTitle);
  }
  newItemClick()
  {
      console.log("New Item Clicked");

  }

  deleteItemClick()
  {
    console.log("Delete Item Clicked");

  }

  updateItemClick()
  {
    console.log("Update Item Clicked");

  }
}
