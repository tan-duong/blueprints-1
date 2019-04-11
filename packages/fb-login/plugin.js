// Ignite CLI plugin for Prototype
// ----------------------------------------------------------------------------

const NPM_MODULE_NAME = "react-native-fbsdk"
const NPM_MODULE_VERSION = "0.8.0"

const PLUGIN_PATH = __dirname
const APP_PATH = process.cwd()
let YOUR_PROJECT_NAME = 'YOUR_PROJECT_NAME' 
let YOUR_COMPANY_NAME = 'YOUR_COMPANY_NAME'
let YOUR_FB_APP_ID = 'YOUR_FB_APP_ID'
let YOUR_FB_APP_NAME = 'YOUR_FB_APP_NAME'

const EXAMPLE_FILE = "PrototypeExample.js.ejs"

const add = async function(context) {
  // Learn more about context: https://infinitered.github.io/gluegun/#/context-api.md
  const { ignite, filesystem, parameters } = context

  YOUR_PROJECT_NAME = parameters.options.project && parameters.options.project
  YOUR_COMPANY_NAME = parameters.options.com && parameters.options.com
  YOUR_FB_APP_ID = parameters.options.fbappid && parameters.options.fbappid
  YOUR_FB_APP_NAME = parameters.options.fbappname && parameters.options.fbappname

  // install an NPM module and link it
  await ignite.addModule(NPM_MODULE_NAME, {
    link: true,
    version: NPM_MODULE_VERSION
  })

  /**
   * Configure android project
   */

  ignite.patchInFile(`${APP_PATH}/android/app/src/main/java/com/${YOUR_COMPANY_NAME}/${YOUR_PROJECT_NAME}/MainApplication.java`, {
    insert: `
    import com.facebook.CallbackManager;
    import com.facebook.FacebookSdk;
    //import com.facebook.reactnative.androidsdk.FBSDKPackage;
    import com.facebook.appevents.AppEventsLogger;`,
    before: `import java.util.Arrays;`
  })

  ignite.patchInFile(`${APP_PATH}/android/app/src/main/java/com/${YOUR_COMPANY_NAME}/${YOUR_PROJECT_NAME}/MainApplication.java`, {
    insert: `
    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }`,
    before: `private final ReactNativeHost`
  })

  ignite.patchInFile(`${APP_PATH}/android/app/src/main/java/com/${YOUR_COMPANY_NAME}/${YOUR_PROJECT_NAME}/MainApplication.java`, {
    insert: `
    new FBSDKPackage(mCallbackManager)`,
    after: `new MainReactPackage()`
  })

  ignite.patchInFile(`${APP_PATH}/android/app/src/main/java/com/${YOUR_COMPANY_NAME}/${YOUR_PROJECT_NAME}/MainActivity.java`, {
    insert: `
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }
    `,
    before: `@Override`
  })


  // ignite.patchInFile(`${APP_PATH}/android/settings.gradle`, {
  //   insert: `include ':react-native-fbsdk'
  //   project(':react-native-fbsdk').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-fbsdk/android')`,
  //   before: `include ':app'`
  // })


  ignite.patchInFile(`${APP_PATH}/android/app/build.gradle`, {
    insert: `
    implementation 'com.facebook.android:facebook-android-sdk:4.34.0'
    //implementation project(':react-native-fbsdk')`,
    after: `dependencies {`
  })


  ignite.patchInFile(`${APP_PATH}/android/app/src/main/res/values/strings.xml`, {
    insert: `
    <string name="facebook_app_id">${YOUR_FB_APP_ID}</string>
    <string name="fb_login_protocol_scheme">fb${YOUR_FB_APP_ID}</string>`,
    before: `</resources>`
  })

  ignite.patchInFile(`${APP_PATH}/android/app/src/main/AndroidManifest.xml`, {
    insert: `
    <provider android:authorities="com.facebook.app.FacebookContentProvider${YOUR_FB_APP_ID}"
    android:name="com.facebook.FacebookContentProvider"
    android:exported="true" />

    <meta-data android:name="com.facebook.sdk.ApplicationId" 
      android:value="@string/facebook_app_id"/>

    <activity android:name="com.facebook.FacebookActivity"
      android:configChanges=
              "keyboard|keyboardHidden|screenLayout|screenSize|orientation"
      android:label="@string/app_name" />
    <activity
      android:name="com.facebook.CustomTabActivity"
      android:exported="true">
      <intent-filter>
          <action android:name="android.intent.action.VIEW" />
          <category android:name="android.intent.category.DEFAULT" />
          <category android:name="android.intent.category.BROWSABLE" />
          <data android:scheme="@string/fb_login_protocol_scheme" />
      </intent-filter>
    </activity>`,
    before: `</application>`
  })

  /**
   * Configure xcode project
   */
  ignite.patchInFile(`${APP_PATH}/ios/Podfile`, {
    insert: `
    pod 'FBSDKCoreKit', '~> 4.41.0'
    pod 'FBSDKLoginKit', '~> 4.41.0'
    pod 'FBSDKShareKit', '~> 4.41.0'`,
    before: `end`
  })

  ignite.patchInFile(`${APP_PATH}/ios/${YOUR_PROJECT_NAME}/Info.plist`, {
    insert: `
    <key>CFBundleURLTypes</key>
    <array>
      <dict>
        <key>CFBundleURLSchemes</key>
        <array>
          <string>fb${YOUR_FB_APP_ID}</string>
        </array>
      </dict>
    </array>
    <key>FacebookAppID</key>
    <string>${YOUR_FB_APP_ID}</string>
    <key>FacebookDisplayName</key>
    <string>${YOUR_FB_APP_NAME}</string>
    <key>LSApplicationQueriesSchemes</key>
    <array>
      <string>fbapi</string>
      <string>fb-messenger-share-api</string>
      <string>fbauth2</string>
      <string>fbshareextension</string>
    </array>`,
    before: `</dict>`
  })

  ignite.patchInFile(`${APP_PATH}/ios/${YOUR_PROJECT_NAME}/AppDelegate.m`, {
    insert: `#import <FBSDKCoreKit/FBSDKCoreKit.h>`,
    before: `#import <Firebase.h>`
  })

  ignite.patchInFile(`${APP_PATH}/ios/${YOUR_PROJECT_NAME}/AppDelegate.m`, {
    insert: `
    [[FBSDKApplicationDelegate sharedInstance] application:application
    didFinishLaunchingWithOptions:launchOptions];`,
    before: `return YES;`
  })

  ignite.patchInFile(`${APP_PATH}/ios/${YOUR_PROJECT_NAME}/AppDelegate.m`, {
    insert: `
    - (BOOL)application:(UIApplication *)application 
    openURL:(NSURL *)url 
    options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {

      BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application
      openURL:url
      sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
      annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
      ];
      // Add any custom logic here.
      return handled;
    }`,
    before: `@end`
  })


  }

/**
 * Remove yourself from the project.
 */
const remove = async function(context) {
  // Learn more about context: https://infinitered.github.io/gluegun/#/context-api.md
  const { ignite, filesystem } = context

  // remove the npm module and unlink it
  await ignite.removeModule(NPM_MODULE_NAME, { unlink: true })

}

module.exports = { add, remove }
