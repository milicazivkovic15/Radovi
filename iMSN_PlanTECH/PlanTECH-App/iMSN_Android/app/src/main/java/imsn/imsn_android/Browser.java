package imsn.imsn_android;

import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.os.SystemClock;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.webkit.ConsoleMessage;
import android.webkit.CookieManager;
import android.webkit.CookieSyncManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import im.delight.android.webview.AdvancedWebView;

public class Browser extends AppCompatActivity {

    public static final String URL = "http://147.91.204.116:2035";
    AdvancedWebView view = null;

    class MyWebChromeClient extends WebChromeClient
    {
        @Override
        public boolean onConsoleMessage(ConsoleMessage cm) {
            Log.d("Console_Log", String.format("%s @ %d: %s",
                    cm.message(), cm.lineNumber(), cm.sourceId()));
            return true;
        }
    }

    class MyWebViewClient extends WebViewClient{
        @Override
        public void onLoadResource(WebView view, String url) {

            Log.v("UrlChange_Log", url);
            if (url.endsWith("logout")){
                try {
                    Thread.sleep(50);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                logout();
            }
            else super.onLoadResource(view, url);
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_browser);

        try {
            File f =  new File(getFilesDir().getPath(), "/auto.login");

            InputStream is = new FileInputStream(f);

            BufferedReader r = new BufferedReader(new InputStreamReader(is));
            StringBuilder total = new StringBuilder();

            String line = r.readLine();

            is.close();
            r.close();

            int ind = line.lastIndexOf('^');

            String lang = line.substring(ind+1);
            line = line.substring(0,ind);

            ind = line.lastIndexOf('^');

            String userType = line.substring(ind+1);

            String token = line.substring(0,ind);

            Log.v("Browser_Log",token);
            Log.v("Browser_Log",userType);
            Log.v("Browser_Log",lang);

            startService();

            loadDefault(token,userType, lang);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void loadDefault(String token,String userType, String lang)
    {
        view = (AdvancedWebView) findViewById(R.id.webview);
        SystemClock.sleep(100);
        view.setWebChromeClient(new MyWebChromeClient());
        view.setWebViewClient(new MyWebViewClient());


        view.loadUrl(URL+"/mobile?token="+token+"&userType="+userType+"&lang="+lang);
    }

    @Override
    public void onBackPressed() {
        if(view.canGoBack()) view.goBack();
    }

    private void logout()
    {
        new File(getFilesDir().getPath(),"/auto.login").delete();

        //stopService(new Intent(this, BackgroundCheck.class));

        Intent mainIntent = new Intent(Browser.this,Login.class);
        Browser.this.startActivity(mainIntent);
        Browser.this.finish();
    }


    private boolean isMyServiceRunning(Class<?> serviceClass) {
        ActivityManager manager = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
            if (serviceClass.getName().equals(service.service.getClassName())) {
                return true;
            }
        }

        return false;
    }

    private void startService()
    {
        if(!isMyServiceRunning(BackgroundCheck.class))
        {
            Intent i = new Intent(Browser.this, BackgroundCheck.class);
            Browser.this.startService(i);
        }
    }
}
