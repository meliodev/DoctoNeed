package com.doctoneed;

import android.app.Application;
import android.content.Context;
import android.content.Intent;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
// import com.reactnativepayments.ReactNativePaymentsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.storage.RNFirebaseStoragePackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
import io.invertase.firebase.functions.RNFirebaseFunctionsPackage; // <-- Add this line
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;  // <-- Add this line                     
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage; // <-- Add this line
import com.gettipsi.stripe.StripeReactPackage; // <-- Add this line
// import com.shinetechchina.react_native_screen_recorder.ScreenRecorderPackage; // <-- add this import

// import io.wazo.callkeep.RNCallKeepPackage; // <-- Add this line
// import com.busfor.RNGooglePayPackage; //added for google pay


//import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
//import io.invertase.firebase.firestore.ReactNativeFirebaseFirestorePackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          packages.add(new RNFirebaseAuthPackage());
          packages.add(new RNFirebaseFirestorePackage());
          packages.add(new RNFirebaseStoragePackage());
          packages.add(new RNFirebaseFunctionsPackage());
          packages.add(new RNFirebaseMessagingPackage());
          packages.add( new RNFirebaseNotificationsPackage());
          packages.add(new StripeReactPackage());
          // packages.add(new ScreenRecorderPackage());

          //packages.add(new RNCallKeepPackage());
          //packages.add(new ReactNativePaymentsPackage());
          //packages.add(new RNGooglePayPackage()); //added for google pay
          //packages.add(new RNFirebaseFirestorePackage());
          //packages.add(new ReactNativeFirebaseFirestorePackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this); // Remove this line if you don't want Flipper enabled
  }

  /**
   * Loads Flipper in React Native templates.
   *
   * @param context
   */
  private static void initializeFlipper(Context context) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
        aClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
