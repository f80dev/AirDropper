//Test : http://localhost:4200/?wallet=Z0FBQUFBQmtzQ21wT3BtSXo1ODg2QUI4MHZyY3NTeTljRHVzTlJkOG9XbV9DeHpKOU9GY1F0YzRjeTRCVFBPMm5SZzBvUXhTcTF5NDFIMC1BZURvdmxZcXJmTjFOYUxvdFBNX0VMQ1hvVTdlZ1REUFY4UHdKd215XzZucXlrbGFJRllXZXE0UFU4VEc5SDd0WG5pWDdyMUFyLWl3ajlPZTZiZ0VHY0o2V2JtelJ3NTlDVjQ5YmZKZy1NV2R0WFF4V0VmUkRlMzMtWlVrSDYxZ3JnTUhwUXdmcjRaRXRBTzFfV0FtN0Rqc3MzQ3huaWUzenBOY3Y0WWpfSm4tRDQ5TTlDbFhwTVNFMzFVQVRrWmc2WG5qT2ZLRy1xekY0UXpUY3k4aXVJVlViTDRrbHlIeFhFVkM2TDlwVkVLVzB3eDZQUlRhQXM2YktBbnVudElTNExWVS0xVmxvckRMTXp5cFNnM2J3WFlDdXJZRndRSk9EOFphUUU4QlBzWE5oUGtBcGw5ejM5MEVTQmtDdktnWWRsS1FBNmw1MjFzVVhiZHNfZ01RMzFXUWRtbUh0ZFk0X3lKUXRNNC04ckNhbzlGNG9QTHJNaWhKUXQ5Y01ZcUgxN3l5Vm9nWmVOdzJBemFsS21XcmE2Z0doNm1rLVZZX0w1WUdKQ0x1OHkzTlJOWkZwb3ZxY3pEN3JfU0FrMGs3eVlDVWNCWmZSQzJjaTloNlhmR055VmsxbFZlNlg1MEl2cmxLb1p0YXJpZG5WbnpESkFWNzNKQVNPVkZmYm5OT2N4UE5yQWZQVVpia2JJYm5BMXlMTlJVNXFydzFpSWYySXlaN1lFeHhuT2tOWGFlUkJROVVMZmkyWGxVenVVdVdzcG5LelB2dXVhTUZ3RDVLV2c9PQ

import {Component, Input} from '@angular/core';
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
import {Connexion} from "../../operation";
import {Clipboard} from "@angular/cdk/clipboard";
import {MatTabChangeEvent} from "@angular/material/tabs";

@Component({
  selector: 'app-plugin',
  templateUrl: './plugin.component.html',
  styleUrls: ['./plugin.component.css']
})
export class PluginComponent {
  airdrop:any;
  code_to_insert: string="";
  networks:any[]=[{label:"elrond-devnet",value:"elrond-devnet"},{label:"elrond-mainnet",value:"elrond-mainnet"}]
  network:any=this.networks[0]
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
    {label: "Fond d'écran",value:"https://s.f80.fr/assets/wood.jpg",name:"background",width:"350px"},
    {label: "FavIcon",value:"favicon.png",name:"favicon",width:"350px"},
    {label: "Splash Screen",value:"https://nfluent.io/assets/cash_machine.jpg",name:"visual",width:"350px"},
    {label: "Claim",value:"",name:"claim",width:"350px",help:"Phrase affiché en haut de la fenêtre"},
    {label: "Style",value:"nfluent-dark.css",name:"style",width:"350px"},
  ]
  style_properties: any={}
  connexion:Connexion={
    keystore: false,
    address: true,
    direct_connect: true,
    email: true,
    extension_wallet: false,
    google: true,
    nfluent_wallet_connect: false,
    on_device: true,
    wallet_connect: true,
    web_wallet: false,
    webcam: false
  }
  qrcode_wallet: string = "";
  affiliate_url: string = "https://nfluent.io";
  redirect: string = "https://nfluent.io";
  redirect_message="Soyez récompenser en suivant ce lien"
  short_url:string="";
  url_qrcode="";

  url_bank: string="https://tokenforge.nfluent.io/bank"
  public_wallets=[
      {label:"bob",value:"bob"},
    {label:"alice",value:"alice"},
    {label:"franck",value:"franck"},
    {label:"dan",value:"dan"},
    {label:"eve",value:"eve"}
  ]
  intro_tab: string = ""


  constructor(
      public api:NetworkService,
      public dialog:MatDialog,
      public clipboard:Clipboard,
      public toast:MatSnackBar,
      public user:UserService,
      public share:NgNavigatorShareService,
      public style:StyleManagerService,
      public routes:ActivatedRoute) {
  }


  save_airdrop() {
    $$("Enregistrement des parametres de l'airdrop",this.airdrop)
    if(this.airdrop.amount>=this.airdrop.limit_by_day){
      showMessage(this,"Le montant doit être inférieur a la limite");return;
    }
    localStorage.setItem("airdrop",JSON.stringify(this.airdrop))
    this.api._post("airdrops/","from_domain="+environment.appli,this.airdrop).subscribe({next:(r:any)=>{
        this.code_to_insert=r.code
        this.set_into_message({index:0})

        $$("Evaluation du lien internet")
        if(this.link_properties){
          let params=r.params
          for(let p of Object.keys(this.style_properties)){
            params[p]=this.style_properties[p]
          }
          params["bank.histo"]=environment.histo
          params["appname"]=this.airdrop.token.name+" Bank"
          params["toolbar"]=false
          $$("Utilisation des parametres ",params)
          //http://bank.nfluent.io/?p=YmFuay5oaXN0bz1kYi0tbmZsdWVudCZiYW5rLmxpbWl0PTUmYmFuay5taW5lcj1aMEZCUVVGQlFtdHVSREpqTFdNM01UZFROelZPTVVSd1RUUTFiR0kxTFdoNFp6WnliV0V4TjFkR1NYZGZVM0phWjJ4R1p6VlZlVEJPWVVoU1QzQjBiVUZWTUZGMlRsRTJWazVhTVhsNWVuSkVXak0zZEdFNU1YVlJRVEI0VkdwRlZWRTlQUSUzRCUzRCZiYW5rLm5ldHdvcms9ZWxyb25kLWRldm5ldCZiYW5rLnJlZnVuZD0xJmJhbmsudG9rZW49YjY0JTNBZXlKaFkyTnZkVzUwY3lJNk1qY3NJbUpoYkdGdVkyVWlPakFzSW1OaGJrRmtaRk53WldOcFlXeFNiMnhsY3lJNmRISjFaU3dpWTJGdVFuVnliaUk2ZEhKMVpTd2lZMkZ1UTJoaGJtZGxUM2R1WlhJaU9uUnlkV1VzSW1OaGJrWnlaV1Y2WlNJNmRISjFaU3dpWTJGdVRXbHVkQ0k2ZEhKMVpTd2lZMkZ1VUdGMWMyVWlPblJ5ZFdVc0ltTmhibFZ3WjNKaFpHVWlPblJ5ZFdVc0ltTmhibGRwY0dVaU9uUnlkV1VzSW1SbFkybHRZV3h6SWpveE9Dd2laR1Z6WTNKcGNHbHZiaUk2SWlJc0ltbGtJam9pVGtaTVZVTlBTVTR0TkRreU1XVmtJaXdpYVdSbGJuUnBabWxsY2lJNklrNUdURlZEVDBsT0xUUTVNakZsWkNJc0ltbHRZV2RsSWpvaWFIUjBjSE02THk5MGIydGxibVp2Y21kbExtNW1iSFZsYm5RdWFXOHZZWE56WlhSekwybGpiMjV6TDJWbmJHUXRkRzlyWlc0dGJHOW5ieTUzWldKd0lpd2lhWE5RWVhWelpXUWlPbVpoYkhObExDSnNZV0psYkNJNklrNUdiSFZEYjJsdUlpd2libUZ0WlNJNklrNUdiSFZEYjJsdUlpd2liM2R1WlhJaU9pSmxjbVF4WjJ0a05tWTRkMjAzT1hZelpuTjVlV3RzY0RKeGEyaHhNR1ZsYXpJNFkyNXlOR3BvYWpsb09EZDZkM0Y0ZDJSNk4zVjNjM1JrZW1vemJTSXNJblJwWTJ0bGNpSTZJazVHVEZWRFQwbE9MVFE1TWpGbFpDSXNJblJ5WVc1ellXTjBhVzl1Y3lJNk1qSTVMQ0owZVhCbElqb2lSblZ1WjJsaWJHVkZVMFJVSW4wJTNEJnN0eWxlPW5mbHVlbnQtZGFyay5jc3MmYmFja2dyb3VuZD1odHRwcyUzQSUyRiUyRnMuZjgwLmZyJTJGYXNzZXRzJTJGd29vZC5qcGcmZmF2aWNvbj1mYXZpY29uLnBuZyZ2aXN1YWw9aHR0cHMlM0ElMkYlMkZuZmx1ZW50LmlvJTJGYXNzZXRzJTJGY2FzaF9tYWNoaW5lLmpwZyZjbGFpbT0mdG9vbGJhcj1mYWxzZSZhcHBuYW1lPU5GbHVDb2luJTIwQmFuaw%3D%3D
          this.url=this.url_bank+"/?"+setParams(params);
        }
      }})
  }

  restart() {
    $$("Reset")
    this.airdrop={
      dealer_wallet:"",
      token:{},
      limit_by_day:5,
      limit_by_wallet:3,
      force_authent:false,
      random:100,
      amount:1,
      show_deal:true,
      authent_delay:5,
      dtStart:now("datetime",100000),
      dtEnd:now("datetime",10000000),
      network:this.networks[0].value
    };
    this.code_to_insert=""
    this.url="";
    this.url_qrcode="";
    this.url_bank="https://tokenforge.nfluent.io/bank";
    this.address="";
  }



  find_address_from_encrypt(){
    this.api.get_account(this.airdrop.dealer_wallet,this.airdrop.network).subscribe((r:any[])=>{
      if(r.length>0){
        this.airdrop.dealer_wallet=r[0].encrypted
        this.address=r[0].address;
        $$("Récupération de l'adresse du wallet de distribution "+this.address)
      }else{
        showError(this)
      }
    })
  }



  async ngOnInit() {
    this.restart()
    let params:any=await getParams(this.routes)
    apply_params(this,params,environment)
    if(params.wallet){
      this.airdrop.dealer_wallet=params.wallet
      this.network={value:params.network || "elrond-devnet"}
    }
    if(this.airdrop.dealer_wallet.length>0){
      this.find_address_from_encrypt()
    }else{
      this.address=params.address || ""
      setTimeout(()=>{if(this.airdrop.wallet || this.airdrop.wallet=="")this.encrypt_key("alice");},1500)
    }

  }

  share_url(url:string,message="Recharger") {
    this.share.share({
      title:message,
      url:url
    })
  }

  open_test(url:string) {
    open(url,"Test")
  }

  update_properties($event: any) {
    this.style_properties=$event;
  }

  async create_account() {
    let email=await _prompt(this,"Création d'un wallet dédié à l'opération","","Indiquer votre adresse email pour recevoir les paramètres du wallet","text","Créer le wallet","Annuler",false)
    this.api.create_account(this.airdrop.network,email,"mail_new_account","mail_existing_account",{},true).subscribe((r:any)=>{
      this.address=r.address;
      this.api.qrcode(this.address,"json").subscribe((r:any)=>{
        this.qrcode_wallet=r.qrcode;
      })

      this.airdrop.dealer_wallet=r.encrypt
      showMessage(this,"Consulter votre mail pour récupérer les informations de votre nouveau wallet",10000)
    })
  }

  update_network($event: any) {
    this.network=$event
    this.airdrop.network=$event.value;
  }

  switch_mode() {
    this.user.advance_mode=!this.user.advance_mode
  }

  async encrypt_key(secret_key="") {
    if(secret_key==""){
      secret_key=await _prompt(this,"La clé privée du wallet de distribution","",this.appname+" à besoin de la clé privée pour pouvoir distribuer les tokens","text","Valider","Annuler",false)
    }
    if(secret_key){
      if(secret_key.length<15 && this.airdrop.network.indexOf("devnet")>-1){
        $$("On recherche la clé au pseudo ",secret_key)
        this.api._get("keys/"+secret_key+"/","network="+this.airdrop.network).subscribe({
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
    this.api._post("affiliated_links/","",{url:this.affiliate_url,airdrop:this.airdrop}).subscribe({
      next:(r:any)=>{
        if(r.message=="ok")
          showMessage(this,"Votre lien est enregistré")
        else
          showMessage(this,r.message)
      },
      error:(err)=>{
        showError(this,err)
      }
    })
  }


  update_token($event: any) {
    this.airdrop.token=$event;
  }

  onEndSearch($event: any[]) {
    if($event.length==0){
      showMessage(this,"Aucune monnaie trouvée dans ce wallet");
      this.api.qrcode(this.address,"json").subscribe((r:any)=>{this.qrcode_wallet=r.qrcode;})
    }
  }

  dealer_wallet_validate(){
    if(this.airdrop.dealer_wallet==""){
      this.restart();
    }else{
      this.find_address_from_encrypt()
    }
  }

  update_dealer_wallet($event: any) {
    this.airdrop.dealer_wallet=$event
    if($event.length>20)this.dealer_wallet_validate();
  }

  eval_redirect() {
    this.connexion.google==this.connexion.email;
    let body:any={
      redirect:this.redirect,
      connexion:this.connexion,
      messages:this.redirect_message,
      network:this.network.value,
      airdrop:this.airdrop
    }

    this.api.create_short_link(body).subscribe({next:(result:any)=>{
        this.short_url=environment.redirect_server+"?"+result.cid;

        this.clipboard.copy(this.short_url);
        this.api.qrcode(this.short_url,"json").subscribe((r:any)=>{
          this.url_qrcode=r.qrcode;
        })

        showMessage(this,"Votre lien est disponible dans le presse-papier")
      },error:(err)=>{showError(this,err)}})
  }

  set_public_wallet($event: any) {
    this.airdrop.dealer_wallet=$event.value;
    this.dealer_wallet_validate();
  }

  async keystore_upload($event:any) {
    let password=await _prompt(this,"Mot de passe associé","","","text","Ok","Annuler",false)
    this.api.encrypte_key("",this.network.value,"","").subscribe({
      next:(r:any)=>{
        this.airdrop.dealer_wallet=r.encrypt
        this.address=r.address;
      }
    })
  }

  update_authent($event: any) {
    this.airdrop.force_authent=$event
  }

  set_into_message($event: any) {
    let recompense=this.airdrop.amount+" "+this.airdrop.token.name
    if($event.index==2)this.intro_tab="Partager le lien suivant pour permettre à celui qui l'ouvre de recevoir "+recompense+" dans la limite de $limit$";
    if($event.index==1)this.intro_tab="Récompenser les personnes visitant le lien "+this.redirect+" par "+recompense+" dans la limite de $limit$";
    if($event.index==0)this.intro_tab="Insérer le code suivant dans votre page pour que chaque visiteur recoive à chaque ouverture "+recompense+" dans la limite de $limit$";
    this.intro_tab=this.intro_tab.replace("$limit$",this.airdrop.limit_by_day+" par jour et "+this.airdrop.limit_by_wallet+" par wallet")
  }

  modify() {
    this.short_url=''
    this.redirect=""
  }
}
