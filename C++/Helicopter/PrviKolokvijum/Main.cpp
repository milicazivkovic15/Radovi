/*
* OGL01Shape3D.cpp: 3D Shapes
*/
#include <GL/glut.h>  // GLUT, include glu.h and gl.h
#include <math.h>
#include "vector3d.h"
#include "vector4d.h"
#include "matrix4x4.h"

/* Global variables */
char title[] = "3D Shapes";
double w=0.05;

#define PI 3.14
Vector3D camera = Vector3D(2.0, 2.0, 2.0);
Vector3D pozicijaPropelera(0, 0.4, 0.25);
/* Initialize OpenGL Graphics */

Vector3D A = Vector3D(0.5, 0.5, 0.8);
Vector3D B = Vector3D(0.5, 0.5, 1.5);


vector<vector<Vector3D>>propeler;

void kreirajPropeler() {

	propeler.resize(2);
	for (int i = 0; i < 2; i++)
	{
		propeler[i].resize(9);
		propeler[i][0] = Vector3D(-0.03, 0, -0.4);
		propeler[i][1] = Vector3D(0.03, 0, -0.4);

		propeler[i][2] = Vector3D(0.03, 0, 0);

		propeler[i][3] = Vector3D(0.3, 0, 0.3);
		propeler[i][4] = Vector3D(0.28, 0, 0.32);

		propeler[i][5] = Vector3D(0, 0, 0.05);

		propeler[i][6] = Vector3D(-0.28, 0, 0.32);
		propeler[i][7] = Vector3D(-0.3, 0, 0.3);

		propeler[i][8] = Vector3D(-0.03, 0, 0);

	}
	Matrix4x4 t;
	t.loadTranslate(0, 0.4, 0.25);
	propeler[0] = t.TransformVectorArray(propeler[0]);
	t.loadTranslate(0,w+0.4, 0.25);
	propeler[1] = t.TransformVectorArray(propeler[1]);
}

void crtajPropeler() {
	glBegin(GL_LINE_LOOP);
	for (int i = 0; i < propeler[0].size(); i++)
	{
		glVertex3d(propeler[0][i].X(), propeler[0][i].Y(), propeler[0][i].Z());
	}

	glEnd();


	
	glBegin(GL_LINE_LOOP);
	for (int i = 0; i < propeler[0].size(); i++)
	{
		glVertex3d(propeler[1][i].X(), propeler[1][i].Y(), propeler[1][i].Z());
	}

	glEnd();


	glBegin(GL_QUAD_STRIP);
	for (int i = 0; i < propeler[0].size(); i++)
	{
		glVertex3d(propeler[0][i].X(), propeler[0][i].Y(), propeler[0][i].Z());

		glVertex3d(propeler[1][i].X(), propeler[1][i].Y(), propeler[1][i].Z());
	}

	glEnd();

	

}

vector<vector<Vector3D>> telo;

void kreirajAvion() {
	telo.resize(4);
	telo[0].resize(4);
	telo[0][0] = Vector3D(-0.1, 0.1, -0.3);
	telo[0][1] = Vector3D(0.1, 0.1, -0.3);
	telo[0][2] = Vector3D(0.1, -0.1, -0.3);
	telo[0][3] = Vector3D(-0.1, -0.1, -0.3);

	telo[1].resize(4);

	telo[1][0] = Vector3D(-0.2, 0.2, 0);
	telo[1][1] = Vector3D(0.2, 0.2, 0);
	telo[1][2] = Vector3D(0.2, -0.2, 0);
	telo[1][3] = Vector3D(-0.2, -0.2, 0);

	telo[2].resize(4);

	telo[2][0] = Vector3D(-0.2, 0.2, 0.5);
	telo[2][1] = Vector3D(0.2, 0.2, 0.5);
	telo[2][2] = Vector3D(0.2, -0.2, 0.5);
	telo[2][3] = Vector3D(-0.2, -0.2, 0.5);

	telo[3].resize(4);

	telo[3][0] = Vector3D(-0.1, 0.1, 0.8);
	telo[3][1] = Vector3D(0.1, 0.1, 0.8);
	telo[3][2] = Vector3D(0.1, -0.1, 0.8);
	telo[3][3] = Vector3D(-0.1, -0.1, 0.8);

	Matrix4x4 t1, t2;
	t1.loadTranslate(0, 0.04, 0);
	t2.loadTranslate(0, -0.04, 0);

	telo[0] = t1.TransformVectorArray(telo[0]);
	telo[3] = t2.TransformVectorArray(telo[3]);



}

void crtajAvion() {

	for (int i = 0; i < 4; i++)
	{
		glBegin(GL_QUADS);
		for (int j = 0; j < 4; j++)
		{
			glVertex3d(telo[i][j].X(), telo[i][j].Y(), telo[i][j].Z());

		}
		glEnd();

	}
	glBegin(GL_LINES);
	for (int j = 0; j < 4; j++)
	{
		glVertex3d(telo[0][j].X(), telo[0][j].Y(), telo[0][j].Z());
		glVertex3d(telo[1][j].X(), telo[1][j].Y(), telo[1][j].Z());


		glVertex3d(telo[2][j].X(), telo[2][j].Y(), telo[2][j].Z());
		glVertex3d(telo[3][j].X(), telo[3][j].Y(), telo[3][j].Z());
	}
	glEnd();
	glBegin(GL_QUAD_STRIP);
	for (int j = 0; j < 4; j++)
	{
		glVertex3d(telo[1][j].X(), telo[1][j].Y(), telo[1][j].Z());
		glVertex3d(telo[2][j].X(), telo[2][j].Y(), telo[2][j].Z());
	}
	glEnd();

}

vector<vector<Vector3D>> valjak;
double r = 0.02;
void kreirajValjak() {
	valjak.resize(2);
	for (int i = 0; i < 360; i++)
	{
		valjak[0].push_back(Vector3D(r*cos(2 * i*PI / 360), 0, r*sin(2 * i*PI / 360)));
		valjak[1].push_back(Vector3D(r*cos(2 * i*PI / 360), 0.2, r*sin(2 * i*PI / 360)));
	}

	Matrix4x4 t;
	t.loadTranslate(0, 0.2, 0.25);
	valjak[0] = t.TransformVectorArray(valjak[0]);
	valjak[1] = t.TransformVectorArray(valjak[1]);
}
void crtajValjak() {
	glColor3f(1, 0, 1);
	glBegin(GL_POLYGON);
	for (int j = 0; j < 360; j++)
	{
		glVertex3d(valjak[0][j].X(), valjak[0][j].Y(), valjak[0][j].Z());
	}
	glEnd();
	glBegin(GL_POLYGON);
	for (int j = 0; j < 360; j++)
	{
		glVertex3d(valjak[1][j].X(), valjak[1][j].Y(), valjak[1][j].Z());
	}
	glEnd();

	glBegin(GL_POLYGON);
	for (int j = 0; j < 360; j++)
	{
		glVertex3d(valjak[0][j].X(), valjak[0][j].Y(), valjak[0][j].Z());
		glVertex3d(valjak[1][j].X(), valjak[1][j].Y(), valjak[1][j].Z());
	}
	glEnd();

}


vector<vector<Vector3D>> rep;
void kreirajRep() {
	rep.resize(4);

	rep[0].resize(8);
	rep[0][0] = Vector3D(-0.1, 0.1, -0.3);
	rep[0][1] = Vector3D(0.1, 0.1, -0.3);
	rep[0][2] = Vector3D(0.1, -0.1, -0.3);
	rep[0][3] = Vector3D(-0.1, -0.1, -0.3);
	rep[0][4] = Vector3D(-0.1, 0.1, -0.8);
	rep[0][5] = Vector3D(0.1, 0.1, -0.8);
	rep[0][6] = Vector3D(0.1, -0.1, -0.8);
	rep[0][7] = Vector3D(-0.1, -0.1, -0.8);
	for (int i = 1; i < 4; i++)
	{
		rep[i].resize(8);
		rep[i][0] = Vector3D(-0.1, 0, 0);
		rep[i][1] = Vector3D(0.1, 0, 0);
		rep[i][2] = Vector3D(0.1, 0, -0.10);
		rep[i][3] = Vector3D(-0.1, 0,-0.10);
		rep[i][4] = Vector3D(-0.1, 0.05, 0);
		rep[i][5] = Vector3D(0.1, 0.05,0);
		rep[i][6] = Vector3D(0.1, 0.05, -0.1);
		rep[i][7] = Vector3D(-0.1, 0.05, -0.1);
	}
	Matrix4x4 t,r;
	t.loadTranslate(-0.15, 0,-0.7);
	rep[1] = t.TransformVectorArray(rep[1]);
	t.loadTranslate(0.15, 0, -0.7);
	rep[2] = t.TransformVectorArray(rep[2]);
	t.loadTranslate(0, 0.1, -0.8);

	r.loadRotateZ(PI / 2);
	t = t*r;

	rep[3] = t.TransformVectorArray(rep[3]);



}
void crtajRep() {

	for (int i = 0; i < rep.size(); i++)
	{
		if (i != 0)
			glColor3f(0, 1, 1);
		glBegin(GL_QUADS);
		for (int j = 0; j < 4; j++)
		{
			glVertex3d(rep[i][j].X(), rep[i][j].Y(), rep[i][j].Z());
			
		}
		glBegin(GL_QUADS);
		for (int j = 4; j < 8; j++)
		{
			glVertex3d(rep[i][j].X(), rep[i][j].Y(), rep[i][j].Z());

		}
		glEnd();
		glBegin(GL_QUAD_STRIP);
		for (int j = 0; j < 4; j++)
		{
			glVertex3d(rep[i][j].X(), rep[i][j].Y(), rep[i][j].Z());
			glVertex3d(rep[i][j + 4].X(), rep[i][j + 4].Y(), rep[i][j + 4].Z());

		}
		glEnd();

	}

}


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

void display()
{
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT); // Clear color and depth buffers

	glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);

	draw_axis();

	crtajAvion();
	crtajRep();

	crtajValjak();
	crtajPropeler();

	glutSwapBuffers();  // Swap the front and back frame buffers (double buffering)
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
void pozicioniraj() {
	Matrix4x4 t1, t2, r,t;
	double korak = 0;
	if (pozicijaPropelera.Z()<B.Z())
		korak= 0.1;
	t1.loadTranslate(-pozicijaPropelera.X(), -pozicijaPropelera.Y(), -pozicijaPropelera.Z());
	t2.loadTranslate(pozicijaPropelera.X(), pozicijaPropelera.Y(), pozicijaPropelera.Z()+korak);
	r.loadRotateY(PI/20);
	r = t2*r*t1;
	for (int i = 0; i < propeler.size(); i++)
	{
		propeler[i] = r.TransformVectorArray(propeler[i]);
	}
	if (pozicijaPropelera.Z() < B.Z()) {
		pozicijaPropelera.m_z += 0.1;

		t.loadTranslate(0, 0, 0.1);
		for (int i = 0; i < telo.size(); i++)
		{
			telo[i] = t.TransformVectorArray(telo[i]);
		}
		for (int i = 0; i < valjak.size(); i++)
		{
			valjak[i] = t.TransformVectorArray(valjak[i]);
		}
		for (int i = 0; i < rep.size(); i++)
		{
			rep[i] = t.TransformVectorArray(rep[i]);
		}
		

	}


}
void pocetak() {
	Matrix4x4 t;
	t.loadTranslate(A.X(),A.Y(),0);
	for (int i = 0; i < telo.size(); i++)
	{
		telo[i] = t.TransformVectorArray(telo[i]);
	}
	for (int i = 0; i < valjak.size(); i++)
	{
		valjak[i] = t.TransformVectorArray(valjak[i]);
	}
	for (int i = 0; i < rep.size(); i++)
	{
		rep[i] = t.TransformVectorArray(rep[i]);
	}
	for (int i = 0; i < propeler.size(); i++)
	{
		propeler[i] = t.TransformVectorArray(propeler[i]);
	}
	pozicijaPropelera = t.Transform(pozicijaPropelera);

}
int tajmer = 0;
void mouse(int button ,int state, int x, int y) {
	if (button == GLUT_LEFT_BUTTON && state == GLUT_DOWN) {
		tajmer = 1;
	}

}

void timerF(int v) {
	if (tajmer) {
		pozicioniraj();
	}
	glutTimerFunc(100, timerF, 0);
	glutPostRedisplay();
}

int main(int argc, char** argv)
{
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_DOUBLE);
	glutInitWindowSize(640, 480);
	glutInitWindowPosition(50, 50);
	glutCreateWindow(title);


	kreirajPropeler();
	kreirajAvion();
	kreirajValjak();
	kreirajRep();
	pocetak();

	glutDisplayFunc(display);
	glutReshapeFunc(reshape);
	glutMouseFunc(mouse);
	glutTimerFunc(100, timerF, 0);
	initGL();
	glutMainLoop();

	return 0;
}
