import { Password, Saltkey } from "../AppConfig";
import { UserTypeService } from "../services/UserTypeService";
const common = require("../common/CommonHelper");
export class UserMapper {
    async ModeltoDTO(models: any): Promise<any> {
        let dtos: any = models.map(m => {
            let dto: any = {
                UserId: m.guid,
                UserName: m.username,
                FirstName: m.firstname,
                MiddleName: m.middlename,
                LastName: m.lastname,
                DateOfBirth: m.dateofbirth,
                EmailAddress: m.emailaddress,
                Country: m.country,
                PhoneNumber: m.phonenumber,
                MobileNumber: m.mobilenumber,
                DateCreated: m.datecreated ? m.datecreated : null,
                DateModified: m.datemodified ? m.datemodified : null,
                UserType: m.usertype
            };
            return dto;
        });
        return dtos;
    }

    async ModeltoDTOSingle(model: any, context: any): Promise<any> {
        let dto = {
            UserId: model?.guid,
            UserName: model?.username,
            FirstName: model?.firstname,
            MiddleName: model?.middlename,
            LastName: model?.lastname,
            DateOfBirth: model?.dateofbirth,
            EmailAddress: model?.emailaddress,
            PhoneNumber: model?.phonenumber,
            MobileNumber: model?.mobilenumber,
            PassportNumber: model?.passport_number,
            PassportExpieryDate: model?.passport_expiry,
            Country: model?.country,
            RetryCount: model?.retrycount,
            DateCreated: model?.datecreated ? model.datecreated : null,
            DateModified: model?.datemodified ? model.datemodified : null,
            UserType: model?.usertype

        }
        return dto;
    }

    async DTOtoModel(dto: any, addedUsertype: any, context: any) {


        let model: any = {
            username: dto.UserName ? dto.UserName : null,
            firstname: dto.FirstName ? dto.FirstName : null,
            middlename: dto.MiddleName ? dto.MiddleName : null,
            lastname: dto.LastName ? dto.LastName : null,
            dateofbirth: dto.DateOfBirth ? dto.DateOfBirth : null,
            emailaddress: dto.EmailAddress ? dto.EmailAddress : null,
            phonenumber: dto.PhoneNumber ? dto.PhoneNumber : null,
            mobilenumber: dto.MobileNumber ? dto.MobileNumber : null,
            passport_number: dto.PassportNumber ? dto.PassportNumber : null,
            passport_expiry: dto.PassportExpieryDate ? dto.PassportExpieryDate : null,
            country: dto.Country ? dto.Country : null,
            password: null,
            salt: null,
            usertypeid: addedUsertype?.usertypeid,
        }

        if(dto.userid){
            model.userid = dto.UserId
        }

        if (dto.Password != null) {
            let saltKey: string = Saltkey;
            let hashedPassword: string = common.HashPassword(saltKey, dto.Password);
            model.password = hashedPassword;
            model.salt = saltKey;
        }

        return model;
    }

    //     // async ResetPasswordMapper(dto:any)
    //     // {
    //     //     if(dto.NewPassword === dto.ConfirmPassword && dto.IsDefaultPassword)
    //     //     {
    //     //         let model:any = {};
    //     //         let saltKey:string = Saltkey;
    //     //         let hashedPassword:string = common.HashPassword(saltKey, dto.NewPassword);

    //     //         model.password = hashedPassword;
    //     //         model.salt = saltKey;
    //     //         model.isdefaultpassword = '0';

    //     //         return model;
    //     //     }
    //     // }
    // //{"FirstName":"","MiddleName":"","LastName":"","MobileNumber":"","EmailAddress":"","UserName":"","Password":"admin12","RoleId":"c87dfb05-5020-4dd4-8357-6ffaae1b316d","UserTypeId":"9e9cca25-a83f-4726-9ac9-41f7441b04e2"}
    //     async DTOtoModels(dto:any,context:any){
    //         let userTypeService = new UserTypeService(context);
    //         let roleService = new RoleService(context);


    //         let model: any ={}

    //         if(dto.FirstName!=''){
    //             model.firstname  = dto.FirstName
    //         }
    //         if(dto.MiddleName!=''){
    //             model.middlename  = dto.MiddleName
    //         }
    //         if(dto.LastName!=''){
    //             model.lastname  = dto.LastName
    //         }
    //         if(dto.MobileNumber!=''){
    //             model.mobilenumber  = dto.MobileNumber
    //         }
    //         if(dto.EmailAddress!=''){
    //             model.emailaddress  = dto.EmailAddress
    //         }
    //         if(dto.UserName!=''){
    //             model.username  = dto.UserName
    //         }
    //         if(dto.UserTypeId!=''){
    //             let userType :any = await userTypeService.loadByGuid(dto.UserTypeId)

    //             model.usertypeid  = userType.usertypeid
    //         }

    //         if(dto.Password != '')
    //         {
    //             let saltKey: string = Saltkey;
    //             let hashedPassword: string = common.HashPassword(saltKey, dto.password);
    //             model.password = hashedPassword;
    //             model.salt = saltKey;
    //             return model;
    //         }
    //     }
}