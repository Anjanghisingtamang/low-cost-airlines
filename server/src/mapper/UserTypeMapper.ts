
export class UserTypeMapper{
    async ModeltoDTO(models:any): Promise<any>
    {
        let dtos: any = models.map(m=>{
            let dto:any = {
                UserTypeId: m.guid,
                UserTypeName:m.usertypename,
                DateCreated: m.datecreated ? m.datecreated:null,
                DateModified: m.datemodified ? m.datemodified: null
            };
            return dto;
        });
        return dtos;
    }
}