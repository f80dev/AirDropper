import {AfterViewInit, Component} from '@angular/core';
import {Connexion} from "../../operation";
import {ActivatedRoute} from "@angular/router";
import {getParams} from "../../tools";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
    authent: Connexion={
        address: false,
        direct_connect: false,
        email: true,
        extension_wallet: true,
        google: true,
        nfluent_wallet_connect: false,
        on_device: false,
        wallet_connect: true,
        web_wallet: false,
        webcam: false
    }

    constructor(public routes:ActivatedRoute) {
    }

    login($event: { strong: boolean; address: string; provider: any }) {
        window.parent.postMessage({address:$event.address},"*")
    }

    cancel() {
        window.parent.postMessage({address:"cancel"},"*")
    }

    async ngAfterViewInit() {
        let params:any=await getParams(this.routes)
        this.authent=params.authent
    }
}
