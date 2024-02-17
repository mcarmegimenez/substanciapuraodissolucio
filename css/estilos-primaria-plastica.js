styles = {
//GENERALES
    backgroundColor: "#FFFFFF",
    baseColor1: "#B9E6EB",
    baseColor2: "#49BCC4",
    baseColor3: "#0099A1",
    complementaryColor: "#E2007A",
    fontFamily: "SourceSansProRegular",
    fontFamilySymbol: "smsymbolregular",
    fontFamilyBold: "SourceSansProBold",
    fontSize: 16,
    fontColor: "#333333",
    fontLineHeight: 19, //separacion de lineas de texto
    roundBorder: 8, //redondeado de objetos por defecto
    roundSmallBorder: 5, //Redondeado para los objetos menores de 28px de ancho/alto    
    paddingTop: 20, //Distancia de los objetos hasta la cabecera
    distanceBetweenObjects: 7, //Distancia entre controles en pantalla
        
//CABECERA
    headerSM: {
        logoSM: "logo",
        objectDistanceBorder: 17,
        icon: "icon",
        iconDistanceLeft: 12,
        backgroundColor: "#B9E6EB",
        fontFamily: "SourceSansProRegular",
        fontSize: 18,
        fontColor: "#333333",
        simple: false, //Indica si es con pastilla (se usara height) o simple tamaño de 7px
        height: 65, // Tamaño con pastilla            
        minHeight: 7, //Habrá veces que no se muestre la pastilla y se sustituirá por una banda de 7 px del mismo color.
    },
            
//FOOTER
    footerSM: {
        backgroundColor: "#B9E6EB",
        height: 7,        
    },
    
//CHECKBOX
    checkBox: {
        fontSize: 16,        
        fontColor: "#333333",        
        backgroundColor: "#FFFFFF",
        borderColor: "#4ABDC4",
        roundBorder: 8,        
        height: 48,
        outterCircleSize: 30,
        outterCircleBorderSize: 5,
        innerCircleSize: 19,
        outterCircleDistanceBorder: 10,
        titleOffsetToCircle: 10,
        drawBackgroundShape: true,
    },
    
//BOTONES
    //Rectangulares simples
    button: {
        topLeftRoundBorder: 8, 
        topRightRoundBorder: 8,
        bottomLeftRoundBorder: 8,
        bottomRightRoundBorder: 8,
        buttonHeight: 32,
        backgroundColor: "#49BCC4", 
        backgroundColorHover: "#0099A1", 
        backgroundColorDisabled: "#D7D7D7", 
        borderColor: "#DFDFDF",
        borderSize: 0,
        fontFamily: "SourceSansProRegular",
        fontSize: 16,        
        fontColor: "#FFFFFF", 
        fontColorDisabled: "#B7B7B7", 
    },
    
    //Redondos (pistas)
    imageRoundButton: {
        backgroundColor: "#49BCC4", 
        backgroundColorHover: "#0099A1", 
        backgroundColorDisabled: "#D7D7D7",  
        borderColor: "#FFFFCC",
        borderSize: 3,
        fontFamily: "smsymbolregular",
        fontSize: 38,        
        fontColor: "#FFFFFF", 
        fontColorDisabled: "#FFFFFF", 
        radius: 28,
    },
    
//BARRA NAVEGACION
    navigationBar: {
        fontSize: 18,        
        size: 32,
        offset: 3,
        objectDistanceBorder: 12,
        titleFontColor: "#000000",
        buttonLeft: {
            topLeftRoundBorder: 8, 
            topRightRoundBorder: 8,
            bottomLeftRoundBorder: 8,
            bottomRightRoundBorder: 8, 
            backgroundColor: "#999999", 
            backgroundColorHover: "#0099A1", 
            backgroundColorDisabled: "#D7D7D7", 
            fontFamily: "smsymbolregular",
            fontSize: 16,        
            fontColor: "#FFFFFF", 
            fontColorDisabled: "#B7B7B7", 
        },
        buttonCenter: {
            topLeftRoundBorder: 8, 
            topRightRoundBorder: 8,
            bottomLeftRoundBorder: 8,
            bottomRightRoundBorder: 8, 
            backgroundColor: "#999999", 
            backgroundColorHover: "#999999", 
            backgroundColorDisabled: "#999999", 
            fontFamily: "smsymbolregular",
            fontSize: 16,        
            fontColor: "#FFFFFF", 
            fontColorDisabled: "#FFFFFF",             
        },
        buttonRight: {
            topLeftRoundBorder: 8, 
            topRightRoundBorder: 8,
            bottomLeftRoundBorder: 8,
            bottomRightRoundBorder: 8, 
            backgroundColor: "#999999", 
            backgroundColorHover: "#0099A1", 
            backgroundColorDisabled: "#D7D7D7", 
            fontFamily: "smsymbolregular",
            fontSize: 16,        
            fontColor: "#FFFFFF", 
            fontColorDisabled: "#B7B7B7",              
        },
    },
    
//BARRA SELECCIÓN
    selectionBar: {
        buttonSize: 32,
        offset: 5,
        button: {
            topLeftRoundBorder: 16,
            topRightRoundBorder: 16,
            bottomLeftRoundBorder: 16,
            bottomRightRoundBorder: 16,
            backgroundColor: "#999999",
            backgroundColorHover: "#0099A1",
            backgroundColorDisabled: "#D7D7D7",
            fontFamily: "smsymbolregular",
            fontSize: 16,
            fontColor: "#FFFFFF",
            fontColorDisabled: "#B7B7B7",
        }, 
    },
    
//CARTELA INFO
    infoPopupBig: {
        fontSize: 18,        
        fontColor: "#000000",
        backgroundColor: "#FFF8C9",
        borderComplete: false,
        borderSize: 1,
        roundBorder: 0,
        hasTopBorder: true,
        hasBottomBorder: true,
        borderColor: "#FFD500",
        offset: 10,
    },

//BOCADILLO
    speechBubble: {
        backgroundColor: "#FFFFFF",
        borderSize: 2,
        borderColor: "#757575",
        roundBorder: 5,
        triangleSize: 10,
    },
    
    //GRID
    grid: {
        borderShapeColor: "#000000",
        shapeColor: "#FFFFFF"
    },
    
    //TECLADO
    keyboard:
    {
        opacity: 0.8,
        buttonSize: 32,
        buttonRoundBorder: 8,

        buttonAlpha: {
            borderColor: "#FFD500",
            backgroundColor: "#FFEC8C",
            backgroundColorHover: "#F6A800",
            backgroundColorDisabled: "#FF6600",
            shadowSize: 3,
            shadowColor: "#000000",
            fontFamily: "SourceSansProRegular",
            fontSize: 16,
            fontColor: "#333333",
            fontColorDisabled: "#B7B7B7",            
        },

        buttonNumeric: {
            borderColor: "#FFD500",
            backgroundColor: "#EFD347",
            backgroundColorHover: "#F6A800",
            backgroundColorDisabled: "#33CC00",
            shadowSize: 3,
            shadowColor: "#000000",
            fontFamily: "SourceSansProRegular",
            fontSize: 16,
            fontColor: "#333333",
            fontColorDisabled: "#B7B7B7",
        },

        buttonSymbol: {
            borderColor: "#FFD500",
            backgroundColor: "#DEBD19",
            backgroundColorHover: "#F6A800",
            backgroundColorDisabled: "#33CC00",            
            shadowSize: 3,
            shadowColor: "#000000",
            fontFamily: "SourceSansProRegular",
            fontSize: 16,
            fontColor: "#333333",
            fontColorDisabled: "#B7B7B7",
        },
        
        buttonSpecial: {
            borderColor: "#FFD500",
            backgroundColor: "#DEBD19",
            backgroundColorHover: "#F6A800",
            backgroundColorDisabled: "#33CC00",            
            shadowSize: 3,
            shadowColor: "#000000",
            fontFamily: "smsymbolregular",
            fontSize: 25,
            fontColor: "#333333",
            fontColorDisabled: "#B7B7B7",
        }         
    },
    
    // KARAOKES
    karaoke: {
        mainMenu: {
            button: {
                topLeftRoundBorder: 8, 
                topRightRoundBorder: 8,
                bottomLeftRoundBorder: 8,
                bottomRightRoundBorder: 8,
                buttonHeight: 32,
                backgroundColor: "#49BCC4", 
                backgroundColorHover: "#0099A1", 
                backgroundColorDisabled: "#D7D7D7", 
                fontFamily: "SourceSansProBold",
                fontSize: 24,        
                fontColor: "#FFFFFF", 
                fontColorDisabled: "#B7B7B7", 
            },            
        },
        lyrics: {
            gradientColor: "#0099A1",
            fontFamily: "SourceSansProBold",
            fontSize: 28,
            fontColor: "#FFFFFF",
            box: {
                backgroundColor: "#49BCC4",
                borderColor: "#0099A1",
            },
        },
        backButton: {
                topLeftRoundBorder: 8, 
                topRightRoundBorder: 8,
                bottomLeftRoundBorder: 8,
                bottomRightRoundBorder: 8,
                buttonHeight: 32,
                backgroundColor: "#49BCC4", 
                backgroundColorHover: "#0099A1", 
                backgroundColorDisabled: "#D7D7D7", 
                fontFamily: "SourceSansProBold",
                fontSize: 24,        
                fontColor: "#FFFFFF", 
                fontColorDisabled: "#B7B7B7", 
            }, 
        buttonGroup1: {
            backgroundColor: "#007AFF",
            borderColor: "#9B599B",
        },
        buttonGroup2: {
            backgroundColor: "#FF0000",
            borderColor: "#9B599B",
        },  
        noteColor: "#0099A1",
    },
    
    // MEDIACONTROLBAR
    mediaControlBar: {
        height: 40,
        roundCorners: 7,
        color1: "#49BCC4",
        color2: "#0099A1",
        color3: "#FFFFFF",
        fontSize: 26,
    },
};
