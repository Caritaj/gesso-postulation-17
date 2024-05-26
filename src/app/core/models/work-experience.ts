export interface WorkExperience {

    id : number;
    created : Date;
    modified : Date;
    uuid : string;
    version : number;
    branchId : number;
    hasActivities : boolean;
    hasDocuments : boolean;
    hasAlerts : boolean;
    hasPhoto : boolean;
    updatePhoto : string;
    className : string;
    objectType : string;
    code : string;
    createdby : string;
    modifiedby : string;
    areaId : number;
    areaName : string;
    companyId : number;
    companyRuc : string;
    companyName : string;
    description : string;
    typeId : number;
    typeName : string;
    positionId : number;
    positionName : string;
    start_date : string;
    end_date : string;
    termination_date : Date;
    current : Date;
    personId : number;
    contractNumber : string;
    contractTypeId : number;
    contractTypeName : string;

}