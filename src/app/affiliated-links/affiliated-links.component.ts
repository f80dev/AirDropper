import {Component, OnInit} from '@angular/core';
import {NetworkService} from "../network.service";
import {encrypt} from "../../tools";

@Component({
  selector: 'app-affiliated-links',
  templateUrl: './affiliated-links.component.html',
  styleUrls: ['./affiliated-links.component.css']
})
export class AffiliatedLinksComponent implements OnInit {

  urls:any[]=[];
  sel_url: any="";
  address: string="";
  url:string="";

  constructor(public api:NetworkService) {
  }

  ngOnInit(): void {
    this.api._get("affiliated_links/").subscribe({
      next:(links:string[])=>{
        this.urls=links.map((x)=>{return {value:x,label:x}})
        if(this.urls.length>0)this.sel_url=this.urls[0];
      }
    })
  }


  eval_link() {
    this.url=this.sel_url+"&wallet="+encrypt(this.address);
  }
}
