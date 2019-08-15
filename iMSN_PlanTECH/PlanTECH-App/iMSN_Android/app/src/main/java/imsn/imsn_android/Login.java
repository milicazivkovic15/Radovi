package imsn.imsn_android;

import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.util.regex.Pattern;

public class Login extends AppCompatActivity  implements View.OnClickListener{

    private final String LOG = "Login_Log";
    private String lang = "sr";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        findViewById(R.id.login).setOnClickListener(this);
        findViewById(R.id.sr).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                lang = "sr";
                File tmp = new File("lang");
                if(tmp.exists()) try {
                    tmp.delete();
                } catch (Exception e) {}

                ((Button)findViewById(R.id.login)).setText("Prijavi se");
                ((TextView)findViewById(R.id.textView2)).setText("Korisničko ime");
                ((TextView)findViewById(R.id.textView)).setText("Lozinka");
            }
        });
        findViewById(R.id.en).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                lang = "en";
                File tmp = new File("lang");
                if(!tmp.exists()) try {
                    tmp.createNewFile();
                } catch (Exception e) {}

                ((Button)findViewById(R.id.login)).setText("Log in");
                ((TextView)findViewById(R.id.textView2)).setText("Username");
                ((TextView)findViewById(R.id.textView)).setText("Password");
            }
        });


        File tmp = new File("lang");
        if(tmp.exists()){
            ((Button)findViewById(R.id.login)).setText("Log in");
            ((TextView)findViewById(R.id.textView2)).setText("Username");
            ((TextView)findViewById(R.id.textView)).setText("Password");
        }
    }

    @Override
    public void onClick(View v) {
        String user = ((EditText)findViewById(R.id.username)).getText().toString();
        String pass = ((EditText)findViewById(R.id.password)).getText().toString();

        if(user=="false") user="";
        if(pass=="false") pass="";

        final String username = user;
        final String password = pass;

        if(!Pattern.matches("^[a-zA-Z0-9šđčćžŠĐČĆŽ]{8,16}$",username))
            showAlert(lang=="sr"?"Korisničko ime može da sadrži samo slova i brojeve. Broj karaktera od 8 do 16":"Username can contain only letters and numbers. Length should be between 8 and 16 characters");
        else if(!Pattern.matches("^(?=.*?[A-ZŠĐČĆŽ])(?=(.*[a-zšđčćž]){1,})(?=(.*[\\d]){1,})(?=(.*[\\_\\*\\@\\-\\!\\?]){1,})(?!.*\\s).{8,16}$",password))
            showAlert(lang=="sr"?"Lozinka mora da sadrži najmanje jedno malo i jedno veliko slovo, kao i najmanje jedan broj i jedan specijalni karakter (-!?_*@). Broj karaktera od 8 do 16":"Password must contain at least one lower and one upper letter, and also at least one digit and special character (-!?_*@). Length should be between 8 and 16 characters");
        else new Thread(){
                @Override
                public void run() {
                    tryLogin(username,password);
                }
            }.start();
    }

    private void showAlert(final String message)
    {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Context context = getApplicationContext();
                CharSequence text = message;
                int duration = Toast.LENGTH_SHORT;

                Toast toast = Toast.makeText(context, text, duration);
                toast.show();
            }
        });
    }

    private void tryLogin(String username, String password)
    {
        BufferedReader reader=null;

        try
        {
            String data = URLEncoder.encode("user", "UTF-8")
                    + "=" + URLEncoder.encode(username, "UTF-8");

            data += "&" + URLEncoder.encode("pass", "UTF-8") + "="
                    + URLEncoder.encode(password, "UTF-8");

            String res = "";

            // Defined URL  where to send data
            URL url = new URL(Browser.URL+"/loginMobile");

            // Send POST data request

            URLConnection conn = url.openConnection();
            conn.setDoOutput(true);
            OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream());
            wr.write( data );
            wr.flush();

            // Get the server response

            reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder sb = new StringBuilder();
            String line = null;

            // Read Server Response
            while((line = reader.readLine()) != null)
            {
                // Append server response in string
                sb.append(line + "\n");
            }


            res = sb.toString();

            JSONObject json = new JSONObject(res);
            Log.v(LOG,json.toString());
            Boolean status = json.getBoolean("status");

            if(status)
            {
                Boolean date = json.getBoolean("date");

                if(date)
                {
                    String token = json.getString("token");
                    String userType = json.getString("type_of_user");

                    Intent mainIntent = new Intent(Login.this,Browser.class);
                    File f =  new File(getFilesDir().getPath(), "/auto.login");
                    f.createNewFile();
                    FileOutputStream os = new FileOutputStream(f);

                    String write = token +"^"+userType+"^"+lang;
                    os.write(write.getBytes());
                    os.close();

                    //startService();

                    Login.this.startActivity(mainIntent);
                    Login.this.finish();
                }
                else
                {
                    showAlert(lang=="sr"?"Potrebno je da obnovite članarinu!":"You should reactivate Your account!");
                }
            }
            else
            {
                Boolean reg = json.getBoolean("registered");

                if(reg) showAlert(lang=="sr"?"Vaš nalog nije aktivan!":"Your account is not activated!");
                else showAlert(lang=="sr"?"Pogrešno korisničko ime ili lozinka!":"Incorrect username or password!");
            }
        }
        catch(Exception ex)
        {
            Log.v(this.LOG,ex.toString());
            showAlert(lang=="sr"?"Greška!":"Error!");
        }
        finally {
            try {
                reader.close();
            } catch (Exception ex) {
            }
        }
    }

    @Override
    public void onBackPressed() {
    }
}
