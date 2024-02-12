import { SignJWT, importPKCS8 } from "https://cdnjs.cloudflare.com/ajax/libs/jose/4.14.4/index.bundle.min.js";

const dashboard = 'http://localhost:8224';
const signing_key_file_name = 'signing_key.pkcs8'
const algorithm = 'RS512' // or RS384 or RS256 currently supported

async function loginWithJWTAndIframe(){
    await grabPrivateKeyString(async function (privateKeyString) {
        let privateKey = await importPKCS8(privateKeyString, algorithm);
        const jwt = await createJWT(privateKey, algorithm);
        await initIframe(jwt);
    })
}

async function grabPrivateKeyString(onLoad) {
    const keyFile = new XMLHttpRequest();
    keyFile.open("GET", `keys/${signing_key_file_name}`, true);
    keyFile.onreadystatechange = async function() {
        if (keyFile.readyState === 4 && keyFile.status === 200) {
            const keyText = keyFile.responseText;
            onLoad(keyText);
        }
    }
    await keyFile.send();
}

async function createJWT(privateKey, algorithm){
    /* Supported claims are
        usercode: https://www.panintelligence.com/claims/usercode
        email: https://www.panintelligence.com/claims/email
        userSyncPayload: https://www.panintelligence.com/userSyncPayload
    */
    return new SignJWT(
        {
        'https://www.panintelligence.com/claims/email': 'jwt@auth.com',
        'https://www.panintelligence.com/claims/usercode': 'JWTAUTH',

        // 'https://www.panintelligence.com/claims/userSyncPayload': 
        //     [{
        //         "user": {
        //             "editCategories": true,
        //             "saveFilters": false,
        //             "applySavedFilters": false,
        //             "enableDebugging": false,
        //             "collaborate": false,
        //             "userExpirationDate": null,
        //             "editUserAccess": false,
        //             "forenames": "Jwt",
        //             "editOwnStylesheet": false,
        //             "anonymousCharts": false,
        //             "editSql": false,
        //             "editChartStyles": false,
        //             "logoutEnabled": true,
        //             "ownerOrgIdentifier": "Dashboard",
        //             "usercode": "JWTAUTH",
        //             "lite": false,
        //             "accessAccount": true,
        //             "exportToPpt": false,
        //             "editOwnPassword": true,
        //             "editUsers": false,
        //             "editServerSettings": false,
        //             "editReports": false,
        //             "exportToCsv": false,
        //             "exportToWord": false,
        //             "carouselForCategory": false,
        //             "canViewChartEmbeddingLink": false,
        //             "editVariables": false,
        //             "userTypeId": 0,
        //             "parentIdentifier": "ADMIN",
        //             "subscription": false,
        //             "editConnections": false,
        //             "orgId": 1,
        //             "displayDisabledButtons": false,
        //             "enableWarnings": false,
        //             "audit": true,
        //             "surname": "Auth",
        //             "editThemes": false,
        //             "modifyLayouts": false,
        //             "editRoles": false,
        //             "email": "jwt@auth.com",
        //             "editCharts": false,
        //             "displayChartInfo": false,
        //             "saveLayouts": false,
        //             "orgIdentifier": "Dashboard",
        //             "clientEnabled": true,
        //             "canViewChartInfoDetails": false,
        //             "readableUserCode": "Jwtauth",
        //             "parentId": 1,
        //             "exportToExcel": false,
        //             "schedule": false,
        //             "themeName": "piBerry",
        //             "pdf": true,
        //             "carouselForDashboard": false,
        //             "ownerOrgId": 1,
        //             "superAdmin": false,
        //             "scheduleToEmail": false,
        //             "allowExternalLogin": true,
        //             "orgAdmin": false,
        //             "canLogInAsAnotherUser": false,
        //             "allowPasswordLogin": false,
        //             "requireMfa": false,
        //             "passwordExpired": false,
        //             "clientExcludePasswordExpiry": true
        //         },
        //         "variables": [],
        //         "restrictions": [],
        //         "userRoles": [],
        //         "userCategories": []
        //     }]
        }
    )
        .setProtectedHeader({alg: algorithm})
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(privateKey);
}

async function initIframe(jwt){
    document.getElementById("dashboardIframe").src = `${dashboard}/pi/?jwt=${jwt}`
}

loginWithJWTAndIframe();


