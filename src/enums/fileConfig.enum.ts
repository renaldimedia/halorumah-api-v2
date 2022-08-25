export const defaultImageSize = {
    default: "",
    thumbnail: "",
    small: "",
    medium: "",
    large: "",
    xl: ""
}
export const fileConfig = <const>{
    IMAGE : {
        type: ['image'],
        unitSize: 'px',
        size: {
            default: {
                width: 1200,
                height: 1200
            },
            thumbnail: {
                width: 150,
                height: 150
            },
            small: {
                width: 300,
                height: 300
            },
            medium: {
                width: 700,
                height: 700
            },
            large: {
                width: 1200,
                height: 1200
            },
            xl: {
                width: 2400,
                height: 2400
            }
        }
    },
    DOC: {
        type: ['docx', 'pdf'],
        unit: 'kb',
        size: {
            default: 2000
        }
    }
}

export const profileImgConfig = <const>{
    type: ['image/jpeg'],
    unitSize: fileConfig.IMAGE.unitSize,
    size: {
        default: fileConfig.IMAGE.size.small,
        thumbnail: fileConfig.IMAGE.size.thumbnail,
        small: fileConfig.IMAGE.size.small,
        medium: fileConfig.IMAGE.size.medium,
        large: fileConfig.IMAGE.size.medium,
        xl: fileConfig.IMAGE.size.medium
    }
}