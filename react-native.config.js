module.exports = { 
    dependencies: { 
        'tipsi-stripe': 
        { 
            platforms: { android: null, ios: null, } 
        } 
    }, 
    project: {
        ios: {},
        android: {}, // grouped into "project"
      },
      assets: ["./src/assets/fonts/"], // stays the same
};