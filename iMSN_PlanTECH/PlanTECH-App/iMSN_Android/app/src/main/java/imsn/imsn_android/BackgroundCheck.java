package imsn.imsn_android;

import android.annotation.TargetApi;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.IBinder;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.TaskStackBuilder;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xmlpull.v1.XmlPullParser;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.Reader;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Properties;
import java.util.Timer;
import java.util.TimerTask;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.net.ssl.HttpsURLConnection;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

/**
 * Created by Stefan Stamenkovic on 15.7.2016..
 */
public class BackgroundCheck extends Service {

    private static String URL = Browser.URL + "/getNotificationForMobile";
    private static int DELAY = 15*60*1000;

    @Override
    public IBinder onBind(Intent arg0) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void onStart(Intent intent, int startId) {
        // TODO Auto-generated method stub
        super.onStart(intent, startId);

        Log.v("Notif_Log", "start");

        startTimer();
   }

    private void startTimer()
    {
        Timer t = new Timer();

        t.schedule(new TimerTask() {
            @Override
            public void run() {
                checkForNewNotification();
            }
        }, DELAY);

        checkForNewNotification();
    }

    private void checkForNewNotification()
    {
        File f =  new File(getFilesDir().getPath(), "/auto.login");

        Log.v("Notif_Log", "check");

        if(f.exists())
        {
            try {
                InputStream is = new FileInputStream(f);

                BufferedReader r = new BufferedReader(new InputStreamReader(is));
                StringBuilder total = new StringBuilder();

                String line = r.readLine();
                is.close();
                r.close();

                is.close();
                r.close();

                int ind = line.lastIndexOf('^');

                final String lang = line.substring(ind+1);
                line = line.substring(0,ind);

                ind = line.lastIndexOf('^');

                String userType = line.substring(ind+1);

                final String token = line.substring(0,ind);

                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        getNotifications(token, lang);
                    }
                }).start();
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        else super.onDestroy();
    }

    private void getNotifications(String token, String lang) {

        Log.v("Notif_Log",token);

        BufferedReader reader = null;

        try {
            String data = URLEncoder.encode("token", "UTF-8")
                    + "=" + URLEncoder.encode(token, "UTF-8");

            String res = "";

            // Defined URL  where to send data
            URL url = new URL(URL);

            // Send POST data request

            URLConnection conn = url.openConnection();
            conn.setDoOutput(true);
            OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream());
            wr.write(data);
            wr.flush();

            // Get the server response

            reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder sb = new StringBuilder();
            String line = null;

            // Read Server Response
            while ((line = reader.readLine()) != null) {
                // Append server response in string
                sb.append(line + "\n");
            }


            res = sb.toString();

            JSONArray array = new JSONArray(res);
            Log.v("Response_Log",array.toString());

            for (int i = 0; i < array.length(); i++) {
                JSONObject obj = array.getJSONObject(i);

                Log.v("Response_Log",obj.toString());

                String msg = obj.getString("Title");
                String num = obj.getString("ID");

                showNotification(msg, lang, Integer.parseInt(num));
            }

        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (JSONException e) {
            e.printStackTrace();
        }
        finally {
            try {
                reader.close();
            } catch (Exception ex) {
            }
        }
    }

        @Override
    public void onDestroy() {
        super.onDestroy();
    }

    private void showNotification(String message,String lang, int num)
    {
        String title = "PlanTECH notification!";

        if(lang.equals("sr"))
        {
            title = "PlanTECH obaveštenje!";
        }

        NotificationCompat.Builder mBuilder =
                new NotificationCompat.Builder(this)
                        .setSmallIcon(R.mipmap.logo)
                        .setContentTitle(title)
                        .setContentText(message)
                        .setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION))
                        .setVibrate(new long[] { -1,700 });
// Creates an explicit intent for an Activity in your app
        Intent resultIntent = new Intent(this, Browser.class);

// The stack builder object will contain an artificial back stack for the
// started Activity.
// This ensures that navigating backward from the Activity leads out of
// your application to the Home screen.
        TaskStackBuilder stackBuilder = TaskStackBuilder.create(this);
// Adds the back stack for the Intent (but not the Intent itself)
        stackBuilder.addParentStack(Browser.class);
// Adds the Intent that starts the Activity to the top of the stack
        stackBuilder.addNextIntent(resultIntent);
        PendingIntent resultPendingIntent =
                stackBuilder.getPendingIntent(
                        0,
                        PendingIntent.FLAG_UPDATE_CURRENT
                );
        mBuilder.setContentIntent(resultPendingIntent);
        NotificationManager mNotificationManager =
                (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
// mId allows you to update the notification later on.
        mNotificationManager.notify(num, mBuilder.build());
    }
}
