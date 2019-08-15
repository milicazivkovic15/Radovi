package imsn.imsn_android;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class myBroadcastReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent aIntent) {

        Intent i = new Intent(context, BackgroundCheck.class);
        context.startService(i);
    }
}