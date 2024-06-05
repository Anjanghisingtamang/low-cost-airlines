export enum EnumErrorCode {
    "error_500" = "Error-InternalServerError",
	"error_519" = "Error-UploadedFileInfected",
	"error_520" = "Error-UploadedFileDifferent",
    "error_422" = "Error-InvalidIdentifier",
    "error_424" = "Error-DependencyExists",    
    "error_403" = "Error-Forbidden",
    "error_404" = "Error-ResourceNotFound",
    "error_409" = "Error-Duplicate",
    "error_401" = "Error-Unauthorized",
    "error_402" = "Error-InvalidPassCode",
    "error_400" = "Error-BadRequest",
    "error_405" = "Error-InsufficientPrivilage",
    "error_408" = "Error-RequestTimeout",
    "error_440" = "Error-SessionExpired",
    "error_429" = "Error-RetryCountExceeded",
    "error_4291" = "Error-PasswordChangeTimeout",
    "error_410" = "Error-PasswordResetLinkExpired",
    "error_4091" = "Error-PasswordResetLinkAlreadyUsed", //409 for password
    "error_4092" = "Error-EmailDuplicate", // username or email exists/duplicate
    "error_4094" = "Error-UsernameDuplicate",
    "error_415" = "Error-UnsuppportMediaType", // for  
    "error_413" = "Error-PayLoadToLarge"
}