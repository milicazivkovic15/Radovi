#include <GL/freeglut.h>
#include <math.h>
#include <sstream>
#include "vector4d.h"
#include "matrix4x4.h"
#include <vector>
#include <GL/freeglut.h>
#include <string.h>

#define PI 3.14
using namespace std;

char title[] = "";

Vector3D CameraPosition(0.0, 0.0, 5.0);
Vector3D LookAt_vector(0.0, 0.0, 0.0);
Vector3D LookUp_vector(0.0, 1.0, 0.0);

double alpha = 90;
int brzina = 1;
#define POMERAJ 0.1
#define ROTACIJA 3.14/180
double visina = 480;
double ratio = 1;
vector<Vector3D> koordinatni;
double rotacijaDG = 0;
vector<vector<Vector3D>> kontrolna;
double r = 0.5;
void kreirajKontrolnu() {

	kontrolna.resize(2);
	kontrolna[0].resize(4);
	kontrolna[0][0] = Vector3D(-1, -1, 0);
	kontrolna[0][1] = Vector3D(1,-1, 0);
	kontrolna[0][2] = Vector3D(1, -0.5, 0);
	kontrolna[0][3] = Vector3D(-1, -0.5, 0);

	for (int i = 0; i < 180; i++)
	{
		kontrolna[1].push_back(Vector3D(r*cos(i*PI / 180), -0.55+ r*sin(i*PI / 180), 0));
	}

}
void crtajKontrolnu() {
	glColor3f(1, 1, 1);
	glBegin(GL_QUADS);
	for (int i = 0; i < 4; i++)
	{
		glVertex3d(kontrolna[0][i].X(), kontrolna[0][i].Y(), kontrolna[0][i].Z());
	}
	glEnd();

	glBegin(GL_POLYGON);
	for (int i = 0; i < 180; i++)
	{
		glVertex3d(kontrolna[1][i].X(), kontrolna[1][i].Y(), kontrolna[1][i].Z());
	}
	glEnd();

}


void kreirajKoordinatni() {
	koordinatni.resize(4);
	koordinatni[0] = Vector3D(0, 0, 0);
	koordinatni[1] = Vector3D(Vector3D::AxisX.m_x*0.2, Vector3D::AxisX.m_y*0.2, Vector3D::AxisX.m_z*0.2);
	koordinatni[2] = Vector3D(Vector3D::AxisY.m_x*0.2, Vector3D::AxisY.m_y*0.2, Vector3D::AxisY.m_z*0.2);
	koordinatni[3] = Vector3D(Vector3D::AxisZ.m_x*0.2, Vector3D::AxisZ.m_y*0.2, Vector3D::AxisZ.m_z*0.2);
	Matrix4x4 m;
	m.loadTranslate(-0.8, -0.8, 0);
	koordinatni = m.TransformVectorArray(koordinatni);

}
void crtajKoordinatni() {

	glColor3f(1, 0, 0);
	glBegin(GL_LINES);
	glVertex3d(koordinatni[0].X(), koordinatni[0].Y(), koordinatni[0].Z());
	glVertex3d(koordinatni[1].X(), koordinatni[1].Y(), koordinatni[1].Z());

	glEnd();
	glColor3f(0, 1, 0);
	glBegin(GL_LINES);
	glVertex3d(koordinatni[0].X(), koordinatni[0].Y(), koordinatni[0].Z());
	glVertex3d(koordinatni[2].X(), koordinatni[2].Y(), koordinatni[2].Z());

	glEnd();
	glColor3f(0, 0, 1);
	glBegin(GL_LINES);
	glVertex3d(koordinatni[0].X(), koordinatni[0].Y(), koordinatni[0].Z());
	glVertex3d(koordinatni[2].X(), koordinatni[2].Y(), koordinatni[2].Z());

	glEnd();

	
}

vector<vector<Vector3D>>brzinometar;
void kreirajBrzinu() {
	double y = 0;
	brzinometar.resize(5);
	Matrix4x4 t;
	t.loadTranslate(0.5, -0.9, 0);

	for (int i = 0; i < 5; i++)
	{
		brzinometar[i].resize(4);
		brzinometar[i][0] = Vector3D(0, y, 0);
		brzinometar[i][1] = Vector3D(0.4, y, 0);
		brzinometar[i][2] = Vector3D(0.4, y+0.05, 0);
		brzinometar[i][3] = Vector3D(0, y + 0.05, 0);
		y += 0.08;
		brzinometar[i] = t.TransformVectorArray(brzinometar[i]);
	}
	
	
}
void crtrajBrzinu(){

	for (int i = 0; i < 5; i++)
	{
		if (i < brzina)
			glColor3f(0, 0.8, 0.8);
		else
			glColor3f(0, 0, 0);

		glBegin(GL_POLYGON);
		for (int j = 0; j < 4; j++)
		{
			glVertex3d(brzinometar[i][j].X(), brzinometar[i][j].Y(), brzinometar[i][j].Z());
		}
		glEnd();
	}

}

vector <vector< Vector3D >> zgrade;
void kreirajZgrade() {
	zgrade.resize(3);
	
		zgrade[0].resize(8);
		zgrade[0][0] = Vector3D(-10, 0, -10);
		zgrade[0][1] = Vector3D(-10, 0, -12);
		zgrade[0][2] = Vector3D(-14, 0, -12);
		zgrade[0][3] = Vector3D(-14, 0, -10);


		zgrade[0][4] = Vector3D(-10, 5.8, -10);
		zgrade[0][5] = Vector3D(-10, 5.8, -12);
		zgrade[0][6] = Vector3D(-14, 5.8, -12);
		zgrade[0][7] = Vector3D(-14, 5.8, -10);



		zgrade[1].resize(8);
		zgrade[1][0] = Vector3D(28, 0, 20);
		zgrade[1][1] = Vector3D(28, 0, 22);
		zgrade[1][2] = Vector3D(32, 0, 22);
		zgrade[1][3] = Vector3D(32, 0, 20);


		zgrade[1][4] = Vector3D(28, 5.8,20);
		zgrade[1][5] = Vector3D(28, 5.8, 22);
		zgrade[1][6] = Vector3D(32, 5.8, 22);
		zgrade[1][7] = Vector3D(32, 5.8, 20);



		zgrade[2].resize(8);
		zgrade[2][0] = Vector3D(-26, 0, 7);
		zgrade[2][1] = Vector3D(-26, 0, 9);
		zgrade[2][2] = Vector3D(-30, 0, 9);
		zgrade[2][3] = Vector3D(-30, 0, 7);


		zgrade[2][4] = Vector3D(-26, 5.8, 7);
		zgrade[2][5] = Vector3D(-26, 5.8, 9);
		zgrade[2][6] = Vector3D(-30, 5.8, 9);
		zgrade[2][7] = Vector3D(-30, 5.8, 7);
	
}
void crtajZgrade() {
	for (int i = 0; i < zgrade.size(); i++)
	{
		glBegin(GL_QUADS);
		glVertex3d(zgrade[i][0].X(), zgrade[i][0].Y(), zgrade[i][0].Z());
		glVertex3d(zgrade[i][1].X(), zgrade[i][1].Y(), zgrade[i][1].Z());
		glVertex3d(zgrade[i][2].X(), zgrade[i][2].Y(), zgrade[i][2].Z());
		glVertex3d(zgrade[i][3].X(), zgrade[i][3].Y(), zgrade[i][3].Z());


		glVertex3d(zgrade[i][4].X(), zgrade[i][4].Y(), zgrade[i][4].Z());
		glVertex3d(zgrade[i][5].X(), zgrade[i][5].Y(), zgrade[i][5].Z());
		glVertex3d(zgrade[i][6].X(), zgrade[i][6].Y(), zgrade[i][6].Z());
		glVertex3d(zgrade[i][7].X(), zgrade[i][7].Y(), zgrade[i][7].Z());

		glVertex3d(zgrade[i][0].X(), zgrade[i][0].Y(), zgrade[i][0].Z());
		glVertex3d(zgrade[i][1].X(), zgrade[i][1].Y(), zgrade[i][1].Z());
		glVertex3d(zgrade[i][5].X(), zgrade[i][5].Y(), zgrade[i][5].Z());
		glVertex3d(zgrade[i][4].X(), zgrade[i][4].Y(), zgrade[i][4].Z());


		glVertex3d(zgrade[i][0].X(), zgrade[i][0].Y(), zgrade[i][0].Z());
		glVertex3d(zgrade[i][3].X(), zgrade[i][3].Y(), zgrade[i][3].Z());
		glVertex3d(zgrade[i][7].X(), zgrade[i][7].Y(), zgrade[i][7].Z());
		glVertex3d(zgrade[i][4].X(), zgrade[i][4].Y(), zgrade[i][4].Z());

		glVertex3d(zgrade[i][1].X(), zgrade[i][1].Y(), zgrade[i][1].Z());
		glVertex3d(zgrade[i][2].X(), zgrade[i][2].Y(), zgrade[i][2].Z());
		glVertex3d(zgrade[i][6].X(), zgrade[i][6].Y(), zgrade[i][6].Z());
		glVertex3d(zgrade[i][5].X(), zgrade[i][5].Y(), zgrade[i][5].Z());


		glVertex3d(zgrade[i][2].X(), zgrade[i][2].Y(), zgrade[i][2].Z());
		glVertex3d(zgrade[i][3].X(), zgrade[i][3].Y(), zgrade[i][3].Z());
		glVertex3d(zgrade[i][7].X(), zgrade[i][7].Y(), zgrade[i][7].Z());
		glVertex3d(zgrade[i][6].X(), zgrade[i][6].Y(), zgrade[i][6].Z());

		glEnd();
	}
}

vector<Vector3D> mapa;

double precnik = 0.2;
void kreirajMapu() {

	for (int i = 0; i < 360; i++)
	{
		mapa.push_back(Vector3D(precnik*cos(i*2*PI / 360), -0.8+precnik*sin(i*2*PI / 360), 0));

	}
}
void crtajMapu() {

	glColor3f(0.8, 0.8, 0.8);
	glBegin(GL_POLYGON);
	for (int i = 0; i < 360; i++)
	{
		glVertex3d(mapa[i].X(), mapa[i].Y(), mapa[i].Z());
	}
	glEnd();

	glColor3f(1,0,0);
	glPointSize(5);
	glBegin(GL_POINTS);
	for (int i = 0; i < zgrade.size(); i++)
	{
		glVertex3d(zgrade[i][0].X()/250, -0.8+ zgrade[i][0].Z()/250,0);
	}
	glVertex3d(CameraPosition.X() / 250, -0.8 + CameraPosition.Z() / 250, 0);

	glEnd();
}
void display()
{
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT); // Clear color and depth buffers

	gluPerspective(alpha, ratio, 0.1f, 20.0f);

	gluLookAt(CameraPosition.m_x, CameraPosition.m_y, CameraPosition.m_z,
		LookAt_vector.m_x, LookAt_vector.m_y, LookAt_vector.m_z,
		LookUp_vector.m_x, LookUp_vector.m_y, LookUp_vector.m_z);

	//3D
	glColor3f(0, 1, 0);
	crtajZgrade();
	glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
	glColor3f(1,0, 0);
	crtajZgrade();
	glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);


	glMatrixMode(GL_MODELVIEW);
	glLoadIdentity();
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();

	glDisable(GL_DEPTH_TEST);
	
	//Staticki deo
	crtajKontrolnu();
	crtajKoordinatni();
	crtrajBrzinu();
	crtajMapu();
	
	char sx[10], sy[10], sz[10];
	glColor3f(0, 0, 0);
	sprintf_s(sx, "X=%.2lf", CameraPosition.X());
	sprintf_s(sy, "Y=%.2lf", CameraPosition.Y());
	sprintf_s(sz, "Z=%.2lf", CameraPosition.Z());
	
	glRasterPos2f(-0.1, -0.2);
	glutBitmapString(GLUT_BITMAP_TIMES_ROMAN_24, (const unsigned char*)sx);
	glRasterPos2f(-0.1, -0.3);
	glutBitmapString(GLUT_BITMAP_TIMES_ROMAN_24, (const unsigned char*)sy);
	glRasterPos2f(-0.1, -0.4);
	glutBitmapString(GLUT_BITMAP_TIMES_ROMAN_24, (const unsigned char*)sz);


	glEnable(GL_DEPTH_TEST);

	glutSwapBuffers();  // Swap the front and back frame buffers (double buffering)
}

void reshape(GLsizei width, GLsizei height)
{
	if (height * ratio <= width)
		width = ratio * height;
	else
		height = width / ratio;

	glViewport(0, 0, width, height);
}

/* Initialize OpenGL Graphics */
void initGL()
{
	glClearColor(0.0f, 0.0f, 0.0f, 1.0f); // Set background color to black and opaque
	glShadeModel(GL_FLAT);

	glEnable(GL_DEPTH_TEST);   // Enable depth testing for z-culling
}
void napred() {

	Matrix4x4 m;
	Vector3D v;

	v = LookAt_vector - CameraPosition;
	v.m_y = 0;
	v.Normalize();
	v *= brzina*POMERAJ;
	m.loadTranslate(v.X(), v.Y(), v.Z());
	Vector3D cam = m.Transform(CameraPosition);

	if (cam.X() <= 50 && cam.X() >= -50 && cam.Z() <= 50 && cam.Z() >= -50)
	{
		LookAt_vector = m.Transform(LookAt_vector);
	CameraPosition = m.Transform(CameraPosition);
}

}
void nazad() {

	Matrix4x4 m;
	Vector3D v;

	v = LookAt_vector - CameraPosition;
	v.m_y = 0;
	v.Normalize();
	v *=-brzina*POMERAJ;
	m.loadTranslate(v.X(), v.Y(), v.Z());
	Vector3D cam = m.Transform(CameraPosition);

	if (cam.X() <= 50 && cam.X() >= -50 && cam.Z() <= 50 && cam.Z() >= -50)
	{
		LookAt_vector = m.Transform(LookAt_vector);
		CameraPosition = m.Transform(CameraPosition);
	}

}
void levo() {

	Matrix4x4 m;
	Vector3D v,f;

	f = LookAt_vector - CameraPosition;
	v = LookUp_vector.Cross(f);
	v.m_y = 0;
	v.Normalize();
	v *= brzina*POMERAJ;
	m.loadTranslate(v.X(), v.Y(), v.Z());
	Vector3D cam= m.Transform(CameraPosition);
	if (cam.X()<= 50 && cam.X()>= -50 && cam.Z()<= 50 && cam.Z() >= -50)
	{
		LookAt_vector = m.Transform(LookAt_vector);
		CameraPosition = m.Transform(CameraPosition);
	}

}
void desno() {

	Matrix4x4 m;
	Vector3D v, f;

	f = LookAt_vector - CameraPosition;
	v = LookUp_vector.Cross(f);
	v.m_y = 0;
	v.Normalize();
	v *= -brzina*POMERAJ;
	m.loadTranslate(v.X(), v.Y(), v.Z());
	Vector3D cam = m.Transform(CameraPosition);

	if (cam.X() <= 50 && cam.X() >= -50 && cam.Z() <= 50 && cam.Z() >= -50)
	{
		LookAt_vector = m.Transform(LookAt_vector);
		CameraPosition = m.Transform(CameraPosition);
	}

}
void rotirajLevo() {
	Matrix4x4 m, m1, m2, r;
	m1.loadTranslate(-CameraPosition.X(), -CameraPosition.Y(), -CameraPosition.Z());
	m2.loadTranslate(CameraPosition.X(), CameraPosition.Y(), CameraPosition.Z());
	r.loadRotateY(ROTACIJA);
	m = m2*r*m1;

	LookAt_vector = m.Transform(LookAt_vector);
	Matrix4x4 mm, mm1, mm2, rr;
	mm1.loadTranslate(0.8, 0.8, 0);
	mm2.loadTranslate(-0.8, -0.8, 0);
	rr.loadRotateZ(ROTACIJA);
	mm = mm2*rr*mm1;

	koordinatni = mm.TransformVectorArray(koordinatni);

	Vector4D temp = LookUp_vector;
	temp.m_w = 0;
	temp = m.Transform(temp);
	LookUp_vector = temp;

	
}
void rotirajDesno() {
	Matrix4x4 m, m1, m2, r;
	m1.loadTranslate(-CameraPosition.X(), -CameraPosition.Y(), -CameraPosition.Z());
	m2.loadTranslate(CameraPosition.X(), CameraPosition.Y(), CameraPosition.Z());
	r.loadRotateY(-ROTACIJA);
	m = m2*r*m1;

	LookAt_vector = m.Transform(LookAt_vector);
	LookAt_vector = m.Transform(LookAt_vector);
	Matrix4x4 mm, mm1, mm2, rr;
	mm1.loadTranslate(0.8, 0.8, 0);
	mm2.loadTranslate(-0.8, -0.8, 0);
	rr.loadRotateZ(-ROTACIJA);
	mm = mm2*rr*mm1;

	koordinatni = mm.TransformVectorArray(koordinatni);

	Vector4D temp = LookUp_vector;
	temp.m_w = 0;
	temp = m.Transform(temp);
	LookUp_vector = temp;

	Matrix4x4 rot;
	rot.rotacijaOkoOse(koordinatni[2] - koordinatni[0], koordinatni[0], -ROTACIJA);
	koordinatni = rot.TransformVectorArray(koordinatni);
}

void rotirajGore() {
	Matrix4x4 m;
	Vector3D f, v;
	f = LookAt_vector - CameraPosition;
	v = LookUp_vector.Cross(f);
	v.m_y = 0;
	v.Normalize();

	if (rotacijaDG + ROTACIJA <= 0.5*PI) {
		m.loadRotate(CameraPosition, v, ROTACIJA);

		LookAt_vector = m.Transform(LookAt_vector);
		Vector4D temp = LookUp_vector;
		temp.m_w = 0;
		temp = m.Transform(temp);
		LookUp_vector = temp;

	}
	rotacijaDG += ROTACIJA;

}
void rotirajDole() {
	Matrix4x4 m;
	Vector3D f, v;
	f = LookAt_vector - CameraPosition;
	v = LookUp_vector.Cross(f);
	v.m_y = 0;
	v.Normalize();

	if (rotacijaDG - ROTACIJA >= -0.5*PI) {
		m.loadRotate(CameraPosition, v, -ROTACIJA);

		LookAt_vector = m.Transform(LookAt_vector);
		Vector4D temp = LookUp_vector;
		temp.m_w = 0;
		temp = m.Transform(temp);
		LookUp_vector = temp;

	}
	rotacijaDG -= ROTACIJA;

}
void tastatura(unsigned char key, int x, int y) {
	switch (key)
	{
	case 'w':
		napred();
		break;
	case 's':
		nazad();
		break;
	case 'a':
		levo();
		break;
	case 'd':
		desno();
		break;
	case 'u':
		if (brzina < 5)
			brzina++;
		break;
	case 'j':
		if (brzina > 1)
			brzina--;
		break;
	case 52:
		rotirajLevo();
		break;
	case 54:
		rotirajDesno();
		break;
	case 56:
		rotirajGore();
		break;
	case 50:
		rotirajDole();
		break;
	default:
		break;
	}
	glutPostRedisplay();

}

int main(int argc, char** argv)
{
	glutInit(&argc, argv);            // Initialize GLUT
	glutInitDisplayMode(GLUT_DOUBLE | GLUT_DEPTH | GLUT_STENCIL); // Enable double buffered mode
	glutInitWindowSize(ratio * visina, visina);   // Set the window's initial width & height
	glutInitWindowPosition(50, 50); // Position the window's initial top-left corner
	glutCreateWindow(title);          // Create window with the given title


	kreirajKontrolnu();
	kreirajKoordinatni();
	kreirajBrzinu();
	kreirajZgrade();
	kreirajMapu();

	glutDisplayFunc(display);       // Register callback handler for window re-paint event
	glutReshapeFunc(reshape);       // Register callback handler for window re-size event
	glutKeyboardFunc(tastatura);
	initGL();                       // Our own OpenGL initialization
	glutMainLoop();                 // Enter the infinite event-processing loop
	return 0;
}
