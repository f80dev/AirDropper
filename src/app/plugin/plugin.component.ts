import { Component } from '@angular/core';
import {$$, apply_params, getParams, now, setParams, showError, showMessage} from "../../tools";
import {NetworkService} from "../network.service";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../environments/environment";
import {StyleManagerService} from "../style-manager.service";
import {NgNavigatorShareService} from "ng-navigator-share";
import {_prompt} from "../prompt/prompt.component";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../user.service";

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
    {label: "Banque",value:environment.default_bank,name:"bank_domain",width:"350px",help:"Adresse internet de la banque"},
    {label: "Fond d'écran",value:"https://s.f80.fr/assets/wood.jpg",name:"background",width:"350px"},
    {label: "FavIcon",value:"favicon.png",name:"favicon",width:"350px"},
    {label: "Splash Screen",value:"https://nfluent.io/assets/cash_machine.jpg",name:"visual",width:"350px"},
    {label: "Claim",value:"",name:"claim",width:"350px",help:"Phrase affiché en haut de la fenêtre"},
    {label: "Style",value:"nfluent-dark.css",name:"style",width:"350px"},
  ]
  style_properties: any={}
  qrcode_wallet: string = "";
  affiliate_url: string = "https://";


  constructor(
      public api:NetworkService,
      public dialog:MatDialog,
      public toast:MatSnackBar,
      public user:UserService,
      public share:NgNavigatorShareService,
      public style:StyleManagerService,
      public routes:ActivatedRoute) {
  }


  save_airdrop() {
    if(this.airdrop.amount>=this.airdrop.limit_by_day){
      showMessage(this,"Le montant doit être inférieur a la limite");return;
    }
    localStorage.setItem("airdrop",JSON.stringify(this.airdrop))
    this.api._post("airdrops/","",this.airdrop).subscribe({next:(r:any)=>{
        this.code_to_insert=r.code

        $$("Evaluation du lien internet")
        if(this.link_properties){
          let params=r.params
          for(let p of Object.keys(this.style_properties)){
            params[p]=this.style_properties[p]
          }
          let bank_domain=params["bank_domain"]
          params["bank_domain"]=null
          params["bank.histo"]=environment.histo
          params["appname"]=this.airdrop.token.name+" Bank"
          params["toolbar"]=false
          $$("Utilisation des parametres ",params)
          //http://bank.nfluent.io/?p=YmFuay5oaXN0bz1kYi0tbmZsdWVudCZiYW5rLmxpbWl0PTUmYmFuay5taW5lcj1aMEZCUVVGQlFtdHVSREpqTFdNM01UZFROelZPTVVSd1RUUTFiR0kxTFdoNFp6WnliV0V4TjFkR1NYZGZVM0phWjJ4R1p6VlZlVEJPWVVoU1QzQjBiVUZWTUZGMlRsRTJWazVhTVhsNWVuSkVXak0zZEdFNU1YVlJRVEI0VkdwRlZWRTlQUSUzRCUzRCZiYW5rLm5ldHdvcms9ZWxyb25kLWRldm5ldCZiYW5rLnJlZnVuZD0xJmJhbmsudG9rZW49YjY0JTNBZXlKaFkyTnZkVzUwY3lJNk1qY3NJbUpoYkdGdVkyVWlPakFzSW1OaGJrRmtaRk53WldOcFlXeFNiMnhsY3lJNmRISjFaU3dpWTJGdVFuVnliaUk2ZEhKMVpTd2lZMkZ1UTJoaGJtZGxUM2R1WlhJaU9uUnlkV1VzSW1OaGJrWnlaV1Y2WlNJNmRISjFaU3dpWTJGdVRXbHVkQ0k2ZEhKMVpTd2lZMkZ1VUdGMWMyVWlPblJ5ZFdVc0ltTmhibFZ3WjNKaFpHVWlPblJ5ZFdVc0ltTmhibGRwY0dVaU9uUnlkV1VzSW1SbFkybHRZV3h6SWpveE9Dd2laR1Z6WTNKcGNHbHZiaUk2SWlJc0ltbGtJam9pVGtaTVZVTlBTVTR0TkRreU1XVmtJaXdpYVdSbGJuUnBabWxsY2lJNklrNUdURlZEVDBsT0xUUTVNakZsWkNJc0ltbHRZV2RsSWpvaWFIUjBjSE02THk5MGIydGxibVp2Y21kbExtNW1iSFZsYm5RdWFXOHZZWE56WlhSekwybGpiMjV6TDJWbmJHUXRkRzlyWlc0dGJHOW5ieTUzWldKd0lpd2lhWE5RWVhWelpXUWlPbVpoYkhObExDSnNZV0psYkNJNklrNUdiSFZEYjJsdUlpd2libUZ0WlNJNklrNUdiSFZEYjJsdUlpd2liM2R1WlhJaU9pSmxjbVF4WjJ0a05tWTRkMjAzT1hZelpuTjVlV3RzY0RKeGEyaHhNR1ZsYXpJNFkyNXlOR3BvYWpsb09EZDZkM0Y0ZDJSNk4zVjNjM1JrZW1vemJTSXNJblJwWTJ0bGNpSTZJazVHVEZWRFQwbE9MVFE1TWpGbFpDSXNJblJ5WVc1ellXTjBhVzl1Y3lJNk1qSTVMQ0owZVhCbElqb2lSblZ1WjJsaWJHVkZVMFJVSW4wJTNEJnN0eWxlPW5mbHVlbnQtZGFyay5jc3MmYmFja2dyb3VuZD1odHRwcyUzQSUyRiUyRnMuZjgwLmZyJTJGYXNzZXRzJTJGd29vZC5qcGcmZmF2aWNvbj1mYXZpY29uLnBuZyZ2aXN1YWw9aHR0cHMlM0ElMkYlMkZuZmx1ZW50LmlvJTJGYXNzZXRzJTJGY2FzaF9tYWNoaW5lLmpwZyZjbGFpbT0mdG9vbGJhcj1mYWxzZSZhcHBuYW1lPU5GbHVDb2luJTIwQmFuaw%3D%3D
          this.url=bank_domain+"/?"+setParams(params);
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
      show_deal:true,
      authent_delay:5,
      dtStart:now("datetime",100000),
      dtEnd:now("datetime",10000000),
      network:this.networks[0]
    };
    this.code_to_insert=""
    this.url="";
    this.address="";
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

  async create_account() {
    let email=await _prompt(this,"Création d'un wallet","","Indiquer votre adresse email","text","Créer le wallet","Annuler",false)
    this.api.create_account(this.airdrop.network.value,email,"mail_new_account","mail_existing_account",{},true).subscribe((r:any)=>{
      this.address=r.address;
      this.api.qrcode(this.address,"json").subscribe((r:any)=>{
        this.qrcode_wallet=r.qrcode;
      })

      this.airdrop.dealer_wallet=r.encrypt
      showMessage(this,"Consulter votre mail pour récupérer les informations de votre nouveau wallet",10000)
    })
  }

  update_network($event: any) {
    this.airdrop.network=$event;
  }

  switch_mode() {
    this.user.advance_mode=!this.user.advance_mode
  }

    async encrypt_key() {
      let secret_key=await _prompt(this,"La clé privée du wallet de distribution","",this.appname+" à besoin de la clé privée pour pouvoir distribuer les tokens","text","Valider","Annuler",false)
      if(secret_key){
        if(secret_key.length<15 && this.airdrop.network.value.indexOf("devnet")>-1){
          $$("On recherche la clé au pseudo ",secret_key)
          this.api._get("keys/"+secret_key+"/","network="+this.airdrop.network.value).subscribe({
            next:(keys:any[])=>{this.airdrop.dealer_wallet=secret_key+": "+keys[0].encrypted,this.address=keys[0].address;},
            error:(err)=>{debugger;showError(this,err)}
          })
        }
      } else {

        this.api.encrypte_key("wallet",this.airdrop.network,secret_key).subscribe(
            {
              next:(code:string)=>{debugger;this.airdrop.dealer_wallet=code},
              error:(err)=>{debugger;showError(this,err)}
            }
            )
      }
    }

  add_affiliate_link() {
    this.api._post("affiliated_links/","",{url:this.affiliate_url}).subscribe({
      next:()=>{
        showMessage(this,"Votre lien est enregistré")
      },
      error:(err)=>{
        showError(this,err)
      }
    })
  }
}
