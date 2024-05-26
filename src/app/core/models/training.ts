export interface Training {

    id : number;
    created : Date;
    modified : Date;
    uuid : string;
    version : number;
    branchId : number;
    hasActivities : boolean;
    hasDocuments :  boolean;
    hasAlerts :  boolean;
    hasPhoto :  boolean;
    updatePhoto :  boolean;
    className :  string;
    objectType : string;
    code : string;
    createdby : string;
    modifiedby : string;
    typeId : number;
    description : string;
    levelId : number;
    institution : string;
    date_start : Date;
    date_end : Date;
    personId : number;
    hours : number;
    is_internal : boolean;

}