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

Vector3D camera = Vector3D(3.0, 3.0, 3.0);

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

void display()
{
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT); // Clear color and depth buffers

	glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);

	draw_axis();

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
	glutDisplayFunc(display);
	glutReshapeFunc(reshape);
	initGL();
	glutMainLoop();

	return 0;
}