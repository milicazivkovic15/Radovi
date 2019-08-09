/*
* OGL01Shape3D.cpp: 3D Shapes
*/
#include <GL/glut.h>  // GLUT, include glu.h and gl.h
#include <math.h>
#include "vector3d.h"
#include "vector4d.h"
#include "matrix4x4.h"

#define PI 3.14

/* Global variables */
char title[] = "3D Shapes";

Vector3D camera = Vector3D(2,2,2);
vector<vector<vector<Vector3D>>> krug;
vector<vector<Vector3D>> valjak;
Vector3D centar = Vector3D(0.0, 0.0, 0.0);
Vector3D centarKupe = Vector3D(0.0, 0.0, 0.0);

Vector3D A = Vector3D(0, 0, 0);
Vector3D B = Vector3D(0, 0, 1);
Vector3D C = Vector3D(1, 0, 0);

double r = 0.5, r2 = 0.9, r3 = 1.3, w = 0.2,korak=0.01;

void kreirajKrug(int k) {
	krug[k].resize(3);
	for (int i = 0; i < 18; i++)
	{
		krug[k][0].push_back(Vector3D(r*cos(i * 2 * PI / 18),0.7, r*sin(i * 2 * PI / 18)));

	}
	for (int i = 0; i <18; i++)
	{
		if (i % 3 == 0) i += 3;
		krug[k][1].push_back(Vector3D(r2*cos(i* (2 * PI / (18 ))),0.7, r2*sin(i* (2 * PI / (18 )))));
	}

	for (int i = 0; i <18; i++)
	{
		krug[k][2].push_back(Vector3D(r3*cos(i* (2 * PI / (18 ))),0.7, r3*sin(i* (2 * PI / (18 )))));
	}

	Matrix4x4 t, r;
	t.loadTranslate(0, 0, 0);
	r.loadRotateY((2 * PI / (18))/2);
	t = t*r;
	krug[k][1] = t.TransformVectorArray(krug[k][1]);
	r.loadRotateY((2 * PI / (18)));
	t = t*r;
	krug[k][2] = t.TransformVectorArray(krug[k][2]);


}
void crtajKrug(int k) {
	
	glBegin(GL_LINE_LOOP);
	for (int i = 0; i < krug[k][0].size(); i++)
	{
		glVertex3d(krug[k][0][i].X(), krug[k][0][i].Y(), krug[k][0][i].Z());
	}
	glEnd();
	
	glBegin(GL_LINE_LOOP);
	int j = 0,br=0;
	for (int i = 0; i < krug[k][0].size(); i++)
	{
		glVertex3d(krug[k][0][i].X(), krug[k][0][i].Y(), krug[k][0][i].Z());

		if (i % 3 == 0 && br == 0)
			br = 1;
		else if (i % 3 == 0 && br == 1)
			br = 0;
		
		glVertex3d(krug[k][2][i].X(), krug[k][2][i].Y(), krug[k][2][i].Z());
		if (br == 0) {
			glVertex3d(krug[k][1][j].X(), krug[k][1][j].Y(), krug[k][1][j].Z());
			j++;
		}
	}
	glEnd();
}


/* Initialize OpenGL Graphics */
void initGL()
{
	glClearColor(0.0f, 0.0f, 0.0f, 1.0f); // Set background color to black and opaque
	glShadeModel(GL_FLAT);

	glEnable(GL_DEPTH_TEST);   // Enable depth testing for z-culling
}

void draw_axis()
{
	Vector3D centar(0.0, 0.0, 0.0);

	glColor3f(1.0, 0.0, 0.0);
	glBegin(GL_LINES);
	glVertex3f(centar.m_x, centar.m_y, centar.m_z);
	glVertex3f(Vector3D::AxisX.m_x, Vector3D::AxisX.m_y, Vector3D::AxisX.m_z);
	glEnd();

	glColor3f(0.0, 1.0, 0.0);
	glBegin(GL_LINES);
	glVertex3f(centar.m_x, centar.m_y, centar.m_z);
	glVertex3f(Vector3D::AxisY.m_x, Vector3D::AxisY.m_y, Vector3D::AxisY.m_z);
	glEnd();

	glColor3f(0.0, 0.0, 1.0);
	glBegin(GL_LINES);
	glVertex3f(centar.m_x, centar.m_y, centar.m_z);
	glVertex3f(Vector3D::AxisZ.m_x, Vector3D::AxisZ.m_y, Vector3D::AxisZ.m_z);
	glEnd();
}
void crtajSuriken() {
	crtajKrug(0);

	Matrix4x4 t, r;
	t.loadTranslate(0, w,0);
	for (int i = 0; i < 3; i++)
	{
		krug[1][i] = t.TransformVectorArray(krug[0][i]);
	}

	crtajKrug(1);

	glBegin(GL_LINES);
	for (int i = 0; i < krug[0][2].size(); i++)
	{
		glVertex3d(krug[0][0][i].X(), krug[0][0][i].Y(), krug[0][0][i].Z());
		glVertex3d(krug[1][0][i].X(), krug[1][0][i].Y(), krug[1][0][i].Z());
		glVertex3d(krug[0][2][i].X(), krug[0][2][i].Y(), krug[0][2][i].Z());
		glVertex3d(krug[1][2][i].X(), krug[1][2][i].Y(), krug[1][2][i].Z());
	}
	glEnd();

	glBegin(GL_LINES);
	for (int i = 0; i < krug[0][1].size(); i++)
	{
		glVertex3d(krug[0][1][i].X(), krug[0][1][i].Y(), krug[0][1][i].Z());
		glVertex3d(krug[1][1][i].X(), krug[1][1][i].Y(), krug[1][1][i].Z());
	}
	glEnd();

}
void kreirajValjak() {
	valjak.resize(3);
	for (int i = 0; i < 360; i++)
	{
		valjak[0].push_back(Vector3D(r*cos(i * 2 * PI / 360),0, r*sin(i * 2 * PI / 360)));
	}

	Matrix4x4 t, r; 
	t.loadTranslate(0, 0.9, 0);
	valjak[0] = t.TransformVectorArray(valjak[0]);
	t.loadTranslate(0, 0.2, 0);	
	valjak[1] = t.TransformVectorArray(valjak[0]);
	r.loadTranslate(0, -0.4, 0);
	valjak[2] = r.TransformVectorArray(valjak[0]);

	

}
void crtajValjak() {
	glBegin(GL_POLYGON);
	for (int i = 0; i <valjak.size(); i++)
	{
		glVertex3d(valjak[0][i].X(),valjak[0][i].Y(), valjak[0][i].Z());
	}
	glEnd();
	glBegin(GL_POLYGON);
	for (int i = 0; i <valjak[0].size(); i++)
	{
		glVertex3d(valjak[1][i].X(), valjak[1][i].Y(), valjak[1][i].Z());
	}
	glEnd();

	glColor3f(0.0, 1.0, 0.0);
	glBegin(GL_POLYGON);
	for (int i = 0; i <valjak[0].size(); i++)
	{
		glVertex3d(valjak[0][i].X(), valjak[0][i].Y(), valjak[0][i].Z());
		glVertex3d(valjak[1][i].X(), valjak[1][i].Y(), valjak[1][i].Z());
	}
	glEnd();
}

void crtajKupu() {
	glColor3f(0,1.0, 0.0);
	glBegin(GL_POLYGON);
	for (int i = 0; i < valjak[2].size(); i++)
	{
		glVertex3d(valjak[2][i].X(), valjak[2][i].Y(), valjak[2][i].Z());
	}
	glEnd();

	glColor3f(1, 0.0, 0.0);
	glBegin(GL_POLYGON);
	for (int i = 0; i < valjak[2].size(); i++)
	{
		glVertex3d(valjak[2][i].X(), valjak[2][i].Y(), valjak[2][i].Z());
		glVertex3d(centarKupe.X(), centarKupe.Y(), centarKupe.Z());
	}
	glEnd();
}
void crtajIKreirajTrougao() {
	glColor3f(1, 0.5, 0.5);
	glBegin(GL_POLYGON);
		glVertex3d(B.X(), B.Y(), B.Z());
		glVertex3d(C.X(), C.Y(), C.Z());
		glVertex3d(A.X(), A.Y(), A.Z());
	glEnd();

}
Vector3D pozicija = Vector3D(0, 0, 0);
void pozicionirajKupu() {
	double tackaX = centarKupe.X();
	double tackaZ = centarKupe.Z();

	Matrix4x4 t,r,p;
	
	p.loadTranslate(-pozicija.X(), -pozicija.Y(),-pozicija.Z());
	r.loadRotateY(PI/8);
	p = r*p;
	for (int i = 0; i < krug.size(); i++)
	{
		for (int j = 0; j < krug[0].size(); j++)
		{

			krug[i][j] = p.TransformVectorArray(krug[i][j]);
		}
	}

	
	if (centarKupe.Z() >= B.Z() || centarKupe.X() >0) {
		if (centarKupe.X() >= C.X() || centarKupe.Z() == 0) {
			tackaZ = 0;
			tackaX -= korak;
			t.loadTranslate(-korak, 0, 0);
			pozicija.X() -= korak;
			pozicija.Z() = 0;
			p.loadTranslate(pozicija.X(), 0, 0);

		}
		else {
			tackaX += korak;
			tackaZ -= korak;
			
			t.loadTranslate(korak, 0, -korak);
			
			pozicija.X() += korak;
			pozicija.Z() -= korak;
			p.loadTranslate(pozicija.X(), 0, pozicija.Z());

		}
	}
	else {
		tackaZ += korak;
		tackaX = 0;
		t.loadTranslate(0, 0, korak);
		pozicija.Z() += korak;
		pozicija.X() = 0;
		p.loadTranslate(0, 0, pozicija.Z());

	}

	centarKupe = Vector3D(tackaX, 0, tackaZ);
	for (int i = 0; i < valjak.size(); i++)
	{
		valjak[i] = t.TransformVectorArray(valjak[i]);
	}

	for (int i = 0; i < krug.size(); i++)
	{
		for (int j = 0; j < krug[0].size(); j++)
		{
			
			krug[i][j]= p.TransformVectorArray(krug[i][j]);
		}
	}

}
void display()
{
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT); // Clear color and depth buffers

	glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);

	draw_axis();
	pozicionirajKupu();

	crtajSuriken();
	
	crtajValjak();
	crtajKupu();

	crtajIKreirajTrougao();
	glutSwapBuffers();
	glutPostRedisplay();// Swap the front and back frame buffers (double buffering)
}

void reshape(GLsizei width, GLsizei height)
{
	if (height == 0) height = 1;
	GLfloat aspect = (GLfloat)width / (GLfloat)height;

	// Set the viewport to cover the new window
	glViewport(0, 0, width, height);

	// Set the aspect ratio of the clipping volume to match the viewport
	glMatrixMode(GL_PROJECTION);  // To operate on the Projection matrix
	glLoadIdentity();             // Reset
	gluPerspective(80.0f, aspect, 0.1f, 20.0f);

	glMatrixMode(GL_MODELVIEW);
	glLoadIdentity();
	gluLookAt(camera.X(), camera.Y(), camera.Z(),
		0.0, 0.0, 0.0,
		0.0, 1.0, 0.0);
}

int main(int argc, char** argv)
{
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_DOUBLE);
	glutInitWindowSize(640, 480);
	glutInitWindowPosition(50, 50);
	glutCreateWindow(title);


	krug.resize(2);
	kreirajKrug(0);
	kreirajKrug(1);
	kreirajValjak();


	glutDisplayFunc(display);
	glutReshapeFunc(reshape);
	initGL();
	glutMainLoop();

	return 0;
}