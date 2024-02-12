# Login with JWT

## Setup
- Setup trusted hosts in your Dashboard to allow embedding from "http://localhost:8081"
- You will need keys to use for signing the JWT. You can use the 'keys/createKeys.sh' script in this repository to generate some if needed. Otherwise, add the public and private keys you wish to use to the 'keys' directory in this repository
- Add the public key, with the header and footer stripped to the Dashboard on the Admin screen. If you generated the keys using the createKeys.sh script, this file will be called 'signing_key.pub'
- Modify 'auth.js' as needed for your setup. This includes:
    - Checking that the 'dashboard' variable points to the URL of your running Dashboard instance
    - If your keys weren't generated using the included script, ensure that the 'algorithm' variable matches that required by your key (RS512, RS384, and RS256 are currently supported) and that the 'signing_key_file_name' variable matches the file name of your private key
    - Setting up the claims (see section below)

### Setting up claims
The following three claims are currently supported:
- Email: https://www.panintelligence.com/claims/email
- Usercode: https://www.panintelligence.com/claims/usercode
- UserSyncPayload: https://www.panintelligence.com/claims/userSyncPayload - this claim is used in relation to the 'Auto User Generation feature' and can be ignored for normal login. A commented out example is included in the 'auth.js' file and can be uncommented and modified should you wish to demo this feature

The usercode and email claims are used to determine which user you are logging in as. The email claim will only be used if the usercode claim is not provided as the latter takes higher priority.

## Running the demo
To run the demo, execute the run.sh script. It uses npx to launch a webserver at "localhost:8081". If all the setup is correct, when you navigate to this location on your browser you should be logged in to the Dashboard as the user defined in the claims. If using the 'userSyncPayload' claim, this includes the creation of the user defined in the 

## Important Notes
- Don't expose your private key in production, it needs to be kept secret!
- This is just an example setup, the JWT creation code would typically be run server-side
