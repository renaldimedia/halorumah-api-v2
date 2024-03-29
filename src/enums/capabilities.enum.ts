export enum capabilities {
    COUNTRY_GETALL = 'COUNTRY_GET_ALL',
    COUNTRY_CREATE = 'COUNTRY_CREATE',
    COUNTRY_UPDATE = 'COUNTRY_UPDATE',
    COUNTRY_DELETE = 'COUNTRY_DELETE',

    PROVINCE_GETALL = 'PROVINCE_GET_ALL',
    PROVINCE_CREATE = 'PROVINCE_CREATE',
    PROVINCE_UPDATE = 'PROVINCE_UPDATE',
    PROVINCE_DELETE = 'PROVINCE_DELETE',

    CITY_GETALL = 'CITY_GET_ALL',
    CITY_CREATE = 'CITY_CREATE',
    CITY_UPDATE = 'CITY_UPDATE',
    CITY_DELETE = 'CITY_DELETE',

    SUBDISTRICT_GETALL = 'SUBDISTRICT_GET_ALL',
    SUBDISTRICT_CREATE = 'SUBDISTRICT_CREATE',
    SUBDISTRICT_UPDATE = 'SUBDISTRICT_UPDATE',
    SUBDISTRICT_DELETE = 'SUBDISTRICT_DELETE',

    FILE_GETALL = 'FILE_GET_ALL',
    FILE_GETSELF = 'MY_FILE',
    FILE_CREATE = 'FILE_CREATE',
    FILE_UPDATE = 'FILE_UPDATE',
    FILE_DELETE = 'FILE_DELETE',

    PROPERTY_CREATE = 'PROPERTY_CREATE',
    PROPERTY_GETALL = 'PROPERTY_GETALL',
    PROPERTY_SELF_DELETE = 'MY_PROPERTY_DELETE',
    PROPERTY_SELF_UPDATE = 'MY_PROPERTY_UPDATE',

    USER_GETALL = 'USER_GET_ALL',
    USER_PROFILE = 'MY_USER',
    USER_CREATE = 'USER_CREATE',
    USER_UPDATE = 'USER_UPDATE',
    USER_DELETE = 'USER_DELETE',
    USER_PACKAGE_TRIAL = 'USER_PACKAGE_TRIAL',
}

export const capabilities_default = [capabilities.COUNTRY_GETALL, capabilities.USER_PROFILE, capabilities.USER_PACKAGE_TRIAL]
