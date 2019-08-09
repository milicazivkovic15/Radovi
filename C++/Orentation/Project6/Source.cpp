#include <GL/freeglut.h>
#include <math.h>
#include <sstream>
//#include <iomanip>
#include "vector4d.h"
#include "matrix4x4.h"
#include <vector>
#include <GL/freeglut.h>

#define M_PI 3.14
using namespace std;

char title[] = "Plane";

#define MOVING_CONST 0.1
#define ROTATION_CONST 3.14/180.0

Vector3D CameraPosition(0.0, 0.0, 5.0);
#define LOOK_MOVEMENT_CONST 0.1
Vector3D LookAt_vector(0.0, 0.0, 0.0);
Vector3D LookUp_vector(0.0, 1.0, 0.0);

vector<Vector3D> cube;

vector<Vector3D> coordinateSystem;

vector<Vector3D> planePanel;
double alpha = 90;

double visina = 480;
double ratio = 16.0 / 9.0;

vector<Vector3D> kompasOsnova;
vector<Vector3D> kompasStrelica;
vector< vector<Vector3D>> meracBrzine;


double r_kompas = 1.0;
double r_kompas_real = 5.0;
int circle_points_kompas = 50;

int speedIndicator = 0;
double streliceRotate = 0.0;
double rotationUpDown = 0.0;

void Transform(vector<Vector3D>&a, Matrix4x4 &T)
{
	for (int i = 0; i < (int)a.size(); i++)
		a[i] = T.Transform(a[i]);
}

void Translate(vector<Vector3D>&a, double tx, double ty, double tz)
{
	Matrix4x4 mt;
	mt.loadTranslate(tx, ty, tz);
	for (int i = 0; i < (int)a.size(); i++)
		a[i] = mt*a[i];
}

void createCubeCoordinates(double a)
{
	double half_a = a * 0.5;

	cube.resize(8);
	cube[0] = (Vector3D(-half_a, -half_a, half_a));
	cube[1] = (Vector3D(half_a, -half_a, half_a));
	cube[2] = (Vector3D(half_a, -half_a, -half_a));
	cube[3] = (Vector3D(-half_a, -half_a, -half_a));
	cube[4] = (Vector3D(-half_a, half_a, half_a));
	cube[5] = (Vector3D(half_a, half_a, half_a));
	cube[6] = (Vector3D(half_a, half_a, -half_a));
	cube[7] = (Vector3D(-half_a, half_a, -half_a));

	Matrix4x4 MT, MT1, MT2, MT3;
	MT.identity();
	MT1.identity();
	MT2.identity();
	MT3.identity();
	MT1.loadScale(1.0, 2.0, 0.5);

	MT = MT3*MT2*MT1;
	Transform(cube, MT);

	
}


void createDS()
{
	meracBrzine.resize(6);
	double y = -0.8;
	for (int i = 0; i < 6; i++)
	{
		meracBrzine[i].resize(4);
		meracBrzine[i][0] = Vector3D(-0.6, y, 0);
		meracBrzine[i][1] = Vector3D(-0.53, y, 0);
		y += 0.02;
		meracBrzine[i][2] = Vector3D(-0.53, y, 0);
		meracBrzine[i][3] = Vector3D(-0.6, y, 0);
		y += 0.01;
	}


}

void DrawPolygon(vector<Vector3D> poly) {
	glBegin(GL_POLYGON);
	for (int i = 0; i < poly.size(); i++)
	{
		glVertex3f(poly[i].X(), poly[i].Y(), poly[i].Z());
	}
	glEnd();
}

void createAxis()
{
	coordinateSystem.resize(4);

	coordinateSystem[0] = Vector3D(0, 0, 0);

	coordinateSystem[1] = Vector3D(Vector3D::AxisX.m_x, Vector3D::AxisX.m_y, Vector3D::AxisX.m_z);
	coordinateSystem[2] = Vector3D(Vector3D::AxisY.m_x, Vector3D::AxisY.m_y, Vector3D::AxisY.m_z);
	coordinateSystem[3] = Vector3D(Vector3D::AxisZ.m_x, Vector3D::AxisZ.m_y, Vector3D::AxisZ.m_z);

	Matrix4x4 T;
	T.loadTranslate(-0.5, -0.5, 0);

	coordinateSystem = T.TransformVectorArray(coordinateSystem);

}

void draw_axis() {
	Vector3D centar = coordinateSystem[0];

	glColor3f(1.0, 0.0, 0.0);
	glBegin(GL_LINES);
	glVertex3f(centar.X(), centar.Y(), centar.Z());
	glVertex3f(coordinateSystem[1].X(), coordinateSystem[1].Y(), coordinateSystem[1].Z());
	glEnd();

	glColor3f(0.0, 1.0, 0.0);
	glBegin(GL_LINES);
	glVertex3f(centar.X(), centar.Y(), centar.Z());
	glVertex3f(coordinateSystem[2].X(), coordinateSystem[2].Y(), coordinateSystem[2].Z());
	glEnd();

	glColor3f(0.0, 0.0, 1.0);
	glBegin(GL_LINES);
	glVertex3f(centar.X(), centar.Y(), centar.Z());
	glVertex3f(coordinateSystem[3].X(), coordinateSystem[3].Y(), coordinateSystem[3].Z());
	glEnd();
}


void drawCube()
{
	glBegin(GL_QUADS);
	// bottom
	glVertex3f(cube[0].m_x, cube[0].m_y, cube[0].m_z);
	glVertex3f(cube[3].m_x, cube[3].m_y, cube[3].m_z);
	glVertex3f(cube[2].m_x, cube[2].m_y, cube[2].m_z);
	glVertex3f(cube[1].m_x, cube[1].m_y, cube[1].m_z);

	// far
	glVertex3f(cube[7].m_x, cube[7].m_y, cube[7].m_z);
	glVertex3f(cube[6].m_x, cube[6].m_y, cube[6].m_z);
	glVertex3f(cube[2].m_x, cube[2].m_y, cube[2].m_z);
	glVertex3f(cube[3].m_x, cube[3].m_y, cube[3].m_z);

	// left
	glVertex3f(cube[7].m_x, cube[7].m_y, cube[7].m_z);
	glVertex3f(cube[3].m_x, cube[3].m_y, cube[3].m_z);
	glVertex3f(cube[0].m_x, cube[0].m_y, cube[0].m_z);
	glVertex3f(cube[4].m_x, cube[4].m_y, cube[4].m_z);

	// right
	glVertex3f(cube[5].m_x, cube[5].m_y, cube[5].m_z);
	glVertex3f(cube[1].m_x, cube[1].m_y, cube[1].m_z);
	glVertex3f(cube[2].m_x, cube[2].m_y, cube[2].m_z);
	glVertex3f(cube[6].m_x, cube[6].m_y, cube[6].m_z);

	// top
	glVertex3f(cube[5].m_x, cube[5].m_y, cube[5].m_z);
	glVertex3f(cube[6].m_x, cube[6].m_y, cube[6].m_z);
	glVertex3f(cube[7].m_x, cube[7].m_y, cube[7].m_z);
	glVertex3f(cube[4].m_x, cube[4].m_y, cube[4].m_z);

	// near
	glVertex3f(cube[5].m_x, cube[5].m_y, cube[5].m_z);
	glVertex3f(cube[4].m_x, cube[4].m_y, cube[4].m_z);
	glVertex3f(cube[0].m_x, cube[0].m_y, cube[0].m_z);
	glVertex3f(cube[1].m_x, cube[1].m_y, cube[1].m_z);
	glEnd();
}

void drawWiredFrameCube()
{
	glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
	glEnable(GL_POLYGON_OFFSET_FILL);
	glPolygonOffset(1.0, 1.0);
	glColor3f(0.0, 0.5, 0.0);
	drawCube();
	glDisable(GL_POLYGON_OFFSET_FILL);

	glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
	glColor3f(1.0, 0.0, 0.0);
	drawCube();
}

void ds()
{
	glColor3f(1, 0, 0);
	for (int i = 0; i < meracBrzine.size(); i++)
	{
		if (i > speedIndicator)
			glColor3f(0, 0, 1);
		else
			glColor3f(1, 0, 0);
		DrawPolygon(meracBrzine[i]);
	}
}

void drawCommandTable() {
	glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
	glColor3f(1, 1, 1);

	glBegin(GL_POLYGON);
	glVertex2f(0.8, -1);
	glVertex2f(1, -1);
	glVertex2f(1, 1);
	glVertex2f(0.8, 1);
	glEnd();
	glBegin(GL_POLYGON);
	glVertex2f(-1, 1);
	glVertex2f(1, 1);
	glVertex2f(1, .8);
	glVertex2f(-1, .8);
	glEnd();
	glBegin(GL_POLYGON);
	glVertex2f(-0.8, -1);
	glVertex2f(-1, -1);
	glVertex2f(-1, 1);
	glVertex2f(-0.8, 1);
	glEnd();

	glColor3f(0.8, 0.8, 0.8);
	glBegin(GL_POLYGON);
	glVertex2f(-1, -1);
	glVertex2f(-0.8, -0.6);
	glVertex2f(0.8, -.6);
	glVertex2f(1, -1);
	glEnd();
}

void RenderSting()
{
	glColor3f(0, 0, 0);
	glRasterPos2f(-0.8, -0.7);

	char s[100];

	sprintf_s(s, "x = %.2lf\ny = %.2lf\nz = %.2lf\n", CameraPosition.X(), CameraPosition.Y(), CameraPosition.Z());
	glutBitmapString(GLUT_BITMAP_HELVETICA_18, (const unsigned char *)s);
}

void display()
{
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT); // Clear color and depth buffers


	gluPerspective(alpha, ratio, 0.1f, 20.0f);

	gluLookAt(CameraPosition.m_x, CameraPosition.m_y, CameraPosition.m_z,
		LookAt_vector.m_x, LookAt_vector.m_y, LookAt_vector.m_z,
		LookUp_vector.m_x, LookUp_vector.m_y, LookUp_vector.m_z);

	drawWiredFrameCube();


	glMatrixMode(GL_MODELVIEW);
	glLoadIdentity();
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();

	glDisable(GL_DEPTH_TEST);

	//2D
	drawCommandTable();
	ds();
	RenderSting();
	draw_axis();

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

void moveForward()
{
	Matrix4x4 MT;
	Vector3D V;
	Vector3D L, T;

	V = LookAt_vector - CameraPosition;
	V.m_y = 0.0;
	V.Normalize();
	V = V*(speedIndicator*MOVING_CONST);
	MT.loadTranslate(V.m_x, V.m_y, V.m_z);

	CameraPosition = MT.Transform(CameraPosition);
	LookAt_vector = MT.Transform(LookAt_vector);
}

void moveBackward()
{
	Matrix4x4 MT;
	Vector3D V;
	Vector3D L, T;

	V = LookAt_vector - CameraPosition;
	V.Normalize();
	V.m_y = 0.0;
	V = -V*(speedIndicator*MOVING_CONST);
	MT.loadTranslate(V.m_x, V.m_y, V.m_z);

	CameraPosition = MT.Transform(CameraPosition);
	LookAt_vector = MT.Transform(LookAt_vector);
}

void speedUp()
{
	if (speedIndicator + 1 < 6)
		speedIndicator++;
	glutPostRedisplay();
}

void speedDown()
{
	if (speedIndicator - 1 >= 0)
		speedIndicator--;
	glutPostRedisplay();
}

void turnLeft()
{
	Matrix4x4 MT;
	Matrix4x4 Mr, Mtr1, Mtr2;

	Mtr1.loadTranslate(-CameraPosition.m_x, -CameraPosition.m_y, -CameraPosition.m_z);
	Mtr2.loadTranslate(CameraPosition.m_x, CameraPosition.m_y, CameraPosition.m_z);
	Mr.loadRotateY(ROTATION_CONST);

	MT = Mtr2 * Mr * Mtr1;

	LookAt_vector = MT.Transform(LookAt_vector);

	Vector4D LookUp_vector4d = LookUp_vector;
	LookUp_vector4d.m_w = 0.0;
	LookUp_vector4d = MT.Transform(LookUp_vector4d);
	LookUp_vector = LookUp_vector4d;

	Matrix4x4 R;
	R.rotacijaOkoOse(coordinateSystem[2] - coordinateSystem[0], coordinateSystem[0], ROTATION_CONST);

	coordinateSystem = R.TransformVectorArray(coordinateSystem);

}

void turnRight()
{
	Matrix4x4 MT;
	Matrix4x4 Mr, Mtr1, Mtr2;

	Mtr1.loadTranslate(-CameraPosition.m_x, -CameraPosition.m_y, -CameraPosition.m_z);
	Mtr2.loadTranslate(CameraPosition.m_x, CameraPosition.m_y, CameraPosition.m_z);
	Mr.loadRotateY(-ROTATION_CONST);

	MT = Mtr2 * Mr * Mtr1;

	LookAt_vector = MT.Transform(LookAt_vector);

	Vector4D LookUp_vector4d = LookUp_vector;
	LookUp_vector4d.m_w = 0.0;
	LookUp_vector4d = MT.Transform(LookUp_vector4d);
	LookUp_vector = LookUp_vector4d;

	Matrix4x4 R;
	R.rotacijaOkoOse(coordinateSystem[2] - coordinateSystem[0], coordinateSystem[0], -ROTATION_CONST);

	coordinateSystem = R.TransformVectorArray(coordinateSystem);

}

void lookUp()
{
	Matrix4x4 MT;
	Vector3D f = LookAt_vector - CameraPosition;
	Vector3D w = LookUp_vector.Cross(f);

	w.Normalize();

	if (rotationUpDown + ROTATION_CONST < 0.5*M_PI)
	{
		MT.loadRotate(CameraPosition, w, -ROTATION_CONST);

		LookAt_vector = MT.Transform(LookAt_vector);

		Vector4D LookUp_vector4d = LookUp_vector;
		LookUp_vector4d.m_w = 0.0;
		LookUp_vector4d = MT.Transform(LookUp_vector4d);
		LookUp_vector = LookUp_vector4d;

		rotationUpDown += ROTATION_CONST;

	}
}

void lookDown()
{
	Matrix4x4 MT;
	Vector3D f = LookAt_vector - CameraPosition;
	Vector3D w = LookUp_vector.Cross(f);

	w.Normalize();

	if (rotationUpDown + ROTATION_CONST > -0.5*M_PI)
	{
		MT.loadRotate(CameraPosition, w, ROTATION_CONST);

		LookAt_vector = MT.Transform(LookAt_vector);

		Vector4D LookUp_vector4d = LookUp_vector;
		LookUp_vector4d.m_w = 0.0;
		LookUp_vector4d = MT.Transform(LookUp_vector4d);
		LookUp_vector = LookUp_vector4d;

		rotationUpDown -= ROTATION_CONST;

	}
}

void KeyboardKeyPressed(unsigned char key, int x, int y)
{
	switch (key)
	{
	case 27:    //ESC key
		exit(0);
		break;
	case 'w':
		cout << "w pressed -> moving forward" << endl;
		moveForward();
		break;
	case 's':
		cout << "s pressed -> moving backward" << endl;
		moveBackward();
		break;
	case 'u':
		cout << "u pressed -> SpeedUp" << endl;
		speedUp();
		break;
	case 'j':
		cout << "j pressed -> SpeedDown" << endl;
		speedDown();
		break;
	case 52:
		cout << "4 pressed -> turning left" << endl;
		turnLeft();
		break;
	case 54:
		cout << "6 pressed -> turning right" << endl;
		turnRight();
		break;
	case 50:
		cout << "2 pressed -> look up" << endl;
		lookDown();
		break;
	case 56:
		cout << "8 pressed -> look down" << endl;
		lookUp();
		break;
	}

	glutPostRedisplay();
}

/* Initialize OpenGL Graphics */
void initGL()
{
	glClearColor(0.0f, 0.0f, 0.0f, 1.0f); // Set background color to black and opaque
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

	createCubeCoordinates(2.0);
	createDS();
	createAxis();

	glutDisplayFunc(display);       // Register callback handler for window re-paint event
	glutReshapeFunc(reshape);       // Register callback handler for window re-size event

	glutKeyboardFunc(KeyboardKeyPressed);

	initGL();                       // Our own OpenGL initialization
	glutMainLoop();                 // Enter the infinite event-processing loop
	return 0;
}