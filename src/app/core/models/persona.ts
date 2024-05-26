import { Ubigeo } from './ubigeo';

export interface Person {

    address : string;
    age : number;
    birthAddress : string;
    birthDate : Date
    birthLevel1Id : number;
    birthLevel2Id : number;
    birthLevel3Id : number;
    birthLevel4Id : number;
    birthUbigeo : Ubigeo;
    birthUbigeoId : number;
    branchId : number;
    civilStatusId : number;
    civilStatusName : string;
    className : string;
    code : string;
    codePostulant : string;
    codeWorker : string;
    coderef : string;
    created : Date;
    createdby : string;
    cvId : string;
    cvUrlViewer : string;
    dead : boolean;
    description : string;
    docTypeId : number;
    docTypeName : string;
    email : string;
    email1 : string;
    firstName : string;
    genderId : number;
    genderName : string;
    hasActivities : boolean;
    hasAlerts : boolean;
    hasCV : boolean;
    hasCurrentHiring : boolean;
    hasCurrentPostulation : boolean;
    hasDocuments : boolean;
    hasPhoto : boolean;
    hirings : string;
    id : number;
    isActive : boolean;
    isExternal : boolean;
    isRelevant : boolean;
    isResident : boolean;
    lastMatName : string;
    lastPatName : string;
    latitude : number;
    level1Id : number;
    level2Id : number;
    level3Id : number;
    level4Id : number;
    licenceNumber : string;
    licenceTypeId : number;
    licenceTypeName : string;
    longitude : number;
    middleName : string;
    modified : Date;
    modifiedby : string;
    name : string;
    numdoc : string;
    objectType : string;
    phoneNumber : string;
    postulations : string;
    reference : string;
    shortName : string;
    telephoneNumber : string;
    ubigeo : Ubigeo;
    ubigeoId : number;
    updatePhoto : string;
    url_large : string;
    url_medium : string;
    url_mini : string;
    uuid : string;
    version : number;
}