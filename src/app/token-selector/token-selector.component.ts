import {AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {NetworkService} from "../network.service";
import {$$} from "../../tools";
import {wait_message} from "../hourglass/hourglass.component";

const BACKUP_IMG="https://tokenforge.nfluent.io/assets/icons/egld-token-logo.webp"

@Component({
  selector: 'app-token-selector',
  templateUrl: './token-selector.component.html',
  styleUrls: ['./token-selector.component.css']
})
export class TokenSelectorComponent implements OnChanges,AfterViewInit {
  @Input() network:string="elrond-devnet"
  @Input() filter:string=""
  @Input() type:string="Fungible";
  @Input() size:string="40px";
  @Input("value") sel_token: any
  @Input() label="Sélectionner un token"
  @Input() with_detail=false
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  tokens:any[]=[]
  @Input() show_detail: boolean=true;
  message: string="";

  constructor(
      public api:NetworkService
  ) {
    this.reset();
  }

  ngAfterViewInit(): void {

    }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["network"] || changes["filter"]){
      wait_message(this,"Recherche des monnaies")
      setTimeout(()=>{this.refresh();},1500);
    }
    if(!this.sel_token){
      this.sel_token={id:""}
    }
    if(typeof(this.sel_token)=="string"){
      this.sel_token={
        "id":this.sel_token,
        image:BACKUP_IMG,
        name:this.sel_token
      }
      // for(let t of this.tokens){
      //   if(t.id==this.sel_token)this.sel_token=t;
      // }
    }
  }


  refresh() : void {
    if(!this.filter)this.filter="";
    if(this.network=="")return
    wait_message(this,"Recherche des monnaies")
    this.api.find_tokens(this.network,this.filter,this.with_detail).subscribe({next:(tokens:any[])=>{
        this.tokens=[];
        wait_message(this);
        for(let t of tokens){
          t["label"]=t["name"]
          if(t["balance"]!="")t["label"]=t["label"]+" ("+t["balance"]+")"
          this.tokens.push(t)
        }
      }
    })
  }

  update_sel($event: any) {
    this.sel_token=$event
    this.valueChange.emit($event)
  }

  reset() {
    this.update_sel({id:''})
    this.refresh();
  }
}