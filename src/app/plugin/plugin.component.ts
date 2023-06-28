import { Component } from '@angular/core';
import {apply_params, getParams, now, setParams} from "../../tools";
import {NetworkService} from "../network.service";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../environments/environment";
import {StyleManagerService} from "../style-manager.service";
import {NgNavigatorShareService} from "ng-navigator-share";

@Component({
  selector: 'app-plugin',
  templateUrl: './plugin.component.html',
  styleUrls: ['./plugin.component.css']
})
export class PluginComponent {
  airdrop:any;
  code_to_insert: string="";
  networks:any[]=[{label:"elrond-devnet",value:"elrond-devnet"},{label:"elrond-mainnet",value:"elrond-mainnet"}]
  address: string = "";
  appname="";
  visual="";
  claim="";
  background="";
  border="";
  size="";
  title="";
  url="";
  link_properties:any[]=[
    {label: "Style",value:"nfluent-dark.css",name:"style",width:"100%"},
    {label: "Fond d'écran",value:"https://s.f80.fr/assets/wood.jpg",name:"background"},
    {label: "FavIcon",value:"favicon.png",name:"favicon"},
    {label: "Splash Screen",value:"https://nfluent.io/assets/cash_machine.jpg",name:"visual"},
    {label: "Claim",value:"",name:"claim"},
  ]
  style_properties: any={}


  constructor(
      public api:NetworkService,
      public share:NgNavigatorShareService,
      public style:StyleManagerService,
      public routes:ActivatedRoute) {

  }



  save_airdrop() {
    localStorage.setItem("airdrop",JSON.stringify(this.airdrop))
    this.api._post("airdrops/","",this.airdrop).subscribe({next:(r:any)=>{
      this.code_to_insert=r.code

      if(this.link_properties){
        let params=r.params
        for(let p of Object.keys(this.style_properties)){
          params[p]=this.style_properties[p]
        }
        params["appname"]=this.airdrop.token.name+" Bank"
        params["toolbar"]=false
        this.url="https://bank.nfluent.io/bank/?"+setParams(params);
      }
    }})
  }

  restart() {
    this.airdrop={
      dealer_wallet:"bob: Z0FBQUFBQmttdGJJZmtnaDdXZzlFTjBuX1FjOVhxelp4Q1VtSUhVaGhlX25xa1VDdjltUzB4ajFmaE9ZbzJMM252MDMzSzNrWWdKRlc5b3ZoWHFzZWdmSndDVGpKb0tGcmJ6QjNYdVdaTHEyUlFmYUs5ZVUyRFlLbmhfTGplRDhlOVdxM2dXMTFRam9SOTl6SS1CUWtiWWNRNHBvcjlyYTI0M3M3T1lXd1ZXUEZJUkhMTUkxY3FZPQ==",
      token:{},
      limit_by_day:5,
      random:100,
      amount:1,
      authent_delay:5,
      dtEnd:now("datetime",10000000),
      network:this.networks[0]
    };
    this.code_to_insert=""
    this.url="";
  }

  async ngOnInit() {
    this.restart()
    let params:any=await getParams(this.routes)
    apply_params(this,params,environment)
    if(params.wallet)this.airdrop.dealer_wallet=params.wallet
    this.address=params.address || ""

  }

  share_url() {
    this.share.share({
      title:"Recharger",
      url:this.url
    })
  }

  open_test() {
    open(this.url,"Test")
  }

  update_properties($event: any) {
    this.style_properties=$event;
    this.save_airdrop()
  }
}
