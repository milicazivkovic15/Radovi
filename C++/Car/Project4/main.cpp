/*
* OGL01Shape3D.cpp: 3D Shapes
*/
#include <GL/freeglut.h>
#include <math.h>
#include "vector3d.h"
#include "vector4d.h"
#include "matrix4x4.h"

#define PI 3.14
/* Global variables */
char title[] = "3D Shapes";
vector<vector<Vector3D>> kola;

Vector3D camera = Vector3D(3.0, 3.0, 3.0);
vector<vector<vector<vector<Vector3D>>>> suriken;
/* Initialize OpenGL Graphics */
double alfa = 60;
int dots = 24;
double r1 = 0.4;

double korak = 0.01, pozicija = 0;
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


void kreirajSuriken(int br) {
	for (int k = 0; k < 2; k++)
	{
		r1 = 0.4;

		suriken[br][k].resize(2);
		for (int j = 0; j < 2; j++)
		{
			for (int i = 0; i < dots; i++)
			{
				suriken[br][k][j].push_back(Vector3D(r1*cos(i * 2 * PI / dots),r1*sin(i * 2 * PI / dots),0));
			}
			r1 += 0.3;
		}
		Matrix4x4 t, r;
		r.loadRotateZ(-2*PI/dots);
		suriken[br][k][1] = r.TransformVectorArray(suriken[br][k][1]);
	}
}

void crtajSuriken(int br) {
	for (int i = 0; i <2; i++)
	{
		glColor3d(1, i, 0);
		glBegin(GL_LINE_LOOP);
		for (int j = 0; j <dots; j++)
		{

			glVertex3d(suriken[br][i][0][j].X(), suriken[br][i][0][j].Y(), suriken[br][i][0][j].Z());
			j++;
			glVertex3d(suriken[br][i][0][j].X(), suriken[br][i][0][j].Y(), suriken[br][i][0][j].Z());
			j--;

			glVertex3d(suriken[br][i][1][j].X(), suriken[br][i][1][j].Y(), suriken[br][i][1][j].Z());
			j++;
			glVertex3d(suriken[br][i][1][j].X(), suriken[br][i][1][j].Y(), suriken[br][i][1][j].Z());


		}
		glEnd();
	}

	Matrix4x4 t;
	t.loadTranslate(0, 0, 0.2);
	for (int i = 0; i < 2; i++)
	{
		suriken[br][1][i] = t.TransformVectorArray(suriken[br][0][i]);
	}

	
}
void kreirajKola() {
	kola[0][0] = Vector3D(0, 0, 0);
	kola[0][1] = Vector3D(0, 0, -1.4);
	kola[0][3] = Vector3D(1.6, 0, -1.4);
	kola[0][2] = Vector3D(1.6, 0, 0);

	kola[1][0] = Vector3D(0, 0.2, 0);
	kola[1][1] = Vector3D(0, 0.2, -1.4);
	kola[1][3] = Vector3D(1.6, 0.2, -1.4);
	kola[1][2] = Vector3D(1.6, 0.2, 0);
}
void crtajKola() {
	Matrix4x4 t, t1, t2;

	t.loadTranslate(0, 0, -1.6);
	for (int j = 0; j < 2; j++)
	{
		for (int i = 0; i < 2; i++)
		{
			suriken[1][j][i] = t.TransformVectorArray(suriken[0][j][i]);
		}
	}
	t1.loadTranslate(1.6, 0, 0);
	for (int j = 0; j < 2; j++)
	{
		for (int i = 0; i < 2; i++)
		{
			suriken[2][j][i] = t1.TransformVectorArray(suriken[0][j][i]);
		}
	}
	t2.loadTranslate(1.6, 0, -1.6);
	for (int j = 0; j < 2; j++)
	{
		for (int i = 0; i < 2; i++)
		{
			suriken[3][j][i] = t2.TransformVectorArray(suriken[0][j][i]);
		}
	}

	
	glColor3d(0, 1, 1);
	for (int j = 0; j < 2; j++)
	{
		glBegin(GL_QUAD_STRIP);

		for (int i = 0; i< 4; i++)
		{
			glVertex3d(kola[j][i].X(), kola[j][i].Y(), kola[j][i].Z());
		}

		glEnd();
	}
	
}

void pozicioniraj() {
	Matrix4x4 t, r,t1,t2;
	t2.loadTranslate(-pozicija, 0, 0);
	r.loadRotateZ(PI/24);
	t2 = r*t2;
	for (int i = 0; i < 4; i++)
	{
		for (int j = 0; j < 2; j++)
		{

			suriken[i][j][0] = t2.TransformVectorArray(suriken[i][j][0]);

			suriken[i][j][1] = t2.TransformVectorArray(suriken[i][j][1]);
		}
	}
	pozicija += korak;
	t2.loadTranslate(pozicija, 0, 0);
	for (int i = 0; i < 4; i++)
	{
		for (int j = 0; j < 2; j++)
		{

			suriken[i][j][0] = t2.TransformVectorArray(suriken[i][j][0]);

			suriken[i][j][1] = t2.TransformVectorArray(suriken[i][j][1]);
		}
	}

	double beta =  2*PI ;
	
	t1.loadTranslate(korak, 0, 0);
	for (int i = 0; i < 2; i++)
	{
		kola[i] = t1.TransformVectorArray(kola[i]);
	}
	
	
}

void display()
{
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT); // Clear color and depth buffers

	glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);

	draw_axis();
	
	pozicioniraj();
	crtajKola();
	for (int i = 0; i < 4; i++)
	{
		crtajSuriken(i);

	}
	glutPostRedisplay();
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

int main(int argc, char** argv)
{
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_DOUBLE);
	glutInitWindowSize(640, 480);
	glutInitWindowPosition(50, 50);
	glutCreateWindow(title);

	kola.resize(2);
	kola[0].resize(4);
	kola[1].resize(4);


	suriken.resize(4);
	kreirajKola();
	for (int i = 0; i < 4; i++)
	{
		suriken[i].resize(2);

		kreirajSuriken(i);
	}
	

	glutDisplayFunc(display);
	glutReshapeFunc(reshape);
	initGL();
	glutMainLoop();

	return 0;
}