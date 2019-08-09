#include <GL/freeglut.h>
#include <math.h>
#include <sstream>
#include "vector4d.h"
#include "matrix4x4.h"
#include <vector>
#include <string.h>
#include <GL/freeglut.h>

#define M_PI 3.14
using namespace std;

char title[] = "";

Vector3D CameraPosition(0.0, .0, 5.0);
Vector3D LookAt_vector(0.0, 0.0, 0.0);
Vector3D LookUp_vector(0.0, 1.0, 0.0);

double alpha = 90;

double visina = 480;
double ratio = 16.0 / 9.0;
vector<Vector3D> koordinatni;
void kreirajKoordinatni() {
	koordinatni.resize(4);
	koordinatni[0] = Vector3D(0, 0, 0);

	koordinatni[1] = Vector3D(Vector3D::AxisX.m_x, Vector3D::AxisX.m_y, Vector3D::AxisX.m_z);

	koordinatni[2] = Vector3D(Vector3D::AxisY.m_x, Vector3D::AxisY.m_y, Vector3D::AxisY.m_z);

	koordinatni[3] = Vector3D(Vector3D::AxisZ.m_x, Vector3D::AxisZ.m_y, Vector3D::AxisZ.m_z);

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
	glVertex3d(koordinatni[3].X(), koordinatni[3].Y(), koordinatni[3].Z());
	glEnd();

}
vector<vector<Vector3D>> kontrolna;
void kreirajKontrolnu() {

	kontrolna.resize(4);

		kontrolna[0].resize(3);
		kontrolna[0][0] = Vector3D(-1, -1, 0);
		kontrolna[0][1] = Vector3D(-1, 0, 0);
		kontrolna[0][2] = Vector3D(0, -1, 0);

		kontrolna[1].resize(3);
		kontrolna[1][0] = Vector3D(1, 0, 0);
		kontrolna[1][1] = Vector3D(1, -1, 0);
		kontrolna[1][2] = Vector3D(0, -1, 0);

		kontrolna[2].resize(3);
		kontrolna[2][0] = Vector3D(-1, 1, 0);
		kontrolna[2][1] = Vector3D(-1, 0.2, 0);
		kontrolna[2][2] = Vector3D(-0.3, 1, 0);

		kontrolna[3].resize(3);
		kontrolna[3][0] = Vector3D(1, 1, 0);
		kontrolna[3][1] = Vector3D(1, 0.2, 0);
		kontrolna[3][2] = Vector3D(0.3, 1, 0);
}
void crtajKontrolnu() {
	glColor3f(0, 0.6, 0.6);
	for (int i = 0; i < 4; i++)
	{
		glBegin(GL_TRIANGLES);
		for (int j = 0; j < 3; j++)
		{
			glVertex3d(kontrolna[i][j].X(), kontrolna[i][j].Y(), kontrolna[i][j].Z());
		}
		glEnd();
	}

}

int brzina = 1;
vector<vector<Vector3D>> brzinometar;

void kreirajBrzinometar() {
	brzinometar.resize(5);
	double x = 0;
	for (int i = 0; i < 5; i++)
	{
		brzinometar[i].resize(4);
		brzinometar[i][0] = Vector3D(x, 0, 0);
		brzinometar[i][1] = Vector3D(x, -0.1, 0);
		brzinometar[i][2] = Vector3D(x+0.1, 0, 0);
		brzinometar[i][3] = Vector3D(x+0.1, -0.1, 0);
		x += 0.1;
	}
	Matrix4x4 t;
	t.loadTranslate(0.3, -0.8, 0);
	for (int i = 0; i < 5; i++)
	{
		brzinometar[i] = t.TransformVectorArray(brzinometar[i]);
	}
}

void crtajBrzinometar() {
	
	for (int i = 0; i < 5; i++)
	{
		if (i < brzina)
			glColor3f(0, 0.8, 0);
		else
			glColor3f(0.8, 0.8, 0.8);

		glBegin(GL_QUAD_STRIP);
		for (int j = 0; j < 4; j++)
		{
			glVertex3d(brzinometar[i][j].X(), brzinometar[i][j].Y(), brzinometar[i][j].Z());
		}
		glEnd();
	}
	glColor3f(0, 0, 0);
	glLineWidth(3);
	glBegin(GL_LINE_LOOP);
	glVertex3d(brzinometar[0][0].X(), brzinometar[0][0].Y(), brzinometar[0][0].Z());
	glVertex3d(brzinometar[0][1].X(), brzinometar[0][1].Y(), brzinometar[0][1].Z());
	glVertex3d(brzinometar[4][3].X(), brzinometar[4][3].Y(), brzinometar[4][3].Z());
	glVertex3d(brzinometar[4][2].X(), brzinometar[4][2].Y(), brzinometar[4][2].Z());
	glEnd();
}

#define PI 3.14
vector<Vector3D> krug;
vector<Vector3D> strelica;
double r = 0.2;
void kreirajKrug() {
	for (int i = 0; i < 360; i++)
	{
		krug.push_back(Vector3D(r*cos(i * 2 * PI / 360), r*sin(i * 2 * PI / 360), 0));
	}
	strelica.resize(4);
	strelica[0]=Vector3D(0,0,0);
	strelica[1] = Vector3D(0.0, 0.15, 0);
	Matrix4x4 t;
	t.loadTranslate(-0.7, -0.7, 0);
	krug = t.TransformVectorArray(krug);
	strelica = t.TransformVectorArray(strelica);
}

void crtajKrug() {
	glColor3f(0, 0, 0);
	glBegin(GL_POLYGON);
	for (int i = 0; i < 360; i++)
	{
		glVertex3d(krug[i].X(), krug[i].Y(), krug[i].Z());
	}
	glEnd();
	glColor3f(0, 1, 0);
	
	glBegin(GL_LINES);
	for (int i = 0; i < 2; i++)
	{
		glVertex3d(strelica[i].X(), strelica[i].Y(), strelica[i].Z());
	}
	glEnd();

}
vector<vector<Vector3D>>lines;
void kreirajLines() {
	int i = 0;
	double x = -10;
	lines.resize(40);
	while (x < 10) {
		lines[i].resize(2);
		lines[i][0] = Vector3D(x,-1,-10);
		lines[i][1] = Vector3D(x,-1,10);
		i++;
		x += 0.5;
	}
}
void crtajLinije() {

	glColor3f(0, 0, 1);
	glBegin(GL_LINES);
	for (int i = 0; i < lines.size(); i++)
	{
		glVertex3d(lines[i][0].X(), lines[i][0].Y(), lines[i][0].Z());
		glVertex3d(lines[i][1].X(), lines[i][1].Y(), lines[i][1].Z());
	}
	glEnd();

}
vector<Vector3D> kocka;
void kreirajKocku() {

	kocka.resize(8);

	kocka[0] = Vector3D(-0.1, -0.2, -0.1);
	kocka[1] = Vector3D(0.1, -0.2,-0.1);
	kocka[2] = Vector3D(0.1,-0.2, 0.1);
	kocka[3] = Vector3D(-0.1,-0.2, 0.1);

	kocka[4] = Vector3D(-0.1, 0.2, -0.1);
	kocka[5] = Vector3D(0.1, 0.2, -0.1);
	kocka[6] = Vector3D(0.1, 0.2, 0.1);
	kocka[7] = Vector3D(-0.1, 0.2, 0.1);
	Matrix4x4 t;
	t.loadTranslate(-0.85,0.7,0);
	kocka = t.TransformVectorArray(kocka);
}
void crtajKocku() {
	glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
	glColor3f(1, 0, 0);
	glBegin(GL_QUAD_STRIP);
	glVertex3d(kocka[0].X(), kocka[0].Y(), kocka[0].Z());
	glVertex3d(kocka[1].X(), kocka[1].Y(), kocka[1].Z());
	glVertex3d(kocka[2].X(), kocka[2].Y(), kocka[2].Z());
	glVertex3d(kocka[3].X(), kocka[3].Y(), kocka[3].Z());

	glVertex3d(kocka[4].X(), kocka[4].Y(), kocka[4].Z());
	glVertex3d(kocka[5].X(), kocka[5].Y(), kocka[5].Z());
	glVertex3d(kocka[6].X(), kocka[6].Y(), kocka[6].Z());
	glVertex3d(kocka[7].X(), kocka[7].Y(), kocka[7].Z());

	glVertex3d(kocka[0].X(), kocka[0].Y(), kocka[0].Z());
	glVertex3d(kocka[1].X(), kocka[1].Y(), kocka[1].Z());
	glVertex3d(kocka[4].X(), kocka[4].Y(), kocka[4].Z());
	glVertex3d(kocka[5].X(), kocka[5].Y(), kocka[5].Z());

	glVertex3d(kocka[3].X(), kocka[3].Y(), kocka[3].Z());
	glVertex3d(kocka[2].X(), kocka[2].Y(), kocka[2].Z());
	glVertex3d(kocka[7].X(), kocka[7].Y(), kocka[7].Z());
	glVertex3d(kocka[6].X(), kocka[6].Y(), kocka[6].Z());

	glVertex3d(kocka[1].X(), kocka[1].Y(), kocka[1].Z());
	glVertex3d(kocka[2].X(), kocka[2].Y(), kocka[2].Z());
	glVertex3d(kocka[5].X(), kocka[5].Y(), kocka[5].Z());
	glVertex3d(kocka[6].X(), kocka[6].Y(), kocka[6].Z());
	
	glVertex3d(kocka[0].X(), kocka[0].Y(), kocka[0].Z());
	glVertex3d(kocka[3].X(), kocka[3].Y(), kocka[3].Z());
	glVertex3d(kocka[7].X(), kocka[7].Y(), kocka[7].Z());
	glVertex3d(kocka[4].X(), kocka[4].Y(), kocka[4].Z());
	
	glEnd();
	glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
}
void display()
{
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT); // Clear color and depth buffers

	gluPerspective(alpha, ratio, 0.1f, 20.0f);

	gluLookAt(CameraPosition.m_x, CameraPosition.m_y, CameraPosition.m_z,
		LookAt_vector.m_x, LookAt_vector.m_y, LookAt_vector.m_z,
		LookUp_vector.m_x, LookUp_vector.m_y, LookUp_vector.m_z);

	//3D
	crtajLinije();

	

	glMatrixMode(GL_MODELVIEW);
	glLoadIdentity();
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();

	glDisable(GL_DEPTH_TEST);

	//Staticki deo
	//crtajKoordinatni();
	crtajKontrolnu();
	crtajBrzinometar();

	char s[] = "BRZINA";
	glRasterPos2f(0.7,-0.6);
	glutBitmapString(GLUT_BITMAP_TIMES_ROMAN_24, (const unsigned char *)s);
	std::string ss = "("+std::to_string((int)CameraPosition.X())+","+ std::to_string((int)CameraPosition.Y())+","+ std::to_string((int)CameraPosition.Z())+")";
	glRasterPos2f(0.7, 0.6);
	const char * s2 = ss.c_str();
	glutBitmapString(GLUT_BITMAP_TIMES_ROMAN_24, (const unsigned char *)s2);


	crtajKrug();
	crtajKocku();

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
#define POMERAJ 0.1
void napred() {
	Matrix4x4 m;
	Vector3D v;
	v = LookAt_vector - CameraPosition;
	v.m_y = 0;
	v.Normalize();
	v *= brzina*POMERAJ;
	m.loadTranslate(v.X(), v.Y(), v.Z());

	LookAt_vector = m.Transform(LookAt_vector);
	CameraPosition = m.Transform(CameraPosition);

}
void nazad() {
	Matrix4x4 m;
	Vector3D v;
	v = LookAt_vector - CameraPosition;
	v.m_y = 0;
	v.Normalize();
	v *= -brzina*POMERAJ;
	m.loadTranslate(v.X(), v.Y(), v.Z());

	LookAt_vector = m.Transform(LookAt_vector);
	CameraPosition = m.Transform(CameraPosition);

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

	LookAt_vector = m.Transform(LookAt_vector);
	CameraPosition = m.Transform(CameraPosition);

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

	LookAt_vector = m.Transform(LookAt_vector);
	CameraPosition = m.Transform(CameraPosition);

}
#define ROTACIJA 3.14/180
void rotirajLevo() {
	Matrix4x4 m, m1, m2, r;
	m1.loadTranslate(-CameraPosition.X(), -CameraPosition.Y(), -CameraPosition.Z());
	m2.loadTranslate(CameraPosition.X(), CameraPosition.Y(), CameraPosition.Z());
	r.loadRotateY(ROTACIJA);
	m = m2*r*m1;

	LookAt_vector = m.Transform(LookAt_vector);

	Matrix4x4 mm, mm1, mm2, rr;
	mm1.loadTranslate(0.7, 0.7, 0);
	mm2.loadTranslate(-0.7, -0.7, 0);
	rr.loadRotateZ(ROTACIJA);
	mm = mm2*rr*mm1;

	strelica = mm.TransformVectorArray(strelica);

	Matrix4x4 mmm, mmm1, mmm2, rrr;
	mmm1.loadTranslate(0.8, -0.6, 0);
	mmm2.loadTranslate(-0.8, 0.6, 0);
	rrr.loadRotateY(ROTACIJA);
	mmm = mmm2*rrr*mmm1;
	kocka = mmm.TransformVectorArray(kocka);

	Vector4D temp = LookUp_vector;
	temp.m_w = 0;
	temp = m.Transform(temp);
	LookUp_vector = temp;

	Matrix4x4 rot;
	rot.rotacijaOkoOse(koordinatni[2] - koordinatni[0], koordinatni[0], ROTACIJA);
	koordinatni = rot.TransformVectorArray(koordinatni);
}
void rotirajDesno() {
	Matrix4x4 m, m1, m2, r;
	m1.loadTranslate(-CameraPosition.X(), -CameraPosition.Y(), -CameraPosition.Z());
	m2.loadTranslate(CameraPosition.X(), CameraPosition.Y(), CameraPosition.Z());
	r.loadRotateY(-ROTACIJA);
	m = m2*r*m1;

	LookAt_vector = m.Transform(LookAt_vector);
	
	Matrix4x4 mm, mm1, mm2, rr;
	mm1.loadTranslate(0.7, 0.7, 0);
	mm2.loadTranslate(-0.7, -0.7,0);
	rr.loadRotateZ(-ROTACIJA);
	mm = mm2*rr*mm1;

	strelica = mm.TransformVectorArray(strelica);

	Matrix4x4 mmm, mmm1, mmm2, rrr;
	mmm1.loadTranslate(0.8, -0.6, 0);
	mmm2.loadTranslate(-0.8, 0.6, 0);
	rrr.loadRotateY(-ROTACIJA);
	mmm = mmm2*rrr*mmm1;
	kocka = mmm.TransformVectorArray(kocka);

	Vector4D temp = LookUp_vector;
	temp.m_w = 0;
	temp = m.Transform(temp);
	LookUp_vector = temp;

	Matrix4x4 rot;
	rot.rotacijaOkoOse(koordinatni[2] - koordinatni[0], koordinatni[0], -ROTACIJA);
	koordinatni = rot.TransformVectorArray(koordinatni);
}
double rotacijaGoreDole = 0.0;
void rotacijaGore() {
	Matrix4x4 m,mm, t1,t2;
	Vector3D f, v;
	f = LookAt_vector - CameraPosition;
	v = LookUp_vector.Cross(v);
	v.m_y = 0;
	v.Normalize();
	
	if (rotacijaGoreDole + ROTACIJA < 0.5*PI) {
		m.loadRotate(CameraPosition, v, ROTACIJA);
		t1.loadTranslate(0.85, -0.7, 0);
		t2.loadTranslate(-0.85, 0.7, 0);
		mm.loadRotateX(ROTACIJA);
		mm = t2*mm*t1;
		LookAt_vector = m.Transform(LookAt_vector);
		kocka = mm.TransformVectorArray(kocka);
		Vector4D temp = LookUp_vector;
		temp.m_w = 0;
		temp = m.Transform(temp);
		LookUp_vector = temp;
		rotacijaGoreDole += ROTACIJA;
	}

}
void rotacijaDole() {
	Matrix4x4 m,mm,t1,t2;
	Vector3D f, v;
	f = LookAt_vector - CameraPosition;
	v = LookUp_vector.Cross(v);
	v.m_y = 0;
	v.Normalize();

	if (rotacijaGoreDole - ROTACIJA > -0.5*PI) {
		m.loadRotate(CameraPosition, v, -ROTACIJA);
		t1.loadTranslate(0.85, -0.7, 0);
		t2.loadTranslate(-0.85, 0.7, 0);
		mm.loadRotateX(-ROTACIJA);
		mm = t2*mm*t1;
		LookAt_vector = m.Transform(LookAt_vector);
		kocka = mm.TransformVectorArray(kocka);
		Vector4D temp = LookUp_vector;
		temp.m_w = 0;
		temp = m.Transform(temp);
		LookUp_vector = temp;
		rotacijaGoreDole -= ROTACIJA;
	}

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
	case 52:
		rotirajLevo();
		break;
	case 54:
		rotirajDesno();
		break;
	case 50:
		rotacijaDole();
		break;
	case 56:
		rotacijaGore();
		break;
	case 'h':
		if (brzina < 5)
			brzina++;
		break;
	case 'j':
		if (brzina > 1)
			brzina--;
	default:
		break;
	}
	cout << "x= " ;
	cout << CameraPosition.X() <<endl;
	cout << "y= " ;
	cout << CameraPosition.Y() << endl;
	cout << "z= " ;
	cout << CameraPosition.Z() << endl;
	glutPostRedisplay();
}
/* Initialize OpenGL Graphics */
void initGL()
{
	glClearColor(1.0f, 1.0f, 1.0f, 1.0f); // Set background color to black and opaque
	glShadeModel(GL_FLAT);

	glEnable(GL_DEPTH_TEST);   // Enable depth testing for z-culling
}

int main(int argc, char** argv)
{
	glutInit(&argc, argv);            // Initialize GLUT
	glutInitDisplayMode(GLUT_DOUBLE | GLUT_DEPTH | GLUT_STENCIL); // Enable double buffered mode
	glutInitWindowSize(ratio * visina, visina);   // Set the window's initial width & height
	glutInitWindowPosition(50, 50); // Position the window's initial top-left corner
	glutCreateWindow(title);          // Create window with the given title

	kreirajKoordinatni();
	kreirajKontrolnu();
	kreirajBrzinometar();
	kreirajKrug();
	kreirajLines();
	kreirajKocku();

	glutDisplayFunc(display);       // Register callback handler for window re-paint event
	glutReshapeFunc(reshape);       // Register callback handler for window re-size event
	glutKeyboardFunc(tastatura);
	initGL();                       // Our own OpenGL initialization
	glutMainLoop();                 // Enter the infinite event-processing loop
	return 0;

}