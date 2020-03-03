import * as tslib_1 from "tslib";
import { Component } from "@angular/core";
let HomeViewComponent = class HomeViewComponent {
    constructor() {
        this.items = [
            {
                img: "../assets/img/deadpool.jpg",
                title: "Item #"
            },
            {
                img: "../assets/img/harley.jpg",
                title: "Item #"
            },
            {
                img: "../assets/img/empty.jpg",
                title: "Item #"
            },
            {
                img: "../assets/img/harley.jpg",
                title: "Item #"
            },
            {
                img: "../assets/img/deadpool.jpg",
                title: "Item #"
            },
            {
                img: "https://bulma.io/images/placeholders/128x128.png",
                title: "Item #"
            },
            {
                img: "../assets/img/harley.jpg",
                title: "Item #"
            },
            {
                img: "../assets/img/deadpool.jpg",
                title: "Item #"
            },
            {
                img: "../assets/img/harley.jpg",
                title: "Item #"
            },
            {
                img: "../assets/img/empty.jpg",
                title: "Item #"
            },
            {
                img: "../assets/img/harley.jpg",
                title: "Item #"
            },
            {
                img: "../assets/img/deadpool.jpg",
                title: "Item #"
            },
            {
                img: "https://bulma.io/images/placeholders/128x128.png",
                title: "Item #"
            },
            {
                img: "../assets/img/harley.jpg",
                title: "Item #"
            },
            {
                img: "../assets/img/deadpool.jpg",
                title: "Item #"
            },
            {
                img: "https://bulma.io/images/placeholders/128x128.png",
                title: "Item #"
            },
            {
                img: "https://bulma.io/images/placeholders/128x128.png",
                title: "Item #"
            }
        ];
        this.selectedImg = "../assets/img/empty.jpg";
        this.selectedTitle = "NO TITLE YET";
        this.selectedDesctip = "NO DESCRIPTION YET";
    }
    ngOnInit() {
    }
    itemClicked(item, i) {
        this.selectedImg = item.img;
        this.selectedTitle = item.title + "" + (i + 1);
        console.log("Item Clicked: " + this.selectedImg + " | " + this.selectedTitle);
    }
    newItemClick() {
        console.log("New Item Clicked");
    }
    deleteItemClick() {
        console.log("Delete Item Clicked");
    }
    updateItemClick() {
        console.log("Update Item Clicked");
    }
};
HomeViewComponent = tslib_1.__decorate([
    Component({
        selector: "app-home-view",
        templateUrl: "./home-view.component.html",
        styleUrls: ["./home-view.component.scss"]
    })
], HomeViewComponent);
export { HomeViewComponent };
//# sourceMappingURL=home-view.component.js.map