// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {newCryptoKey} from "../tools";

export const environment = {
    production: true,
    forum:"https://discord.gg/BfC2E2ent",
    mail:"contact@nfluent.io",
    version: "0.1dev",
    faqs:"{{domain_appli}}/assets/faqs.yaml",
    appname:"AirDropper",
    networks:"elrond-devnet,elrond-mainnet",
    visual:"./assets/coffre.jpg",
    claim:"Valoriser vos contenus en quelques clics",

    company:"nfluent",
    server:"https://api.nfluent.io:4242",
    redirect_server:"https://s.f80.fr",
    appli:"https://s.f80.fr",
    website:"https://nfluent.io",
    style:"nfluent-dark.css",
    background:"./assets/wood.jpg",
    logo:"./assets/icons/icon_nfluent_256.png",
    default_bank:"https://tokenforge.nfluent.io/bank",
    histo:"db-server-nfluent",

    merchant:{
        id:"BCR2DN4TYD4Z5XCR",
        name:"NFluenT",
        currency:"EUR",
        country:"FR",
        contact:"contact@nfluent.io",
        wallet:
            {
                token:"NFLUCOIN-4921ed",
                address:"erd1gkd6f8wm79v3fsyyklp2qkhq0eek28cnr4jhj9h87zwqxwdz7uwstdzj3m",
                network:"elrond-devnet",
                unity: "NfluCoint",
                bank: "nfluent: Z0FBQUFBQmtYUjJVbS1Uc0lpa2FTR2F0SnF4LW1HUHIzbHFKN2hCVmRPN3NRR1R3Wk4tUnhfcUxqUE9IQVdObzMxMHgtazhrT1hpWXVndENZallGNnI1Q2RTLVQ1N2d0TEQ2dHNmVlByV3B0RlR3SUMxejhKMHZUeVJ3NHl6dnNFNEIyZWk2eGZsS1hWU2FuQnljcGRDUEh4WFhSMTBRTFFLdHkxeTJuUjZxYWRRc1dVN2FqYlZzPQ==",
                title:"La banque de NFluent",
                refund: 5
            }
    },

    dictionnary: {
        "en": {
            "Délivrer un message":"Show a message",
            "Eliligibilités: Possèder un NFT/SFT": "",
            "Lien a raccourcir": "Link to short",
            "Nom d'une collection": "Collection name",
            "Sélectionner une collection": "Select a collection",
            "Chercher": "Find",
            "Réseau": "Network",
            "Coller":"Paste",
            "Le premier NFT de cette collection": "First NFT of this collection",
            "Créer le lien":"Build the link",
            "Lien pour acquérir un NFT":"Link to buy the required NFT"
        }
    }
};



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
